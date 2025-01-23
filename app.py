from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
from google_apis import create_service
from config import CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES, VENMO, ZELLE 
from email_utils import process_transaction_emails
from db_schema import ORDERS_COLUMNS, ORDERS_SCHEMA
from db_table import db_table

app = Flask(__name__, static_folder="static", template_folder="templates")
service = create_service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)
socketio = SocketIO(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/order')
def order():
    return render_template('menu.html')

@app.route('/pay')
def pay():
    return render_template('pay.html')

@app.route('/check-payment', methods=['POST'])
def check_payment():
    # data sent by kiosk order
    data = request.json
    paymentType = data.get('paymentType')
    total = data.get('total')
    subtotal = data.get('subtotal')
    tip = data.get('tip')
    discount = data.get('discount')
    cart = data.get('cart')
    cartSummary = ", ".join(f"{value} {key}" for key, value in cart.items())

    # get transactions based on type
    transactions = []
    if paymentType == 'venmo':
        transactions = process_transaction_emails(VENMO, service)
    elif paymentType == 'zelle':
        transactions = process_transaction_emails(ZELLE, service)

    # Check if user paid
    result = ''
    if len(transactions) > 0:
        id, name, amount, time = transactions[0]
        if float(amount) >= float(total):
            result = 'Successful payment'

            # Add order to database
            orders_db = db_table('Orders', ORDERS_SCHEMA)
            order_data = [id, name, time, paymentType, total, subtotal, tip, discount, False, cartSummary]
            db_entry = dict(zip(ORDERS_COLUMNS, order_data)) | cart
            #orders_db.insert(entry)
            orders_db.close()

            # Send data to dashboard
            socketio.emit('newOrder', 
                {"name": name, "cartSummary": cartSummary, "total": total, "time": time, "paymentType": paymentType}
            )
        else:
            missing_payment = float(total) - float(amount)
            result = 'Underpaid by ' + f'{missing_payment:.2f}'
    else:
        result = 'No payment processed. Try again.'

    return jsonify({"status": "success", "message": result})

# WebSocket event handler for connection
@socketio.on('connect')
def handle_connect():
    print('Client connected')

# WebSocket event handler for disconnection
@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
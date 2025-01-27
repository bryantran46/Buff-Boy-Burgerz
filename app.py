from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO
from google_apis import create_service
from config import CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES, VENMO, ZELLE 
from email_utils import process_transaction_emails
from db_schema import CASH_COLUMNS, DASHBOARD_COLUMNS, DB_NAME, ORDERS_COLUMNS, ORDERS_SCHEMA
from db_table import db_table
from datetime import datetime

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

@app.route('/check-e-payment', methods=['POST'])
def check_e_payment():
    # data sent by kiosk order
    data = request.json
    paymentType = data.get('paymentType')
    total = data.get('total')
    subtotal = data.get('subtotal')
    tip = data.get('tip')
    discount = data.get('discount')
    cart = data.get('cart')
    cartSummary = ", ".join(f"{value} {key}" for key, value in cart.items())
    numBurgers = data.get('numBurgers')

    # get transactions based on type
    transactions = []
    if paymentType == 'venmo':
        transactions = process_transaction_emails(VENMO, service)
    elif paymentType == 'zelle':
        transactions = process_transaction_emails(ZELLE, service)

    # Check if user paid
    result = ''
    if len(transactions) > 0:
        internalDate, name, amount, time = transactions[0]
        print('Time:', internalDate)
        if float(amount) >= float(total):
            result = 'Successful payment'

            # Add order to database
            orders_db = db_table(DB_NAME, ORDERS_SCHEMA)
            order_data = [name, time, internalDate, False, paymentType, total, subtotal, tip, discount, cartSummary, numBurgers]
            db_entry = dict(zip(ORDERS_COLUMNS, order_data)) | cart
            orders_db.insert(db_entry)
            id = orders_db.select(columns=['id'], order_by={ "id": "DESC" })[0]['id']
            orders_db.close()

            # Send data to dashboard
            socketio.emit('newOrder', 
                dict(zip(DASHBOARD_COLUMNS, [id, name, cartSummary, total, time, paymentType, numBurgers])),
            )
        else:
            missing_payment = float(total) - float(amount)
            result = 'Underpaid by ' + f'{missing_payment:.2f}'
    else:
        result = 'No payment processed. Try again.'

    return jsonify({"status": "success", "message": result})

@app.route('/check-cash-payment', methods=['POST'])
def check_cash_payment():
    # data sent by kiosk order
    data = request.json
    name = data.get('name')
    paymentType = data.get('paymentType')
    total = data.get('total')
    subtotal = data.get('subtotal')
    tip = data.get('tip')
    discount = data.get('discount')
    cart = data.get('cart')
    cartSummary = ", ".join(f"{value} {key}" for key, value in cart.items())
    numBurgers = data.get('numBurgers')

    order_data = [name, paymentType, total, subtotal, tip, discount, cartSummary, numBurgers, cart]
    socketio.emit('cashOrder', dict(zip(CASH_COLUMNS, order_data)))

    return jsonify({"status": "success", "message": "Awaiting accept of order"})


# WebSocket event handler for connection
@socketio.on('connect')
def handle_connect():
    print('Client connected')

    orders_db = db_table(DB_NAME, ORDERS_SCHEMA)
    where = { "completed": "False" }
    order_by = { "id": "ASC" }
    orders = orders_db.select(DASHBOARD_COLUMNS, where, order_by)
    orders_db.close()

    socketio.emit('refresh', orders)

# WebSocket event handler for disconnection
@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('completeOrder')
def handle_complete_order(orderID):
    print('Order completed:', orderID)

    orders_db = db_table(DB_NAME, ORDERS_SCHEMA)
    values = { 'completed' : True }
    where = { 'id' : orderID }
    orders_db.update(values, where)
    orders_db.close()

@socketio.on('completeOrders')
def handle_complete_order(orderIDs):
    print('Orders completed:', orderIDs)

    orders_db = db_table(DB_NAME, ORDERS_SCHEMA)
    values = { 'completed' : True }
    for orderID in orderIDs:
        where = { 'id' : orderID }
        orders_db.update(values, where)
    orders_db.close()

@socketio.on('accept-cash-order')
def accept_cash_order(order):
    internalDate = int(datetime.now().timestamp())
    time = datetime.fromtimestamp(internalDate).strftime('%-I:%M %p')
    name = order['name']
    paymentType = order['paymentType']
    total = order['total']
    subtotal = order['subtotal']
    tip = order['tip']
    discount = order['discount']
    cart = order['cart']
    cartSummary = order['cartSummary']
    numBurgers = order['numBurgers']

    # Add to database
    orders_db = db_table(DB_NAME, ORDERS_SCHEMA)
    order_data = [name, time, internalDate, False, paymentType, total, subtotal, tip, discount, cartSummary, numBurgers]
    db_entry = dict(zip(ORDERS_COLUMNS, order_data)) | cart
    orders_db.insert(db_entry)
    id = orders_db.select(columns=['id'], order_by={ "id": "DESC" })[0]['id']
    orders_db.close()

    # Add to Dashboard object and display
    socketio.emit('newOrder', 
        dict(zip(DASHBOARD_COLUMNS, [id, name, cartSummary, total, time, paymentType, numBurgers])),
    )

    # Move from pay screen to finish screen
    socketio.emit('order-finished')

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
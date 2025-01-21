import csv
from flask import Flask, render_template, jsonify, request
from google_apis import create_service
from config import CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES, VENMO, ZELLE 
from email_utils import process_transaction_emails
from db_schema import ORDERS_COLUMNS, ORDERS_SCHEMA
from db_table import db_table

app = Flask(__name__, static_folder="static", template_folder="templates")
service = create_service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)

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
    payment_type = data.get('paymentType')
    total = data.get('total')
    subtotal = data.get('subtotal')
    tip = data.get('tip')
    discount = data.get('discount')
    cart = data.get('cart')
    cartDescription = ", ".join(f"{value} {key}" for key, value in cart.items())

    # get transactions based on type
    transactions = []
    if payment_type == 'venmo':
        transactions = process_transaction_emails(VENMO, service)
    elif payment_type == 'zelle':
        transactions = process_transaction_emails(ZELLE, service)

    # Check if user paid
    result = ''
    if len(transactions) > 0:
        id, name, amount, date = transactions[0]
        if float(amount) >= float(total):
            orders_db = db_table('Orders', ORDERS_SCHEMA)
            result = 'Successful payment'
            order_data = [id, name, date, payment_type, total, subtotal, tip, discount, False, cartDescription]
            # Add order info to db entry
            entry = dict(zip(ORDERS_COLUMNS, order_data)) | cart
            # Add entry to database
            orders_db.insert(entry)
            orders_db.close()
        else:
            missing_payment = float(total) - float(amount)
            result = 'Underpaid by ' + f'{missing_payment:.2f}'
    else:
        result = 'No payment processed. Try again.'

    return jsonify({"status": "success", "message": result})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
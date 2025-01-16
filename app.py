from flask import Flask, render_template, jsonify, request
from google_apis import create_service
from config import CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES, VENMO, ZELLE 
from email_utils import process_transaction_emails

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
    order = data.get('order')
    print(f"Payment Type: {payment_type}")
    print(f"Total: {total}")
    print(f"Order: {order}")

    # get transactions based on type
    transactions = []
    if payment_type == 'venmo':
        transactions = process_transaction_emails(VENMO, service)
    elif payment_type == 'zelle':
        transactions = process_transaction_emails(ZELLE, service)

    # Check if user paid
    result = ''
    if len(transactions) > 0:
        sort_key, name, amount, date = transactions[0]
        if float(amount) >= float(total):
            result = 'Successful payment'
        else:
            missing_payment = float(total) - float(amount)
            result = 'Underpaid by ' + f'{missing_payment:.2f}'
    else:
        result = 'No payment processed. Try again.'

    print("Python script executed")
    return jsonify({"status": "success", "message": result})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
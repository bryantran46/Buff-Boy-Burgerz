from google_apis import create_service
from config import CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES, VENMO, ZELLE 
from email_utils import process_transaction_emails

def main():
    service = create_service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)
    
    venmo_transactions = process_transaction_emails(VENMO, service)
    zelle_transactions = process_transaction_emails(ZELLE, service)

    transactions = sorted(venmo_transactions + zelle_transactions)
    for _, name, amount, date in transactions:
        print(f'Name: {name}, Amount: ${amount}, Date: {date}')

if __name__ == "__main__":
    main()
from google_apis import create_service
from config import VENMO, ZELLE
from email_utils import process_transaction_emails

def main():
    venmo_transactions = process_transaction_emails(VENMO)
    zelle_transactions = process_transaction_emails(ZELLE)

    transactions = sorted(venmo_transactions + zelle_transactions)
    for _, name, amount, date in transactions:
        print(f'Name: {name}, Amount: ${amount}, Date: {date}')

if __name__ == "__main__":
    main()
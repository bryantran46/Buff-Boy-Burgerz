from googleapiclient.errors import HttpError
import re
from datetime import datetime

# Fetch a list of email IDs matching the given query
def get_email_ids(service, query):
    try:
        results = service.users().messages().list(
            userId='me', 
            q=query
        ).execute()
        messages = results.get('messages', [])
        return [message['id'] for message in messages]
    except HttpError as error:
        print(f'An error occurred: {error}')
        return []

# Retrieve email details for each message ID
def get_emails(service, message_ids):
    messages = []

    # Callback function to handle each batch request result
    def add_callback(request_id, response, exception):
        if exception:
            print(f'Error fetching message with ID {request_id}: {exception}')
        else:
            messages.append(response)

    try:
        batch = service.new_batch_http_request(callback=add_callback)
        for message_id in message_ids:
            batch.add(service.users().messages().get(userId='me', id=message_id))
        batch.execute()
    except HttpError as batch_error:
        print(f'Batch request failed: {batch_error}')

    return messages

# Extract name, amount, and date of email
def parse_email(messages, pattern):
    transactions = []
    for message in messages:
        name = None
        amount = None
        date = None
        # Extract name and amount
        match = re.search(pattern, message['snippet']) 
        if match:
            name, amount = match.groups()
        else:
            print('Incorrect email')
            continue
        # Extract date
        sort_key = int(message['internalDate']) // 1000
        date = datetime.fromtimestamp(sort_key).strftime('%m/%d/%Y, %I:%M:%S %p')
        # Add name, amount, and date to transactions list
        transactions.append((sort_key, name, amount, date))
    return transactions

# Mark emails as read by removing the 'UNREAD' label
def mark_emails_as_read(service, message_ids):
    if not message_ids:
        return
    try:
        service.users().messages().batchModify(
            userId='me',
            body={'ids': message_ids, 'removeLabelIds': ['UNREAD']}
        ).execute()
        print(f"Marked {len(message_ids)} messages as read.")
    except HttpError as error:
        print(f'An error occurred: {error}')

# Get specified transaction_config emails, extract (name, amount, date),
# and mark emails as read
def process_transaction_emails(transaction_config, service):
    query = transaction_config['query']
    pattern = transaction_config['pattern']

    message_ids = get_email_ids(service, query)
    if not message_ids:
        print("No unread emails matching the query.")
        return []
    messages = get_emails(service, message_ids)
    transactions = parse_email(messages, pattern)
    mark_emails_as_read(service, message_ids)

    return transactions
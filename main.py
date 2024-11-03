import json
from google_apis import create_service

CLIENT_SECRET_FILE = 'credentials.json'
API_NAME = 'gmail'
API_VERSION = 'v1'
# If modifying these scopes, delete the file token.json.
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly'
]


if __name__ == "__main__":
    service = create_service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)

    # get email
    results = service.users().messages().list(
        userId='me', 
        maxResults='20', 
        q='label:unread from:(venmo@venmo.com) subject:("paid you")'
    ).execute()
    message_ids = [message['id'] for message in results.get('messages', [])]

    messages = []
    def add(id, msg, err):
        # id is given because this will not be called in the same order
        if err:
            print(err, 'for message:', id)
        else:
            messages.append(msg)

    batch = service.new_batch_http_request()
    for msg in message_ids:
        batch.add(service.users().messages().get(userId='me', id=msg), add)
    batch.execute()

    for message in messages:
        print(message['snippet'])
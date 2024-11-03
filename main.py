from google_apis import create_service
from config import CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES, EMAIL_QUERY
from email_utils import get_email_ids, get_emails, mark_emails_as_read

def main():
    service = create_service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)
    message_ids = get_email_ids(service, EMAIL_QUERY)

    if not message_ids:
        print("No unread emails matching the query.")
        return
    
    messages = get_emails(service, message_ids)
    for message in messages:
        print(message['snippet'])

    mark_emails_as_read(service, message_ids)


if __name__ == "__main__":
    main()
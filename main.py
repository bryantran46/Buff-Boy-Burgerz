from google_apis import create_service
from config import CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES, EMAIL_QUERY
from email_utils import get_email_ids, get_emails, mark_emails_as_read
import re

def main():
    service = create_service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)
    message_ids = get_email_ids(service, EMAIL_QUERY)

    if not message_ids:
        print("No unread emails matching the query.")
        return
    
    messages = get_emails(service, message_ids)
    for message in messages:
        subject = message['snippet']

        pattern = r"([A-Za-z]+\s[A-Za-z]+)\s+paid\s+you\s+\$([\d]+\.\d{2})"
        matches = re.findall(pattern, subject)
        # Extract and display results
        for match in matches:
            print(match)

        for header in message['payload']['headers']:
            if header['name'] == 'Date':
                print(header['value'])

    mark_emails_as_read(service, message_ids)


if __name__ == "__main__":
    main()
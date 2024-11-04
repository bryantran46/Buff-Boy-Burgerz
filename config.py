CLIENT_SECRET_FILE = 'credentials.json'
API_NAME = 'gmail'
API_VERSION = 'v1'
# If modifying these scopes, delete the file token.json.
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify'
]
VENMO = {
    'query': 'label:unread from:(venmo@venmo.com) subject:("paid you")',
    'pattern': r'([A-Za-z]+\s[A-Za-z]+)\s+paid\s+you\s+\$([\d]+\.\d{2})'
}
ZELLE = {
    'query': 'label:unread from:(customerservice@ealerts.bankofamerica.com) subject:("sent you")',
    'pattern': r'([A-Za-z]+\s[A-Za-z]+)\s+sent\s+you\s+\$([\d]+\.\d{2})'
}
CLIENT_SECRET_FILE = 'credentials.json'
API_NAME = 'gmail'
API_VERSION = 'v1'
# If modifying these scopes, delete the file token.json.
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify'
]
EMAIL_QUERY = 'label:unread from:(venmo@venmo.com) subject:("paid you")'
VENMO_PATTERN = r"([A-Za-z]+\s[A-Za-z]+)\s+paid\s+you\s+\$([\d]+\.\d{2})"
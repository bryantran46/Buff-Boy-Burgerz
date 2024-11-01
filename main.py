from google_apis import create_service

CLIENT_SECRET_FILE = 'credentials.json'
API_NAME = 'gmail'
API_VERSION = 'v1'
# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

if __name__ == "__main__":
  service = create_service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)
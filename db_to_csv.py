import csv
from db_schema import DB_NAME, ORDERS_COLUMNS, ORDERS_SCHEMA
from db_table import db_table

def db_to_csv():
    orders_db = db_table(DB_NAME, ORDERS_SCHEMA)
    with open('output.csv', 'w', newline='') as f:
        csvWriter = csv.writer(f)
        rows = orders_db.fetchall()
        csvWriter.writerow(ORDERS_COLUMNS)
        csvWriter.writerows(rows)
    orders_db.close()

def csv_to_db():
    orders_db = db_table(DB_NAME, ORDERS_SCHEMA)
    with open('test.csv', 'r') as f:
        csvReader = csv.reader(f)
        next(csvReader)
        for row in csvReader:
            orders_db.insert(dict(zip(ORDERS_COLUMNS, row)))
    orders_db.close()

if __name__ == '__main__':
    csv_to_db()
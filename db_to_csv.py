import csv
from db_schema import ORDERS_COLUMNS, ORDERS_SCHEMA
from db_table import db_table


orders_db = db_table('Orders', ORDERS_SCHEMA)
with open('output.csv', 'w', newline='') as f:
    csvWriter = csv.writer(f)
    rows = orders_db.fetchall()
    csvWriter.writerow(ORDERS_COLUMNS)
    csvWriter.writerows(rows)
orders_db.close()
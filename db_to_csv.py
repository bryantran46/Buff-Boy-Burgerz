import csv
from db_schema import DB_NAME, ORDERS_COLUMNS, ORDERS_SCHEMA
from db_table import db_table
from datetime import datetime

def time_diff(epoch_1, epoch_2):
    diff_seconds = epoch_2 - epoch_1  # Total difference in seconds
    minutes = diff_seconds // 60      # Get minutes
    seconds = diff_seconds % 60
    return f"{minutes}min {seconds}sec"

def db_to_csv():
    orders_db = db_table(DB_NAME, ORDERS_SCHEMA)
    with open('output.csv', 'w', newline='') as f:
        csvWriter = csv.writer(f)
        rows = orders_db.fetchall()
        csvWriter.writerow(ORDERS_SCHEMA.keys())
        csvWriter.writerows(rows)
        for row in rows:
            receviedTime = row[3]
            startTime = row[4]
            completedTime = row[5]
            
            totalWaitTime = time_diff(receviedTime, completedTime)
            waitTime = time_diff(receviedTime, startTime)
            prepTime = time_diff(startTime, completedTime)

            receviedTime = datetime.fromtimestamp(receviedTime).strftime('%-I:%M %p')
            startTime = datetime.fromtimestamp(startTime).strftime('%-I:%M %p')
            completedTime = datetime.fromtimestamp(completedTime).strftime('%-I:%M %p')

            print(f"{row[1]}: {receviedTime}, {startTime}, {completedTime}")
            print(f"total wait time: {totalWaitTime}, wait time: {waitTime}, prep time: {prepTime}")
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
    db_to_csv()
# 
# Database schema
#

ORDERS_DB_NAME = 'orders'
TEST_DB_NAME = 'test'
DB_NAME = TEST_DB_NAME

ORDERS_COLUMNS = [
    # Customer Information
    'name',

    # Order Time and Status
    'time',
    'internalTime',  # Keep related time information together
    'completed',

    # Payment Details
    'paymentType',
    'total',
    'subtotal',
    'tip',
    'discount',

    # Order Summary
    'cartSummary',
    'numBurgers',

    # Item Breakdown
    'combo',
    'burger',
    'soda',
    'chips'
]

# schema for the orders table
ORDERS_SCHEMA = {
    'id': 'integer primary key autoincrement',
    'name': 'text',
    'time': 'text',
    'internalTime': 'integer',
    'completed': 'boolean',
    'paymentType': 'text',
    'total': 'integer',
    'subtotal': 'integer',
    'tip': 'integer',
    'discount': 'integer',
    'cartSummary': 'text',
    'numBurgers': 'integer',
    'combo' : 'integer default 0',
    'burger' : 'integer default 0',
    'soda' : 'integer default 0',
    'chips' : 'integer default 0',
}

DASHBOARD_COLUMNS = ['id', 'name', 'cartSummary', 'total', 'time', 'paymentType', 'numBurgers']
CASH_COLUMNS = ['name', 'paymentType', 'total', 'subtotal', 'tip', 'discount', 'cartSummary', 'numBurgers', 'cart']

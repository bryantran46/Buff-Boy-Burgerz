# 
# Database schema
#

ORDERS_DB_NAME = 'orders'
TEST_DB_NAME = 'test'
DB_NAME = TEST_DB_NAME

ORDERS_COLUMNS = [
    # Customer Information
    'name',
    'displayTime',
    'receivedTime',
    'completed',
    'paymentType',
    'total',
    'subtotal',
    'tip',
    'discount',
    'cartSummary',
    'numBurgers',
    'specialInstructions',
    'combo',
    'burger',
    'soda',
    'chips'
]

# schema for the orders table
ORDERS_SCHEMA = {
    # Customer Information
    'id': 'integer primary key autoincrement',
    'name': 'text',

    # Order Time and Status
    'displayTime': 'text',
    'receivedTime': 'integer',
    'startTime': 'integer default 0',
    'completedTime': 'integer default 0',
    'completed': 'boolean',

    # Payment Details
    'paymentType': 'text',
    'total': 'integer',
    'subtotal': 'integer',
    'tip': 'integer',
    'discount': 'integer',

    # Item Breakdown
    'cartSummary': 'text',
    'numBurgers': 'integer',
    'specialInstructions': 'text',
    'combo' : 'integer default 0',
    'burger' : 'integer default 0',
    'soda' : 'integer default 0',
    'chips' : 'integer default 0',
}

DASHBOARD_COLUMNS = ['id', 'name', 'cartSummary', 'total', 'displayTime', 'paymentType', 'numBurgers', 'specialInstructions']
CASH_COLUMNS = ['name', 'paymentType', 'total', 'subtotal', 'tip', 'discount', 'cartSummary', 'numBurgers', 'specialInstructions', 'cart']

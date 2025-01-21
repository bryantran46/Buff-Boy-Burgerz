# 
# Database schema
# Agenda table that holds associated session ids and speaker ids
# Session table holds all session details excluding speakers
# Speaker table holds name
#
ORDERS_COLUMNS = ['id', 'customer_name', 'order_time', 'payment_method', 
                  'total', 'subtotal', 'tip', 'discount', 'completed', 'cart', 
                  'combo', 'burger', 'soda', 'chips']

ORDERS_SCHEMA = {
    'id' : 'integer primary key',
    'customer_name' : 'text',
    'order_time' : 'date',
    'payment_method' : 'text',
    'total' : 'integer',
    'subtotal' : 'integer',
    'tip' : 'integer',
    'discount' : 'integer',
    'completed' : 'boolean',
    'cart' : 'text',
    'combo' : 'integer default 0',
    'burger' : 'integer default 0',
    'soda' : 'integer default 0',
    'chips' : 'integer default 0'
}


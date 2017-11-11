import sqlite3

conn = sqlite3.connect('database.db')
print("Opened database successfully")

conn.execute('CREATE TABLE user (email TEXT, first_name TEXT, last_name TEXT, password TEXT)')
print("Table created successfully")
conn.close()
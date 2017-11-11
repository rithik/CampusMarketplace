import sqlite3 as sql

# with sql.connect("database.db") as con:
#     cur = con.cursor()
#     cur.execute("INSERT INTO user (email,first_name,last_name,password) VALUES (?,?,?,?)",("ry@gmail.com","R","Y","qwe") )

#     con.commit()

# con = sql.connect("database.db")
# con.row_factory = sql.Row

# cur = con.cursor()
# cur.execute("select * from user")

# rows = cur.fetchall();
# print(rows[0]["email"])
import pymysql
import pandas as pd
import numpy as np
import sys

df = pd.read_csv("./earthquake.csv")

# upload to mysql server
db_host = sys.argv[1]
db_user = sys.argv[2]
db_passwd = sys.argv[3]
db_db = sys.argv[4]
db = pymysql.connect(host=db_host, user=db_user, passwd=db_passwd, db=db_db, charset='utf8')

# set cursor
cursor = db.cursor()

drop_table_command = """
DROP TABLE IF EXISTS earthquake;
"""
cursor.execute(drop_table_command)

create_table_command = """
CREATE TABLE IF NOT EXISTS earthquake (
id          DECIMAL(14),
date        CHAR(10),
time        CHAR(11),
latitude    DECIMAL(4,2),
longitude   DECIMAL(4,2),
country     VARCHAR(30),
city        VARCHAR(30),
area        VARCHAR(50),
direction   VARCHAR(15),
distance    DECIMAL(4,2),
depth       DECIMAL(6,2),
xm          DECIMAL(4,2),
md          DECIMAL(4,2),
richter     DECIMAL(4,2),
mw          DECIMAL(4,2),
ms          DECIMAL(4,2),
mb          DECIMAL(4,2)
);
"""
cursor.execute(create_table_command)

def uploadToMysqlOneRow(onerow_series, i):
    onerow_list = list(onerow_series)
    
    _l = []
    for a in onerow_list:
        if pd.isnull(a):
            _l.append('NULL')
            continue
        if type(a) == str:
            _l.append('"%s"'%a)
        else:
            _l.append('%s'%a)
    
    data_join = ','.join(_l)
    insert_command = 'INSERT INTO earthquake VALUES (' + data_join + ');'
    
    try:
        cursor.execute(insert_command)
        db.commit()
        print('Successfully upload row %d: %s' % (i+2, data_join))
    except:
        db.rollback()
        # print('Error! %d %s' % (i+2, data_join))
        print('Error!')

for i in range(len(df)):
    # print(i)
    onerow = df.iloc[i]
    uploadToMysqlOneRow(onerow, i)



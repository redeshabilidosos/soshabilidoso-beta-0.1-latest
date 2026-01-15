import mysql.connector

conn = mysql.connector.connect(
    host='localhost',
    port=3307,
    user='root',
    password='',
    database='habilidosos_clean'
)
cursor = conn.cursor()
cursor.execute("""
    SELECT COLUMN_NAME, COLUMN_TYPE 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'habilidosos_clean' 
    AND TABLE_NAME = 'participantes_2026_1'
    AND COLUMN_NAME IN ('fase_actual', 'estado_fase_1', 'estado_fase_2', 'estado_fase_3', 'genero')
""")
for row in cursor.fetchall():
    print(f"{row[0]}: {row[1]}")
cursor.close()
conn.close()

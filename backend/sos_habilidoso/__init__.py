"""
Inicialización del proyecto SOS-HABILIDOSO
"""
import pymysql

# Configurar PyMySQL como driver de MySQL antes de que Django lo necesite
pymysql.install_as_MySQLdb()

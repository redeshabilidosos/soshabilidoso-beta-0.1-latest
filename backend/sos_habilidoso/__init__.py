# SOS-HABILIDOSO Django Project

# Habilitar PyMySQL como reemplazo de MySQLdb si está disponible
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except Exception:
    # Si PyMySQL no está instalado aún, se omitirá sin romper la app
    pass
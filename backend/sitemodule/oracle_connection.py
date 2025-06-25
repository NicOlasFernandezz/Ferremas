import oracledb;

oracledb.init_oracle_client(config_dir="C:\Users\nicolas\Desktop\FerremasProjectt\FerramasProject\Wallet_FERREMASDB")

connection = oracledb.connect(
    user = 'ADMIN',
    password = "SuperUser159",
    dsn = '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.sa-santiago-1.oraclecloud.com))(connect_data=(service_name=gf86c2b13433b43_ferremasdb_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))',
    wallet_password = 'Ferremas-123'
)

cursor = connection.cursor()
cursor.execute("SELECT * FROM DUAL")
print(cursor.fetchall())
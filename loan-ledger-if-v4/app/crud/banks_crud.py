from providers.psql_provider import DB


async def query_banks(db: DB):
    return await db.fetch_all("SELECT * FROM banks;")


async def insert_bank(db: DB, bank: dict):
    sql = f"""
    INSERT INTO banks
    (type, name)
    VALUES
    ('{bank["type"]}', '{bank["name"]}');
    """
    sql = sql.replace("'None'", "null").replace("None", "null")

    await db.execute(sql)


async def update_bank(db: DB, bank: dict):
    sql = f"""
    UPDATE
        banks
    SET
        type = '{bank["type"]}',
        name = '{bank["name"]}'
    WHERE
        banks.id = '{bank["id"]}';
    """
    sql = sql.replace("'None'", "null").replace("None", "null")

    await db.execute(sql)

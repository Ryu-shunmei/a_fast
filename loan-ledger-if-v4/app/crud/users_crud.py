from providers.psql_provider import DB


async def check_user_is_exist(db: DB, email: str):
    sql = f"""
    SELECT
        id
    FROM
        users
    WHERE
        users.email = '{email}';
    """
    return await db.fetch_one(sql)


async def insert_new_user(db: DB, new_user: dict, password: str = "12345678"):
    sql = f"""
    INSERT INTO users
        (
            name,
            email,
            password
        )
    VALUES
        (
            '{new_user["name"]}',
            '{new_user["email"]}',
            '{password}'
        )
    RETURNING id;
    """
    sql = sql.replace("''", "null")
    new_db_user = await db.fetch_one(sql)

    if not new_user.get("role_type", None):
        return new_db_user

    sql = f"""
    INSERT INTO roles (type, user_id, org_id)
    VALUES (
        '{new_user["role_type"]}',
        '{new_db_user["id"]}',
        '{new_user["org_id"]}'
    )
    RETURNING id;
    """
    role = await db.fetch_one(sql)
    for permission_code in new_user["permission_codes"]:
        sql = f"""
        INSERT INTO role_permission_rels (role_id, permission_code)
        VALUES (
            '{role["id"]}',
            '{permission_code}'
        )
        """
        await db.execute(sql)
    return new_db_user


async def query_users(db: DB, role_id: str):
    role = await db.fetch_one(f"SELECT org_id FROM roles WHERE id = '{role_id}'")
    sql = f"""
    WITH RECURSIVE parents AS (
        SELECT id, type, name, parent_id, 0 as depth FROM orgs WHERE id = '{role["org_id"] if role else "null"}'
        UNION ALL 
        SELECT child.id, child.type, child.name, child.parent_id, parents.depth + 1 as depth FROM orgs as child INNER JOIN parents ON parents.id = child.parent_id
    )
    SELECT
        parents.*
    FROM
        parents;
    """
    orgs = await db.fetch_all(sql)

    users = []
    user_ids = []
    for org in orgs:
        sql = f"""
        SELECT
            users.id as id,
            users.name as name,
            users.email as email
        FROM
            users
        JOIN
            roles
            ON
            roles.user_id = users.id
        JOIN
            orgs
            ON
            orgs.id = roles.org_id
        WHERE
            orgs.id = '{org["id"]}';
        """
        _users = await db.fetch_all(sql)

        for user in _users:
            if user["id"] in user_ids:
                continue
            else:
                user_ids.append(user["id"])
                users.append(user)
    result = []
    for user in users:
        sql = f"""
        SELECT
            roles.type as role_type,
            orgs.name as org_name
        FROM
            roles
        JOIN
            users
            ON
            users.id = roles.user_id
        LEFT JOIN
            orgs
            ON
            orgs.id = roles.org_id
        WHERE
            users.id = '{user["id"]}';
        """
        roles = await db.fetch_all(sql)
        result.append({
            **user,
            "roles": roles
        })
    return result


async def update_user(db: DB, user_info: dict):
    sql = f"""
    UPDATE users
    SET
        name = '{user_info["name"]}',
        email = '{user_info["email"]}'
    WHERE
        id = '{user_info["id"]}';
    """
    await db.execute(sql)

    if not user_info.get("role_type", None):
        return

    sql = f"""
    INSERT INTO roles (type, user_id, org_id)
    VALUES (
        '{user_info["role_type"]}',
        '{user_info["id"]}',
        '{user_info["org_id"]}'
    )
    RETURNING id;
    """
    role = await db.fetch_one(sql)

    for permission_code in user_info["permission_codes"]:
        sql = f"""
        INSERT INTO role_permission_rels (role_id, permission_code)
        VALUES (
            '{role["id"]}',
            '{permission_code}'
        )
        """
        await db.execute(sql)

from providers.psql_provider import DB


async def query_user_for_auth(db: DB, email: str):
    sql = f"""
    SELECT
        id,
        email,
        password,
        default_role_id
    FROM
        users
    WHERE
        users.email = '{email}';
    """
    return await db.fetch_one(sql)


async def query_token_payload(db: DB, user_id):
    sql = f"""
    SELECT
        id,
        email,
        name,
        default_role_id
    FROM
        users
    WHERE
        users.id = '{user_id}';
    """
    user_info = await db.fetch_one(sql)

    if user_info["default_role_id"] is None:
        role = await db.fetch_one(f"SELECT id FROM roles WHERE user_id = '{user_id}' ORDER BY type ASC;")
        await update_user_default_role_id(db, user_id, role["id"])

    user_info = await db.fetch_one(sql)

    sql = f"""
    SELECT
        roles.id,
        roles.type,
        orgs.id as org_id,
        orgs.name as org_name
    FROM
        roles
    JOIN
        users
        ON
        users.id = roles.user_id
    JOIN
        orgs
        ON
        orgs.id = roles.org_id
    WHERE
        roles.user_id = '{user_id}';
    """
    roles = await db.fetch_all(sql)

    sql = f"""
    SELECT
        code,
        name
    FROM
        permissions
    JOIN
        role_permission_rels
        ON
        role_permission_rels.permission_code = permissions.code
    JOIN
        roles
        ON
        roles.id = role_permission_rels.role_id
    WHERE
        roles.id = '{user_info["default_role_id"]}';
    """
    permissions = await db.fetch_all(sql)

    return {
        **user_info,
        "roles": roles,
        "permissions": permissions
    }


async def update_user_default_role_id(db: DB, user_id: str, role_id: str = None):
    sql = f"""
    UPDATE users SET default_role_id = '{role_id}' WHERE users.id = '{user_id}';
    """
    await db.execute(sql)

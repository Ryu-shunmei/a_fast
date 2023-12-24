from providers.psql_provider import DB
from utils.tree_parse import list_to_tree, parse_step_key


async def query_access_orgs(db: DB, role_id: str):
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
    basic_orgs = await db.fetch_all(sql)
    orgs = []
    for basic_org in basic_orgs:
        sql = f"""
        SELECT
            users.id as id,
            users.name as name,
            users.email as email,
            roles.type as type
        FROM
            users
        JOIN
            roles
            ON
            roles.user_id = users.id
        WHERE
            roles.org_id = '{basic_org["id"]}';
        """
        users = await db.fetch_all(sql)
        orgs.append({
            **basic_org,
            "users": users
        })
    list_tree = list_to_tree(orgs, role["org_id"])
    return parse_step_key(list_tree)


async def query_option_access_orgs(db: DB, role_id: str):
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
    return await db.fetch_all(sql)


async def query_out_org_users(db: DB, org_id: str):
    sql = f"""
    SELECT
        users.id as id
    FROM
        users
    JOIN
        roles
        ON
        roles.user_id = users.id
    WHERE
        roles.org_id = '{org_id}';
    """
    in_org_users = await db.fetch_all(sql)
    in_org_user_ids = [user["id"] for user in in_org_users]
    sql = f"""
    SELECT
        id,
        name,
        email
    FROM
        users;
    """

    all_users = await db.fetch_all(sql)
    out_org_users = []
    for user in all_users:
        if user["id"] not in in_org_user_ids:
            out_org_users.append(user)
    return out_org_users


async def query_in_org_users(db: DB, org_id: str):
    sql = f"""
    SELECT
        users.id as id,
        users.name as name,
        users.email as email,
        roles.id as role_id,
        roles.type as role_type
    FROM
        users
    JOIN
        roles
        ON
        roles.user_id = users.id
    WHERE
        roles.org_id = '{org_id}';
    """
    in_org_basic_users = await db.fetch_all(sql)

    in_org_users = []

    for basic_user in in_org_basic_users:
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
        WHERE
            role_permission_rels.role_id = '{basic_user["role_id"]}';
        """
        permissions = await db.fetch_all(sql)
        in_org_users.append({
            **basic_user,
            "permissions": permissions,
            "permission_codes": [p["code"] for p in permissions]
        })

    return in_org_users


async def insert_new_org(db: DB, org_info: dict):
    sql = f"""
    INSERT INTO orgs (parent_id, type, name)
    VALUES (
        '{org_info["parent_id"]}',
        '{org_info["type"]}',
        '{org_info["name"]}'
    )
    RETURNING id, type, name;
    """
    sql = sql.replace("''", "null")
    sql = sql.replace("'None'", "null")
    return await db.fetch_one(sql)


async def update_org(db: DB, org_info: dict, org_id: str):
    sql = f"""
    UPDATE orgs
    SET
        parent_id = '{org_info["parent_id"]}',
        name = '{org_info["name"]}',
        type = '{org_info["type"]}'
    WHERE
        orgs.id = '{org_id}'
    RETURNING id, type, name;
    """
    sql = sql.replace("''", "null")
    sql = sql.replace("'None'", "null")
    return await db.fetch_one(sql)


async def insert_org_user(db: DB, user_info: dict, org_id: str):
    sql = f"""
    INSERT INTO roles (type, user_id, org_id)
    VALUES (
        '{user_info["role_type"]}',
        '{user_info["id"]}',
        '{org_id}'
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


async def update_org_user(db: DB, role_info: dict):
    sql = f"""
    UPDATE roles
    SET
        type='{role_info["role_type"]}'
    WHERE
        roles.id = '{role_info["role_id"]}';
    """
    await db.execute(sql)

    await db.execute(f"""DELETE FROM role_permission_rels WHERE role_permission_rels.role_id ='{role_info["role_id"]}';""")

    for permission_code in role_info["permission_codes"]:
        sql = f"""
        INSERT INTO role_permission_rels (role_id, permission_code)
        VALUES (
            '{role_info["role_id"]}',
            '{permission_code}'
        )
        """
        await db.execute(sql)


async def delete_org_user(db: DB, role_id: str):
    await db.execute(f"""DELETE FROM role_permission_rels WHERE role_permission_rels.role_id ='{role_id}';""")
    await db.execute(f"""DELETE FROM roles WHERE roles.id ='{role_id}';""")

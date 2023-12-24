from providers.psql_provider import DB


async def query_org_id(db: DB, role_id: str):
    return await db.fetch_value(f"SELECT org_id FROM roles WHERE roles.id = '{role_id}';")


async def query_access_orgs(db: DB, org_id: str):
    parent_id = await db.fetch_value(f"SELECT id FROM orgs WHERE id = '{org_id}'")
    sql = f"""
    WITH RECURSIVE parents AS (
        SELECT id, type, name, parent_id, 0 as depth FROM orgs WHERE id = '{parent_id if parent_id else "null"}'
        UNION ALL 
        SELECT child.id, child.type, child.name, child.parent_id, parents.depth + 1 as depth FROM orgs as child INNER JOIN parents ON parents.id = child.parent_id
    )
    SELECT parents.* FROM parents;
    """
    return await db.fetch_all(sql)

from loguru import logger
from fastapi import APIRouter
from fastapi import Depends
from fastapi.responses import JSONResponse

from app.crud import common

from app.dependencies import DB, get_db

from utils.tree_parse import list_to_tree, parse_step_key

master_router = APIRouter()


@master_router.get("/org_types")
async def org_types(db: DB = Depends(get_db)):
    try:
        return JSONResponse(
            status_code=200,
            content=await db.fetch_all("SELECT * FROM org_types;")
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )


@master_router.get("/role_types")
async def role_types(db: DB = Depends(get_db)):
    try:
        return JSONResponse(
            status_code=200,
            content=await db.fetch_all("SELECT * FROM role_types;")
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )


@master_router.get("/bank_types")
async def bank_types(db: DB = Depends(get_db)):
    try:
        return JSONResponse(
            status_code=200,
            content=await db.fetch_all("SELECT * FROM bank_types;")
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )


@master_router.get("/permission_types")
async def bank_types(db: DB = Depends(get_db)):
    try:
        return JSONResponse(
            status_code=200,
            content=await db.fetch_all("SELECT * FROM permissions ORDER BY name;")
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )


@master_router.get("/test")
async def bank_types(db: DB = Depends(get_db)):
    try:

        data = await common.query_access_orgs(db, "7a756ca8-83ca-47aa-96f0-385bc82ba7af")
        tree_data = list_to_tree(data, "7a756ca8-83ca-47aa-96f0-385bc82ba7af")
        tree_with_step = parse_step_key(tree_data)

        return JSONResponse(
            status_code=200,
            content=tree_with_step
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )

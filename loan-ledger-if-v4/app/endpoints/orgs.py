from loguru import logger
from fastapi import APIRouter
from fastapi import Depends
from fastapi.responses import JSONResponse

from app.crud import orgs_crud

from app.dependencies import DB, get_db


org_router = APIRouter()


@org_router.get("/orgs")
async def orgs(role_id: str, db: DB = Depends(get_db)):
    try:

        orgs = await orgs_crud.query_access_orgs(db, role_id)

        return JSONResponse(
            status_code=200,
            content=orgs
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )


@org_router.get("/options/orgs")
async def orgs(role_id: str, db: DB = Depends(get_db)):
    try:

        orgs = await orgs_crud.query_option_access_orgs(db, role_id)

        return JSONResponse(
            status_code=200,
            content=orgs
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )


@org_router.get("/org/out/users")
async def org_out_users(org_id: str, db: DB = Depends(get_db)):
    try:
        users = await orgs_crud.query_out_org_users(db, org_id)
        return JSONResponse(
            status_code=200,
            content=users
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )


@org_router.get("/org/in/users")
async def org_in_users(org_id: str, db: DB = Depends(get_db)):
    try:
        users = await orgs_crud.query_in_org_users(db, org_id)
        return JSONResponse(
            status_code=200,
            content=users
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )


@org_router.post("/org")
async def new_org(org_info: dict, db: DB = Depends(get_db)):
    try:
        org = await orgs_crud.insert_new_org(db, org_info)
        return JSONResponse(
            status_code=200,
            content=org
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )


@org_router.put("/org")
async def new_org(org_info: dict, id: str, db: DB = Depends(get_db)):
    try:
        org = await orgs_crud.update_org(db, org_info, id)
        return JSONResponse(
            status_code=200,
            content=org
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )


@org_router.post("/org/user")
async def new_org_user(user_info: dict, org_id: str, db: DB = Depends(get_db)):
    try:
        await orgs_crud.insert_org_user(db, user_info, org_id)
        return JSONResponse(
            status_code=200,
            content={"message": "ok"}
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )


@org_router.put("/org/user")
async def up_org_user(role_info: dict, db: DB = Depends(get_db)):
    try:
        await orgs_crud.update_org_user(db, role_info)
        return JSONResponse(
            status_code=200,
            content={"message": "ok"}
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )


@org_router.delete("/org/user")
async def up_org_user(role_id: str, db: DB = Depends(get_db)):
    try:
        await orgs_crud.delete_org_user(db, role_id)
        return JSONResponse(
            status_code=200,
            content={"message": "ok"}
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )

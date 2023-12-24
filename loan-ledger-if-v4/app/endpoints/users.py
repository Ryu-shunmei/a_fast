from loguru import logger
from fastapi import APIRouter
from fastapi import Depends
from fastapi.responses import JSONResponse

from app.crud import users_crud

from app.dependencies import DB, get_db
from utils.jwt import gen_access_token


users_router = APIRouter()


@users_router.post("/user")
async def new_user(new_user: dict, db: DB = Depends(get_db)):
    try:
        is_exist = await users_crud.check_user_is_exist(db, new_user["email"])
        if is_exist:
            return JSONResponse(
                status_code=400,
                content={"message": "email is exist."},
            )
        db_new_user = await users_crud.insert_new_user(db, new_user)
        return JSONResponse(
            status_code=200,
            content=db_new_user
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )


@users_router.get("/users")
async def new_user(role_id: str, db: DB = Depends(get_db)):
    try:
        users = await users_crud.query_users(db, role_id)
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


@users_router.put("/user")
async def up_user(user_info: dict, db: DB = Depends(get_db)):
    try:
        await users_crud.update_user(db, user_info)
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

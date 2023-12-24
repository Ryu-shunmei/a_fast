from loguru import logger
from fastapi import APIRouter
from fastapi import Depends
from fastapi.responses import JSONResponse

from app.crud import banks_crud

from app.dependencies import DB, get_db


banks_router = APIRouter()


@banks_router.get("/banks")
async def banks(db: DB = Depends(get_db)):
    try:
        return JSONResponse(
            status_code=200,
            content=await banks_crud.query_banks(db)
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."}
        )


@banks_router.post("/bank")
async def new_bank(bank: dict, db: DB = Depends(get_db)):
    try:
        await banks_crud.insert_bank(db, bank)
        return JSONResponse(
            status_code=200,
            content={"message": "ok"}
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."},
        )


@banks_router.put("/bank")
async def new_bank(bank: dict, db: DB = Depends(get_db)):
    try:
        await banks_crud.update_bank(db, bank)
        return JSONResponse(
            status_code=200,
            content={"message": "ok"}
        )
    except Exception as err:
        logger.exception(err)
        return JSONResponse(
            status_code=500,
            content={
                "message": "An unknown exception occurred, please try again later."},
        )

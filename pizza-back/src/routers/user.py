from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.ext.asyncio import AsyncConnection

from packages.database import get_db_connect
from packages.user.user import User
from packages.auth.auth import Auth

from chemas.user import (
    UserProfileAttribute,
    UserDeleteAttribute,
    UserPatchAttribute,
    UserAddOrder,
)

worker = APIRouter()


@worker.get("/user_info")
async def get_user_info(
    response: Response, req: Request, db_conn: AsyncConnection = Depends(get_db_connect)
):
    """Получить данные по пользователю."""

    auth = Auth(db_conn)
    user = await auth.get_current_user(request=req, response=response)

    return user


@worker.get("/user_delete")
async def delete_user(req: Request, db_conn: AsyncConnection = Depends(get_db_connect)):
    """Получить данные по пользователю."""

    attr = UserDeleteAttribute(**req.query_params)
    user = User(db_conn=db_conn)
    await user.delete_user(attr=attr)

    return {"success": True}


@worker.get("/users")
async def get_user_info(db_conn: AsyncConnection = Depends(get_db_connect)):
    """Получить данные по всем пользователям"""

    user = User(db_conn)
    result = await user.get_all_users()

    return result


@worker.patch("/user")
async def patch_user(
    attr: UserPatchAttribute, db_conn: AsyncConnection = Depends(get_db_connect)
):
    """Изменение данных по пицце."""

    user = User(db_conn)
    result = await user.patch_user(attr=attr)

    return result


@worker.post("/order")
async def new_order(
    attr: UserAddOrder, db_conn: AsyncConnection = Depends(get_db_connect)
):
    """Добавить запись в историю заказов пользователя."""

    user = User(db_conn)
    result = await user.new_order(user_id=attr.user_id, order=attr.order)

    return result

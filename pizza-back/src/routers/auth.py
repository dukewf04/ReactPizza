from fastapi import APIRouter, HTTPException, status, Depends, Response
from sqlalchemy.ext.asyncio import AsyncConnection

from packages.database import get_db_connect
from packages.auth.auth import Auth

from chemas.auth import RegisterAttribute, LoginAttribute

worker = APIRouter()


@worker.post("/register")
async def register_user(
    response: Response,
    attr: RegisterAttribute,
    db_conn: AsyncConnection = Depends(get_db_connect),
) -> dict:
    """Регистрация пользователя"""

    auth = Auth(db_conn)
    user = await auth.register_user(attr=attr)
    access_token = auth.create_access_token(
        {
            "user_id": str(user["user_id"]),
            "username": str(user["name"]),
            "role": str(user["role"]),
        }
    )
    response.set_cookie(key="users_access_token", value=access_token)
    return attr.dict(include=attr.__fields_set__, exclude={"password"})


@worker.post("/login")
async def login_user(
    response: Response,
    attr: LoginAttribute,
    db_conn: AsyncConnection = Depends(get_db_connect),
):
    """Авторизация пользователя"""

    auth = Auth(db_conn)
    check = await auth.authenticate_user(attr=attr)
    if check is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверная почта или пароль"
        )
    access_token = auth.create_access_token(
        {
            "user_id": str(check["user_id"]),
            "username": str(check["name"]),
            "role": str(check["role"]),
        }
    )
    response.set_cookie(key="users_access_token", value=access_token)

    return {"success": True}

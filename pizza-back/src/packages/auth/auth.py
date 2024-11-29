from jose import jwt, JWTError
from fastapi import HTTPException, status, Request, Response, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection
from packages.object import Object
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from config.config import load_config

from chemas.auth import RegisterAttribute, LoginAttribute


class Auth(Object):
    """Базовый класс для регистрации, авторизации пользователя."""

    def __init__(
        self,
        db_conn: AsyncConnection,
    ):
        super().__init__(db_conn=db_conn)
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.auth_data = load_config().get("auth", {})
        self.user_data = load_config().get("user", {})

    def get_password_hash(self, password: str) -> str:
        """Метод для создания хэша пароля"""

        return self.pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Метод для проверки пароля"""

        return self.pwd_context.verify(plain_password, hashed_password)

    def create_access_token(self, data: dict) -> str:
        """Метод для генерации JWT токена"""

        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=self.auth_data["jwt_expire_minutes"]
        )
        to_encode.update({"exp": expire})
        encode_jwt = jwt.encode(
            to_encode,
            self.auth_data["secret_key"],
            algorithm=self.auth_data["algorithm"],
        )
        return encode_jwt

    async def find_one_or_none(
        self, user_id: int = None, email: str = None, orders: bool = False
    ):
        """Проверка на существование пользователя в базе. Ищем по email если user_id не передан"""

        stmt = f"""
            SELECT * 
            FROM users
            WHERE {'email = :email' if not user_id else 'user_id = :user_id'}
        """

        attr = {"user_id": user_id, "email": email}
        result_user = await self.select(text(stmt), attr)

        if not result_user:
            return None

        # Если запрашиваем данные об заказе
        result_orders = None
        if orders:
            stmt = f"""
                SELECT order_value, order_date 
                FROM orders
                WHERE user_id = :user_id
            """
            result_orders = await self.select(text(stmt), attr)

        result: dict = result_user[0]._asdict()
        if result_orders:
            result.update({"orders": [el._asdict() for el in result_orders]})

        return result

    async def register_user(self, attr: RegisterAttribute):
        """Регистрация пользователя."""

        attr = dict(attr)

        # Проверяем, существует ли пользователь в базе
        user = await self.find_one_or_none(email=attr.get("email"))
        if user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Пользователь с таким Email уже существует",
            )

        stmt = f"""
            INSERT INTO users (name, email, password) VALUES
            (:name, :email, :password)
        """

        attr["password"] = self.get_password_hash(attr["password"])
        await self.db_conn.execute(text(stmt), attr)
        await self.db_conn.commit()
        user = await self.find_one_or_none(email=attr.get("email"))

        return user

    async def authenticate_user(self, attr: LoginAttribute):
        """Проверка на существование пользователя с указанным паролем"""

        attr = dict(attr)

        user = await self.find_one_or_none(email=attr.get("email"))
        if (
            not user
            or self.verify_password(
                plain_password=attr["password"], hashed_password=user["password"]
            )
            is False
        ):
            return None

        return user

    def get_token(self, request: Request):
        """Получение токена пользователя"""

        token = request.cookies.get("users_access_token")
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Токен не найден"
            )

        return token

    async def get_current_user(self, request: Request, response: Response):
        """Получение данных о пользователе, только если он авторизован"""

        token: str = self.get_token(request)

        try:
            payload = jwt.decode(
                token,
                self.auth_data["secret_key"],
                algorithms=[self.auth_data["algorithm"]],
            )
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Токен не валидный"
            )

        expire = payload.get("exp")
        expire_time = datetime.fromtimestamp(int(expire), tz=timezone.utc)
        if (not expire) or (expire_time < datetime.now(timezone.utc)):
            response.delete_cookie("users_access_token")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Токен истек"
            )

        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Не найден ID пользователя",
            )

        user = await self.find_one_or_none(
            int(user_id), orders=bool(request.query_params.get("orders"))
        )
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Пользователь не найден",
            )
        del user["password"]

        return user

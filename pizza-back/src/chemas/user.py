from datetime import date
from typing import Optional
from pydantic import BaseModel, root_validator
from fastapi.exceptions import HTTPException


class UserProfileAttribute(BaseModel):
    """Атрибуты при запросе данных пользователя."""

    user_id: int

    @root_validator(pre=True)
    def pre_validator(cls, values):
        attrs = values.keys()

        return values


class UserDeleteAttribute(BaseModel):
    """Атрибуты при запросе на удаление пользователя."""

    user_id: int

    @root_validator(pre=True)
    def pre_validator(cls, values):
        attrs = values.keys()

        return values


class UserPatchAttribute(BaseModel):
    """Атрибуты редактирования пиццы."""

    user_id: int
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    birthday: Optional[date]
    address: Optional[str]
    card: Optional[str]
    avatar: Optional[str]
    password: Optional[str]
    notification: Optional[dict]

    @root_validator(pre=True)
    def pre_validator(cls, values):
        attrs = values.keys()

        if "user_id" not in attrs or not values.get("user_id"):
            raise HTTPException(
                status_code=400, detail="Не указан индентификатор пользователя"
            )

        if len(attrs) <= 1:
            raise HTTPException(
                status_code=400, detail="Список изменяемых атрибутов пуст"
            )

        return values

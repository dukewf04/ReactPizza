from typing import Optional, Any
from pydantic import BaseModel, validator, root_validator
from fastapi.exceptions import HTTPException


class PizzaAttribute(BaseModel):
    """Атрибуты для отображения пицц."""

    page: Optional[int] = 0
    category: Optional[int] = None
    sortBy: Optional[str] = None
    order: Optional[str] = None
    search: Optional[str] = None

    @validator("page")
    def page_validator(cls, value):
        if value is not None and (value < 1):
            raise HTTPException(status_code=400, detail="Не верно указан параметр page")

        return value

    @validator("category")
    def category_validator(cls, value):
        if value is not None and (value < 0):
            raise HTTPException(
                status_code=400, detail="Не верно указан параметр category"
            )

        return value


class PizzaPatchAttribute(BaseModel):
    """Атрибуты редактирования пиццы."""

    id: int
    title: Optional[Any] = None
    types: Optional[Any] = None
    size: Optional[Any] = None
    price: Optional[Any] = None
    rating: Optional[Any] = None
    description: Optional[Any] = None
    pfc: Optional[Any] = None
    wtf: Optional[Any] = None
    image: Optional[Any] = None

    @root_validator(pre=True)
    def pre_validator(cls, values):
        attrs = values.keys()

        if len(attrs) <= 1:
            raise HTTPException(
                status_code=400, detail="Список изменяемых атрибутов пуст"
            )

        return values


class PizzaAddAttribute(BaseModel):
    """Атрибуты добавления пиццы."""

    title: Optional[Any] = None
    types: Optional[Any] = None
    size: Optional[Any] = None
    price: Optional[Any] = None
    rating: Optional[Any] = None
    description: Optional[Any] = None
    pfc: Optional[Any] = None
    wtf: Optional[Any] = None
    image: Optional[Any] = None

    @root_validator(pre=True)
    def pre_validator(cls, values):
        attrs = values.keys()

        if len(attrs) == 0:
            raise HTTPException(
                status_code=400, detail="Не переданы данные для создания новой пиццы"
            )

        return values


class PizzaDeleteAttribute(BaseModel):
    """Атрибуты при запросе на удаление пиццы."""

    pizza_id: int

    @root_validator(pre=True)
    def pre_validator(cls, values):
        attrs = values.keys()

        if "pizza_id" not in attrs or not values.get("pizza_id"):
            HTTPException(status_code=400, detail="Отсутствует идентификатор пиццы")

        return values

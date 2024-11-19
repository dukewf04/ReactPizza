from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncConnection

from packages.database import get_db_connect
from packages.pizza.pizza import Pizza


from chemas.pizza import (
    PizzaAttribute,
    PizzaPatchAttribute,
    PizzaAddAttribute,
    PizzaDeleteAttribute,
)

worker = APIRouter()


@worker.get("/pizzas")
async def get_pizzas(req: Request, db_conn: AsyncConnection = Depends(get_db_connect)):
    """Возвращает список пицц с учетом применненных сортировок и фильтров."""

    attr = PizzaAttribute(**req.query_params)
    pizza = Pizza(db_conn)
    result = await pizza.get_pizzas(attr=attr)

    return result


@worker.get("/all_pizzas")
async def get_all_pizzas(db_conn: AsyncConnection = Depends(get_db_connect)):
    """Возвращает список всех пицц."""

    pizza = Pizza(db_conn)
    result = await pizza.get_all_pizzas()

    return result


@worker.patch("/pizza")
async def patch_pizza(
    attr: PizzaPatchAttribute, db_conn: AsyncConnection = Depends(get_db_connect)
):
    """Изменение данных по пицце."""

    pizza = Pizza(db_conn)
    result = await pizza.patch_pizza(attr=attr)

    return result


@worker.post("/pizza")
async def patch_pizza(
    attr: PizzaAddAttribute, db_conn: AsyncConnection = Depends(get_db_connect)
):
    """Добавление новой пиццы."""

    pizza = Pizza(db_conn)
    result = await pizza.add_new_pizza(attr=attr)

    return result


@worker.delete("/pizza")
async def delete_pizza(
    attr: PizzaDeleteAttribute, db_conn: AsyncConnection = Depends(get_db_connect)
):
    """Удаление пиццы из базы."""

    pizza = Pizza(db_conn=db_conn)
    await pizza.delete_pizza(pizza_id=attr.pizza_id)

    return {"success": True}

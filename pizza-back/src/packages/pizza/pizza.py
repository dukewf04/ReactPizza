from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection
from packages.object import Object
from chemas.pizza import PizzaAttribute, PizzaPatchAttribute, PizzaAddAttribute


class Pizza(Object):
    """Базовый класс для работы с данными по пиццам."""

    def __init__(self, db_conn: AsyncConnection):
        super().__init__(db_conn=db_conn)
        self.limit = 8

    @staticmethod
    def get_condition(attr: PizzaAttribute) -> str | None:
        """Конструктор условия WHERE."""

        condition_list = []
        if attr.category is not None:
            condition_list.append("category = :category")
        if attr.search:
            condition_list.append(f"title ILIKE('%{attr.search}%')")

        if len(condition_list) > 0:
            result = " AND ".join(condition_list)
        else:
            result = None

        return result

    async def get_count(self, attr: PizzaAttribute) -> int:
        """Получить количество пицц с учетом фильтров"""

        stmt = f"""
            SELECT COUNT(id) 
            FROM pizzas
            WHERE {self.conditions if self.conditions else "1 = 1"}          
        """

        count = await self.count(text(stmt), dict(attr))

        return count

    async def get_pizzas(self, attr: PizzaAttribute):
        """Возвращает список пицц с учетом применненных сортировок и фильтров."""

        self.conditions = self.get_condition(attr)

        count = await self.get_count(attr=attr)
        if count == 0:
            return []

        offset = f"{(int(attr.page) - 1) * self.limit if attr.page else '0'}"

        sorting = f"""
            {attr.sortBy if attr.sortBy else 'title'}
            {attr.order if attr.order else 'ASC'}
        """

        stmt = f"""
            SELECT
                id
                , image
                , title
                , ARRAY(
                    SELECT
                      t.type_name
                    FROM types t
                    WHERE t.type_id = ANY(p.type_ids)
                  ) AS types
                , size
                , price
                , category
                , rating
                , description
                , pfc
                , wtf
            FROM pizzas p
            WHERE {self.conditions if self.conditions else "1 = 1"}   
            ORDER BY {sorting}
            OFFSET {offset} LIMIT {self.limit}            
        """

        pizzas_list = await self.select(text(stmt), dict(attr))
        result = [item._asdict() for item in pizzas_list]

        return {"count": count, "data": result}

    async def get_all_pizzas(self):
        """Возвращает все пиццы."""

        stmt = f"""
            SELECT
                id
                , image
                , title
                , ARRAY(
                    SELECT
                      t.type_name
                    FROM types t
                    WHERE t.type_id = ANY(p.type_ids)
                  ) AS types
                , size
                , price
                , category
                , rating
                , description
                , pfc
                , wtf
            FROM pizzas p   
            ORDER BY title     
        """

        pizzas_list = await self.select(text(stmt))
        result = [item._asdict() for item in pizzas_list]

        return {"count": len(result), "data": result}

    async def patch_pizza(self, attr: PizzaPatchAttribute):
        """Изменение данных по конкретной пицце."""

        update_query = ""
        for k, v in attr.dict(include=attr.__fields_set__, exclude={"id"}).items():
            if v:
                update_query += f"{k} = '{v}', "
        update_query = update_query[:-2]

        stmt = f"""
            UPDATE pizzas
            SET 
                {update_query}
            WHERE 
                id = :id;
        """

        await self.db_conn.execute(text(stmt), dict(attr))
        await self.db_conn.commit()

        return {"success": True}

    async def add_new_pizza(self, attr: PizzaAddAttribute):
        """Добавление новой пиццы."""

        attr_keys = attr.dict(include=attr.__fields_set__, exclude={"id"}).keys()

        stmt = f"""
            INSERT INTO pizzas (type_ids, {', '.join(attr_keys)})
            VALUES (ARRAY[1, 2], {', '.join(list(map(lambda x: f':{x}', attr_keys)))})
        """

        await self.db_conn.execute(text(stmt), dict(attr))
        await self.db_conn.commit()

        return {"success": True}

    async def delete_pizza(self, pizza_id: int) -> None:
        """Удалить пиццу из базы"""

        stmt = f"""
            DELETE FROM pizzas WHERE id = :pizza_id  
        """

        await self.db_conn.execute(text(stmt), {"pizza_id": pizza_id})
        await self.db_conn.commit()

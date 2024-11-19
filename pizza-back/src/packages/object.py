from typing import Optional, Sequence, Any

from sqlalchemy.ext.asyncio import AsyncConnection
from sqlalchemy import Executable, Row, Result


class Object:
    """Родительский класс для взаимодействия с бд.

    Методы:
        - select() - запрос данных для страницы
        - count() - запрос количества строк
        - add() - добавление данных в базу
    """

    def __init__(self, db_conn: Optional[AsyncConnection] = None):
        self.db_conn = db_conn

    async def select(
        self, stmt: Executable, args: Optional[dict | list[dict]] = None
    ) -> Sequence[Row[tuple]]:
        """Выборка записей из таблицы.

        :param stmt: Экземпляр класса Executable содержащий
            оператор и условия для выполнения запроса - select(), text().
        :param args: Аргументы для подстановки в запрос.
        :return: Результат выполнения запроса.
        """

        result: Result = await self.db_conn.execute(stmt, args)
        rows: Sequence[Row[tuple]] = result.all()

        return rows

    async def count(self, stmt: Executable, args: dict[str, Any]) -> int:
        """Запрос количества строк, удовлетворяющих условиям поиска.

        :param stmt: Экземпляр класса Executable содержащий
            оператор и условия для выполнения запроса.
        :param args: Аргументы для подстановки в запрос.
        :return: Количество строк, удовлетворяющих условиям поиска.
        """

        # Запрос общего количества строк с учётом фильтров.
        result_count: Result = await self.db_conn.execute(stmt, args)
        return result_count.scalar()

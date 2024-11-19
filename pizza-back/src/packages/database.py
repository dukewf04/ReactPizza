from sqlalchemy.ext.asyncio import async_sessionmaker
from config.config import load_config
import contextlib
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncConnection,
)
from typing import AsyncIterator


class DatabaseConnector:
    """Высокоуровневый и универсальный интерфейс для работы с различными базами данных."""

    def __init__(self, url: str):
        self._engine = create_async_engine(url, pool_recycle=300)
        self._sessionmaker = async_sessionmaker(autocommit=False, bind=self._engine)

    def init(self, host: str):
        """Инициализация соединения с базой данных."""
        self._engine = create_async_engine(host, pool_recycle=300)

    async def close(self):
        """Закрытие соединения с базой данных."""
        if self._engine is None:
            raise Exception("DatabaseConnector не инициализирован")
        await self._engine.dispose()
        self._engine = None

    @contextlib.asynccontextmanager
    async def async_connect(self) -> AsyncIterator[AsyncConnection]:
        """Контекстный менеджер для получения асинхронного соединения
        без открытой транзакции (сценарий "Commit As You Go"). При выходе
        из блока неявно вызывается close().

        Пример использования:
        ::
            async with db_connector.async_connect() as connection:
                # Старт транзакции
                with connection.begin():
                    connection.execute(...)
                # При выходе из блока неявно вызван commit(), транзакция завершена

                connection.execute(...) # старт новой транзакции
                connection.rollback() # откат, транзакция завершена

                connection.execute(...) # старт новой транзакции
                connection.commit() # фиксация, транзакция завершена
        """
        if self._engine is None:
            raise Exception("DatabaseConnector не инициализирован")

        async with self._engine.connect() as connection:
            yield connection


config = load_config()
db_settings = config.get("database", {})

database_url = "postgresql+asyncpg://{user}:{password}@{host}:{port}/{database}".format(
    database=db_settings.get("db_name"),
    user=db_settings.get("db_user"),
    password=db_settings.get("db_password"),
    host=db_settings.get("db_host"),
    port=db_settings.get("db_port"),
)

sessionmanager = DatabaseConnector(database_url)


async def get_db_connect() -> AsyncConnection:
    """Этот метод может быть использован как зависимость (dependency)
    в обработчиках запросов FastAPI.

    **Пример**:
    ::
        @app.get("/some_endpoint")
        async def some_endpoint(db_session: AsyncSession = Depends(get_db_connect)):
            pass
    """
    async with sessionmanager.async_connect() as connection:
        yield connection

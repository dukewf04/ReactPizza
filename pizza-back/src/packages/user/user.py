from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection
from packages.object import Object
from packages.auth.auth import Auth

from chemas.user import UserProfileAttribute, UserDeleteAttribute, UserPatchAttribute


class User(Object):
    """Базовый класс для работы с пользователями"""

    def __init__(self, db_conn: AsyncConnection):
        super().__init__(db_conn=db_conn)
        self.db_conn = db_conn

    async def get_all_users(self):
        """Получить список всех пользователей"""

        stmt = f"""
            SELECT * 
            FROM users
            ORDER BY role        
        """

        users = await self.select(text(stmt))
        result = [item._asdict() for item in users]

        return result

    async def delete_user(self, attr: UserDeleteAttribute):
        """Удалить пользователя из базы"""

        stmt = f"""
            DELETE FROM users WHERE user_id = :user_id  
        """

        await self.db_conn.execute(text(stmt), dict(attr))
        await self.db_conn.commit()

    async def patch_user(self, attr: UserPatchAttribute):
        """Изменение данных пользователя."""

        update_query = ""
        for k, v in attr.dict(include=attr.__fields_set__, exclude={"user_id"}).items():
            if v:
                if k == "notification":
                    update_query += f"notification = json_build_object('advertising', {v['advertising']},'promotions', {v['promotions']}), "
                elif k == "password":
                    update_query += (
                        f"{k} = '{Auth(self.db_conn).get_password_hash(v)}', "
                    )
                else:
                    update_query += f"{k} = '{v}', "
        update_query = update_query[:-2]

        stmt = f"""
            UPDATE users
            SET 
                {update_query}
            WHERE 
                user_id = :user_id;
        """

        await self.db_conn.execute(text(stmt), dict(attr))
        await self.db_conn.commit()

        return {"success": True}

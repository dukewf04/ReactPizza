from pydantic import BaseModel, root_validator


class RegisterAttribute(BaseModel):
    """Атрибуты при регистрации пользователя."""

    name: str
    email: str
    password: str

    @root_validator(pre=True)
    def pre_validator(cls, values):
        attrs = values.keys()

        return values


class LoginAttribute(BaseModel):
    """Атрибуты при авторизации пользователя."""

    email: str
    password: str

    @root_validator(pre=True)
    def pre_validator(cls, values):
        attrs = values.keys()

        return values

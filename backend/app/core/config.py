from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, MySQLDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Tarn Bulletin Board API"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Database
    MYSQL_SERVER: str = "db"
    MYSQL_USER: str = "user"
    MYSQL_PASSWORD: str = "password"
    MYSQL_DB: str = "kanban"
    MYSQL_PORT: int = 3306
    DATABASE_URI: Optional[str] = None

    @field_validator("DATABASE_URI", mode="before")
    def assemble_db_connection(cls, v: Optional[str], info: Any) -> Any:
        if isinstance(v, str):
            return v
        
        # Build MySQL connection string
        # mysql+aiomysql://user:password@host:port/db
        return MySQLDsn.build(
            scheme="mysql+aiomysql",
            username=info.data.get("MYSQL_USER"),
            password=info.data.get("MYSQL_PASSWORD"),
            host=info.data.get("MYSQL_SERVER"),
            port=info.data.get("MYSQL_PORT"),
            path=f"{info.data.get('MYSQL_DB') or ''}",
        ).unicode_string()

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")


settings = Settings()

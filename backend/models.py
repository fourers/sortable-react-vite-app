from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel


class Report(SQLModel, table=True):
    __tablename__ = "report"

    id: int | None = Field(default=None, primary_key=True)
    display_name: str
    selected_options: list | dict = Field(sa_column=Column(JSON))

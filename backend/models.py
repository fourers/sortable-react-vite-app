from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.types import JSON


class Base(DeclarativeBase):
    pass


class Report(Base):
    __tablename__ = "report"

    id = Column(Integer, primary_key=True)
    display_name = Column(String, nullable=False)
    selected_options = Column(JSON, default=list[dict])

    def to_json(self):
        return {
            "id": self.id,
            "display_name": self.display_name,
            "selected_options": self.selected_options,
        }


db = SQLAlchemy(model_class=Base)

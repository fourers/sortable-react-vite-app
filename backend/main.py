from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlmodel import Session, SQLModel, create_engine, select

from constants import REPORT_COLUMNS
from models import Report

connect_args = {"check_same_thread": False}
engine = create_engine("sqlite:///instance/backend.db", connect_args=connect_args)


def get_session():
    with Session(engine) as session:
        yield session


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield


SessionDep = Annotated[Session, Depends(get_session)]
app = FastAPI(lifespan=lifespan)


@app.get("/api/reports/options")
def get_options() -> Response:
    return JSONResponse(content=REPORT_COLUMNS)


@app.get("/api/reports")
def get_reports(session: SessionDep) -> list[Report]:
    reports = session.exec(select(Report))
    return reports.all()


@app.get("/api/reports/{report_id}")
def get_report(report_id: int, session: SessionDep) -> Report:
    report = session.get(Report, report_id)
    if not report:
        return HTTPException(status_code=404, detail="Report not found")
    return report


class ReportInput(BaseModel):
    display_name: str
    selected_options: list[str]


@app.post("/api/reports")
def create_report(report_input: ReportInput, session: SessionDep) -> Report:
    report = Report(
        display_name=report_input.display_name,
        selected_options=report_input.selected_options,
    )
    session.add(report)
    session.commit()
    session.refresh(report)
    return report


@app.post("/api/reports/{report_id}")
def update_report(
    report_input: ReportInput, report_id: int, session: SessionDep
) -> Report:
    report = session.get(Report, report_id)
    if not report:
        return HTTPException(status_code=404, detail="Report not found")
    report.display_name = report_input.display_name
    report.selected_options = report_input.selected_options
    session.commit()
    session.refresh(report)
    return report


@app.delete("/api/reports/{report_id}")
def delete_report(report_id: int, session: SessionDep) -> Report:
    report = session.get(Report, report_id)
    if not report:
        return HTTPException(status_code=404, detail="Report not found")
    session.delete(report)
    session.commit()
    return report

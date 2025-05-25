from unittest.mock import Mock, patch

import pytest

from main import get_session, lifespan
from models import Report


@patch("main.Session")
def test_get_session(mock_main_session):
    result = list(get_session())
    assert result == [mock_main_session.return_value.__enter__.return_value]


@pytest.mark.asyncio
@patch("sqlmodel.SQLModel.metadata.create_all")
async def test_lifespan(mock_create_all):
    async with lifespan(Mock()):
        pass
    mock_create_all.assert_called_once()


def test_get_options(client):
    resp = client.get("/api/reports/options")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


def test_get_reports(client, mock_session):
    mock_session.exec.return_value.all.return_value = [
        Report(
            id=1,
            display_name="Test Report",
            selected_options=[{"column": "col1", "selected_name": "Name 1"}],
        ),
        Report(
            id=2,
            display_name="Another Report",
            selected_options=[{"column": "col2", "selected_name": "Name 2"}],
        ),
    ]
    # Get all reports
    resp = client.get("/api/reports")
    assert resp.status_code == 200
    assert resp.json() == [
        {
            "id": 1,
            "display_name": "Test Report",
            "selected_options": [{"column": "col1", "selected_name": "Name 1"}],
        },
        {
            "id": 2,
            "display_name": "Another Report",
            "selected_options": [{"column": "col2", "selected_name": "Name 2"}],
        },
    ]


def test_get_report(client, mock_session):
    mock_session.get.return_value = Report(
        id=1,
        display_name="Test Report 1",
        selected_options=[{"column": "col1", "selected_name": "Name 1"}],
    )
    # Get single report
    resp = client.get("/api/reports/1")
    assert resp.status_code == 200
    assert resp.json() == {
        "id": 1,
        "display_name": "Test Report 1",
        "selected_options": [{"column": "col1", "selected_name": "Name 1"}],
    }


def test_get_report_not_found(client, mock_session):
    mock_session.get.return_value = None
    # Attempt to get a non-existent report
    resp = client.get("/api/reports/9999")
    assert resp.status_code == 404
    assert resp.json() == {"detail": "Report not found"}


def test_create_report(client, mock_session):
    # Create a report
    data = {
        "display_name": "Test Report",
        "selected_options": [{"column": "col1", "selected_name": "Name 1"}],
    }
    resp = client.post("/api/reports", json=data)
    assert resp.status_code == 200
    assert resp.json() == {
        "id": None,  # ID will be set by the database
        "display_name": "Test Report",
        "selected_options": [{"column": "col1", "selected_name": "Name 1"}],
    }
    mock_session.add.assert_called_once_with(
        Report(
            display_name="Test Report",
            selected_options=[{"column": "col1", "selected_name": "Name 1"}],
        )
    )
    mock_session.commit.assert_called_once()


def test_update_report(client, mock_session):
    mock_session.get.return_value = Report(
        id=45,
        display_name="Old Name",
        selected_options=[{"column": "col1", "selected_name": "Name 1"}],
    )
    # Update the report
    update_data = {
        "display_name": "New Name",
        "selected_options": [{"column": "col2", "selected_name": "Name 2"}],
    }
    resp = client.patch("/api/reports/45", json=update_data)
    assert resp.status_code == 200
    assert resp.json() == {
        "id": 45,
        "display_name": "New Name",
        "selected_options": [{"column": "col2", "selected_name": "Name 2"}],
    }
    mock_session.commit.assert_called_once()


def test_update_report_not_found(client, mock_session):
    mock_session.get.return_value = None
    update_data = {
        "display_name": "Doesn't Matter",
        "selected_options": [],
    }
    resp = client.patch("/api/reports/9999", json=update_data)
    assert resp.status_code == 404
    assert resp.json() == {"detail": "Report not found"}


def test_delete_report(client, mock_session):
    mock_session.get.return_value = Report(
        id=67,
        display_name="Report to Delete",
        selected_options=[{"column": "col1", "selected_name": "Name 1"}],
    )
    # Delete the report
    resp = client.delete("/api/reports/67")
    assert resp.status_code == 200
    assert resp.json() == {
        "id": 67,
        "display_name": "Report to Delete",
        "selected_options": [{"column": "col1", "selected_name": "Name 1"}],
    }
    mock_session.delete.assert_called_once_with(mock_session.get.return_value)
    mock_session.commit.assert_called_once()


def test_delete_report_not_found(client, mock_session):
    mock_session.get.return_value = None
    # Attempt to delete a non-existent report
    resp = client.delete("/api/reports/9999")
    assert resp.status_code == 404
    assert resp.json() == {"detail": "Report not found"}

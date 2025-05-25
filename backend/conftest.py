from unittest.mock import Mock, patch

import pytest
from fastapi.testclient import TestClient

from main import app, get_session


@pytest.fixture
def mock_session():
    """Fixture that returns a fresh, mutable mock and sets the dependency override."""
    mock = Mock()

    def mock_get_session():
        yield mock

    app.dependency_overrides[get_session] = mock_get_session
    yield mock
    app.dependency_overrides.clear()


@pytest.fixture
def mock_lifespan():
    """Fixture to mock the lifespan of the FastAPI app."""
    with patch("main.lifespan") as mock:
        yield mock


@pytest.fixture
def client(mock_lifespan):
    """Fixture for the FastAPI test client."""
    return TestClient(app)

import pytest
from fastapi.testclient import TestClient
import main


@pytest.fixture(autouse=True)
def reset_state():
    main.todos.clear()
    main.next_id = 1
    yield


client = TestClient(main.app)


def test_root_message():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Todo API is running"}


def test_create_todo_assigns_incrementing_id():
    first = client.post("/api/todos", json={"title": "First", "description": "one"})
    second = client.post("/api/todos", json={"title": "Second", "description": "two"})

    assert first.status_code == 200
    assert second.status_code == 200
    assert first.json()["id"] == 1
    assert second.json()["id"] == 2


def test_get_todos_returns_all_created_items():
    client.post("/api/todos", json={"title": "A"})
    client.post("/api/todos", json={"title": "B"})

    response = client.get("/api/todos")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert {todo["title"] for todo in data} == {"A", "B"}


def test_get_single_todo():
    created = client.post("/api/todos", json={"title": "Read"}).json()

    response = client.get(f"/api/todos/{created['id']}")

    assert response.status_code == 200
    assert response.json()["title"] == "Read"


def test_update_title_and_description():
    created = client.post("/api/todos", json={"title": "Old", "description": "desc"}).json()

    response = client.put(f"/api/todos/{created['id']}", json={"title": "New", "description": "updated"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["title"] == "New"
    assert payload["description"] == "updated"


def test_toggle_completion_state():
    created = client.post("/api/todos", json={"title": "Toggle"}).json()

    response = client.put(f"/api/todos/{created['id']}", json={"completed": True})

    assert response.status_code == 200
    assert response.json()["completed"] is True


def test_update_missing_todo_returns_404():
    response = client.put("/api/todos/999", json={"title": "Nope"})
    assert response.status_code == 404


def test_delete_todo_removes_item():
    created = client.post("/api/todos", json={"title": "Delete me"}).json()

    delete_response = client.delete(f"/api/todos/{created['id']}")
    get_response = client.get(f"/api/todos/{created['id']}")

    assert delete_response.status_code == 200
    assert get_response.status_code == 404


def test_delete_missing_todo_returns_404():
    response = client.delete("/api/todos/1234")
    assert response.status_code == 404


def test_validation_error_when_title_missing():
    response = client.post("/api/todos", json={"description": "no title"})
    assert response.status_code == 422



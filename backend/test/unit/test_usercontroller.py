import pytest
from src.controllers.usercontroller import UserController


# Fake DAO class for mocking
class MockDAO:
    def __init__(self, return_value=None, raise_exception=False):
        self.return_value = return_value
        self.raise_exception = raise_exception

    def find(self, query):
        if self.raise_exception:
            raise Exception("Database error")
        return self.return_value


# 1. Valid email, single user
def test_get_user_single_result():
    dao = MockDAO(return_value=[{"email": "user@test.com"}])
    controller = UserController(dao)

    result = controller.get_user_by_email("user@test.com")

    assert result == {"email": "user@test.com"}


# 2. Valid email, multiple users
def test_get_user_multiple_results(capsys):
    dao = MockDAO(return_value=[
        {"email": "user@test.com"},
        {"email": "user@test.com"}
    ])
    controller = UserController(dao)

    result = controller.get_user_by_email("user@test.com")

    captured = capsys.readouterr()

    assert result == {"email": "user@test.com"}
    assert "more than one user found" in captured.out


# 3. No users found (reveals bug)
def test_get_user_no_results():
    dao = MockDAO(return_value=[])
    controller = UserController(dao)

    with pytest.raises(IndexError):
        controller.get_user_by_email("user@test.com")


# 4. Invalid email
def test_invalid_email():
    dao = MockDAO()
    controller = UserController(dao)

    with pytest.raises(ValueError):
        controller.get_user_by_email("invalid-email")


# 5. Empty email
def test_empty_email():
    dao = MockDAO()
    controller = UserController(dao)

    with pytest.raises(ValueError):
        controller.get_user_by_email("")


# 6. DAO exception
def test_dao_exception():
    dao = MockDAO(raise_exception=True)
    controller = UserController(dao)

    with pytest.raises(Exception):
        controller.get_user_by_email("user@test.com")

import pytest
from src.util.dao import DAO

@pytest.fixture
def dao():
    dao = DAO("test_collection")
    # Clean documents instead of dropping collection
    dao.collection.delete_many({})
    yield dao
    dao.collection.delete_many({})
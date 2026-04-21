import pytest

def test_create_valid(dao):
    data = {
        "name": "Swaroop",
        "active": True
    }

    result = dao.create(data)

    assert result["name"] == "Swaroop"
    assert result["active"] is True
    assert "_id" in result


def test_create_missing_field(dao):
    data = {
        "active": True
    }

    with pytest.raises(Exception):
        dao.create(data)


def test_create_wrong_type(dao):
    data = {
        "name": "Kishore",
        "active": "yes"
    }

    with pytest.raises(Exception):
        dao.create(data)


def test_create_empty(dao):
    with pytest.raises(Exception):
        dao.create({})
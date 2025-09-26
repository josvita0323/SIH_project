from app.crud import upsert_user
from app.database import create_db_and_tables, get_session

create_db_and_tables()


def main():
    session = next(get_session())
    user = upsert_user(session, "abc@123", "Hii")
    print("added")


main()

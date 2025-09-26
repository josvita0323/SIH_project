from app.crud import *
from app.database import create_db_and_tables, get_session
from app.ocr import OCR_Manager

create_db_and_tables()


def main():
    session = next(get_session())
    user = upsert_user("abc@123", "Hii")
    print(f"User Added - {user}")
    create_job(1)
    upsert_upload(1, "test_data/fake_kochi.pdf")
    upload_path = session.exec(
        select(Upload.file_path).where(Upload.job_id == 1)).first() or ""
    ocm = OCR_Manager(upload_path)
    pages = ocm.process_doc()
    for page in pages:
        extrcontent = upsert_extracted_content(
            1, " ".join(page["content"]), page["page-number"])
        print(f"{extrcontent.id} has been inserted!")
        stmt = select(ExtractedContent)
        output = session.exec(stmt).all()
        print(output)


main()

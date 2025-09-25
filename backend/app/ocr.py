import easyocr
import numpy as np
import fitz

class OCR_Manager:
    def read_data(pdf_path:str) -> list[dict]:
        try:
            data = {
                "bounding-boxes":[],
                "content":[],
                "conf-score":[]
            }
            reader = easyocr.Reader(['en']) 
            document = fitz.open(pdf_path)
            for i, page in enumerate(document):
                print(f"Performing OCR on PAGE {i+1}.")
                page_pix = page.get_pixmap(dpi=300)
                image_vector = np.frombuffer(page_pix.samples, dtype=np.uint8).reshape(page_pix.height, page_pix.width, page_pix.n)
                results = reader.readtext(image_vector)
                for sentence in results:
                    data["bounding-boxes"].append(sentence[0])
                    data["content"].append(sentence[1])
                    data["conf-score"].append(sentence[2])
            document.close()
            return data
        except Exception as e:
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    ocm = OCR_Manager()
    data = ocm.read_data("test/pdfs/ML_Assignment.pdf")
    print(" ".join(data["content"]))
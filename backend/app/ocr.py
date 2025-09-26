import pytesseract as pyt
import numpy as np
import fitz
import json


class OCR_Manager:
    def __init__(self, pdf_path:str): 
        self.__document = fitz.open(pdf_path)
            
    def process_doc(self) -> list[dict]:
        try:
            pagewise_json_data = []
            for i, page in enumerate(self.__document):
                print(f"Performing OCR on PAGE {i+1}.")
                page_pix = page.get_pixmap(dpi=300)
                image_vector = np.frombuffer(page_pix.samples, dtype=np.uint8).reshape(page_pix.height, page_pix.width, page_pix.n)
                pagewise_json_data.append(self.__process_page(image_vector, i))
            self.__document.close()
            return pagewise_json_data
        except Exception as e:
            print(f"Error: {e}")

    def __process_page(self, image_vector, page_number:int) -> list[dict]:
        try:
            data = {
                "content":[],
                "page-number": page_number + 1
            } 
            results = pyt.image_to_string(image_vector)
            for sentence in results:
                data["content"].append(sentence[1])
            return data
        except Exception as e:
            print(f"An error occurred: {e}")
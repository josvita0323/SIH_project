import easyocr
import numpy as np
import fitz
import json


class OCR_Manager:
    def __init__(self, pdf_path:str):
        self.__reader = easyocr.Reader(['en']) 
        self.__document = fitz.open(pdf_path)
            
    def process_doc(self, output_dir:str|None = None) -> None:
        try:
            for i, page in enumerate(self.__document):
                print(f"Performing OCR on PAGE {i+1}.")
                page_pix = page.get_pixmap(dpi=300)
                image_vector = np.frombuffer(page_pix.samples, dtype=np.uint8).reshape(page_pix.height, page_pix.width, page_pix.n)
                page_json = self.__process_page(image_vector, i)
                if output_dir:
                    
                    with open(f"{output_dir}/{i+1}.json", "w") as f:
                        f.write(json.dumps(page_json, indent=1))
                        f.close()
            self.__document.close()
        except Exception as e:
            print(f"Error: {e}")

    def __process_page(self, image_vector, page_number:int) -> list[dict]:
        try:
            data = {
                "bounding-boxes":[],
                "content":[],
                "conf-score":[],
                "page": page_number + 1
            } 
            results = self.__reader.readtext(image_vector)
            for sentence in results:
                for i in range(4):
                    for j in range(2):
                        sentence[0][i][j] = float(sentence[0][i][j])
                data["bounding-boxes"].append(sentence[0])
                data["content"].append(sentence[1])
                data["conf-score"].append(float(sentence[2]))
            return data
        except Exception as e:
            print(f"An error occurred: {e}")
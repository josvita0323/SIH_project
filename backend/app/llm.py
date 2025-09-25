import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline, BitsAndBytesConfig
import json

class LLM_Manager:
    def __init__(self):
        self.__output = ""
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        if self.device == "cpu":
            print("Warning: Running on CPU. This will be very slow.")

        print(f"Using device: {self.device}")

        self.model_name = "Qwen/Qwen1.5-1.8B-Chat"

        quantization_config = BitsAndBytesConfig(
            load_in_4bit=True,
            # This is the crucial flag that fixes your specific error
            llm_int8_enable_fp32_cpu_offload=True,
        )

        # Load the tokenizer
        print("Loading tokenizer...")
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, trust_remote_code=True)

        print("Loading model with 4-bit quantization and CPU offloading...")
        try:
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                trust_remote_code=True,
                # Pass the special quantization configuration
                quantization_config=quantization_config,
                # 'device_map="auto"' will now use the offloading rule you defined
                device_map="auto",
                # Explicitly setting the torch_dtype helps the loader handle tensors correctly.
                dtype=torch.bfloat16
            )
        except Exception as e:
            print(f"An error occurred during model loading: {e}")
            print("\n--- TROUBLESHOOTING ---")
            print("1. Ensure 'bitsandbytes' and 'accelerate' are correctly installed.")
            print("2. Your hardware might be too limited even for this. Consider a smaller model like 'Qwen/Qwen1.5-1.8B-Chat'.")
            print("3. For very low VRAM scenarios, tools like Ollama are often better optimized.")
            exit()

    @property
    def current_output(self):
        return self.__output

    def run(self, data:str) -> str:
        # Create a text-generation pipeline
        pipe = pipeline("text-generation", model=self.model, tokenizer=self.tokenizer)

        # The prompt for the model
        prompt =f"""
Analyze the text data provided below to identify key topics, the most relevant department for each topic, and a summary.

**Context & Rules:**
The data is a meeting transcript. The relevant departments are strictly limited to: "Rolling Stock Operations", "Procurement", "HR & Safety", and "Executive Management".

**Required Output Format:**
Your response MUST be a single, valid JSON object.
This object must contain one key: "analysis_results".
The value of "analysis_results" must be a list of JSON objects.
Each object in the list must have the following three string keys, and nothing else:
- "Department_Name": The name of the most relevant department from the provided list.
- "Topic_Name": A concise name for the topic discussed.
- "Summary": A brief, paraphrased summary of the discussion on that topic.

**Example of the required JSON structure:**
```json
{{
  "analysis_results": [
    {{
      "Department_Name": "Example Department",
      "Topic_Name": "Example Topic Name",
      "Summary": "This is an example summary of the discussion."
    }}
  ]
}}
```

**Text Data to Analyze:**
--- START OF DATA ---
{data}
--- END OF DATA ---

Now, generate the JSON output based on the provided text data.
"""
        messages = [
            {"role": "system", "content": "You are a helpful assistant that always responds in valid JSON format."},
            {"role": "user", "content": prompt}
        ]
        prompt_formatted = self.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)

        print("\n--- Generating Response ---")
        try:
            outputs = pipe(
                prompt_formatted,
                max_new_tokens=1024,
                do_sample=True,
                temperature=0.4,
                top_k=50,
                top_p=0.95
            )
            
            generated_text = outputs[0]["generated_text"]
            answer = generated_text[len(prompt_formatted):]
            self.__output = answer

        except Exception as e:
            print(f"An error occurred during generation: {e}")
        finally:
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
                print("\nCUDA cache cleared.")

    def parse_output(self, data:str, output:str = None) -> list[dict]:
        try:
            output = self.current_output if output==None else output
            while '```json' not in output:
                self.run(data)
                output = self.current_output
            json_str = output.split('```json')[1].split('```')[0].strip()
            parsed_json = json.loads(json_str)
            print("Successfully parsed JSON:")
            return parsed_json
        except json.JSONDecodeError as e:
            print(f"Error: Failed to decode JSON from the model's response. {e}")
        except Exception as e:
            print(f"An unexpected error occurred during JSON parsing: {e}")

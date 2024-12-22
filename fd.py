import sys
import base64
import cv2
import numpy as np
import os
from deepface import DeepFace
import tensorflow as tf
import json
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  
import logging
logging.basicConfig(level=logging.CRITICAL)

def base64_to_image(base64_string):
    try:
        image_data = base64.b64decode(base64_string.split(",")[1])  
        np_array = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Image decoding failed")
        return img
    except Exception as e:
        raise ValueError(f"Error decoding image: {str(e)}")

def verify_faces(stored_image, input_image, threshold=0.5):
    try:
        result = DeepFace.verify(img1_path=stored_image, img2_path=input_image, model_name='VGG-Face', enforce_detection=True)
        distance = result["distance"]
        similarity_score = 1 - distance
        verified = similarity_score >= threshold
        return {
            "verified": verified,
            "distance": distance,
            "similarity_score": similarity_score
        }
    except Exception as e:
        return {"error": f"Exception during face verification: {str(e)}"}
try:

    input_data = sys.stdin.read()
    data = json.loads(input_data)  

    stored_image_base64 = data["storedImage"]
    input_image_base64 = data["inputImage"]

    stored_image = base64_to_image(stored_image_base64)
    input_image = base64_to_image(input_image_base64)
    result = verify_faces(stored_image, input_image, threshold=0.4)

    print(json.dumps(result))  

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)

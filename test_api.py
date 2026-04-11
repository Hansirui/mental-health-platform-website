import requests

url = "http://127.0.0.1:5051/predict_text"
data = {
    "text": "I feel tired all the time. I do not sleep well at night, and I often feel hopeless about my future."
}

resp = requests.post(url, json=data)

print("status_code:", resp.status_code)
print("response:")
print(resp.json())
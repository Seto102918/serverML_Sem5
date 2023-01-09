import requests

url = 'http://localhost:3000/post'

files = {'file': open('test1.jpg', 'rb')}

r = requests.post(url, files=files)
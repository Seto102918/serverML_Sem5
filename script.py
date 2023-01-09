import torch
import sys
from PIL import Image
import cv2
import base64
import numpy as np
import io

def stringToRGB(base64_string):
    imgdata = base64.b64decode(str(base64_string))
    img = Image.open(io.BytesIO(imgdata))
    # opencv_img= cv2.cvtColor(np.array(img), cv2.COLOR_BGR2RGB)
    return img

def main():
    with open('temp.txt', 'r') as f:
        lines = f.readline()

    decoded = stringToRGB(lines)
    decoded.show()

    model = torch.hub.load('ultralytics/yolov5', 'custom', 'model.pt')
    results = model(decoded)
    results.show()

    results = results.pandas().xyxy[0]

    arr = {}
    for i in range(len(results)):
        arr[i] = {
            'xmin' : results['xmin'][i],
            'xmax' : results['xmax'][i], 
            'ymin' : results['ymin'][i],
            'ymax' : results['ymax'][i]
        }

    print(arr)

    

if __name__ == '__main__':
    print('start')
    main()
else:
    print('FUCK')
import numpy as np
import tensorflow as tf
import os
import matplotlib.pyplot as plt
import cv2

IMG_SIZE = 128
classes = ['cheesecake','chicken_wings','donuts','french fries','fried rice',
           'hamburger','hot dog','ice cream','nachos','omelette','onion rings',
           'pizza','salad','samosa','sushi']

training_data = []

def plot_images(X):
    plt.figure(figsize=(5,2))
    plt.imshow(X)

def create_training_data(img_path):
    try:
        img_array = cv2.imread(img_path)
        new_array = cv2.resize(img_array, (IMG_SIZE, IMG_SIZE))
        new_array = new_array/255.0
        training_data.append([new_array, 0])
    except Exception as e:
        print(e)
        pass

img_path = "C://Desktop//image upload//public//images//image.png"

create_training_data(img_path)

X = []

for feature, label in training_data:
    X.append(feature)

x_np = np.array(X).reshape(-1, IMG_SIZE, IMG_SIZE, 3)

#plot_images(x_np[0])

model = tf.keras.models.load_model('C://Desktop//model92.15-52.9.h5')

y_predicted = model.predict(x_np)
y_predicted_labels = [np.argmax(i) for i in y_predicted]
op_predicted = classes[y_predicted_labels[len(y_predicted_labels)-1]]
print(op_predicted)
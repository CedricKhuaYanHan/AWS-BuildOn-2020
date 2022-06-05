from random import randint
import sklearn
from sklearn.neighbors import KNeighborsRegressor
from sklearn.ensemble import RandomForestRegressor
from math import floor, sqrt
from keras.models import Model
from keras.layers import Dense, Input

from flask import Flask, request
app = Flask(__name__)

def FormatDataForTraining(HistoryData, window):
    HistoryData = [0] + HistoryData
    DifferencedData = [HistoryData[i] - HistoryData[i-1] for i in range(1,len(HistoryData))]
    train_x = []
    for i in range(window, len(DifferencedData)):
        train_x.append(DifferencedData[i - window : i])
    
    train_y = [i for i in DifferencedData[window:]]
    return train_x, train_y

def RMSE(model, test_data):
    test_x, test_y = FormatDataForTraining(test_data, 28)
    predictions = predict(model, test_x)
    assert len(predictions) == len(test_y)
    SE = [(test_y[i] - predictions[i]) ** 2 for i in range(len(predictions))]
    RMSE = (sum(SE) / len(predictions)) ** 0.5
    return RMSE

def train_neural_network(train_x, train_y, window):
    visible = Input((window))
    hidden = Dense(64, activation="relu")(visible)
    hidden = Dense(32, activation="relu")(hidden)
    hidden = Dense(1)(hidden)
    model = Model(visible, hidden)
    print("\n==neural network==")
    model.compile(optimizer='adam', loss='MeanSquaredError', metrics=['accuracy'])
    model.fit(train_x ,train_y, epochs=25)
    print(model.summary())
    print('==end neural network==\n')
    return model

def mockVisitationData(period, startDay = 0): # period is in days,startDay: 0 represents monday, 6 represents Sunday
    numberOfVisitors = [randint(1,6) for i in range(period)] # starts from day 1, a Monday
    
    # account for spikes in weekends
    for i in range(period):
        if (i - startDay) % 7 >= 5:
            numberOfVisitors[i] += randint(3,6)
    
    #account for spikes in public holidays
    publicHolidays = [0, 24, 25, 99, 120, 126, 142, 143, 211, 221, 317, 358]
    for i in range(period):
        if i in publicHolidays:
            numberOfVisitors[i] += randint(3,10)
            
    return numberOfVisitors

@app.route('/')
def index():
    return "Backend Time Series Flask Server Online."

@app.route('/predict')
def predict():
    # testData = mockVisitationData(365)
    req_data = request.get_json()
    HistoryData = req_data['data']
    window = req_data['window']
    train_x, train_y = FormatDataForTraining(HistoryData, window)
    model = train_neural_network(train_x, train_y, window)
    prediction = model.predict([HistoryData[-window:]])
    return str(prediction[0][0])
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import bson
import json

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'])

# MongoDB connection
uri = "mongodb+srv://muves218:idfZMHsuolF6WWMX@cluster0.1nv8pou.mongodb.net/cluster0?retryWrites=true&w=majority"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['cluster0']
collection = db['listings']
collection_2 = db['preferences']

# Load data from MongoDB and preprocess
cursor = collection.find()
df = pd.DataFrame(list(cursor))

# Preprocessing
df.availabilityOfWater = (df.availabilityOfWater == 'yes')
df.availabilityOfWater.replace({True: 1, False: 0}, inplace=True)

columns_to_drop = ['createdAt', 'updatedAt','_id','name','description','state','university','discountPrice','furnished','parking','type','offer','imageUrls','userRef','__v']

df_copy = df.copy()
df.drop(columns=columns_to_drop, inplace=True)

data_cat = df.select_dtypes(exclude=np.number)
data_num = df.select_dtypes(np.number)

ss = StandardScaler()
data_num_scaled = pd.DataFrame(ss.fit_transform(data_num), columns=data_num.columns)
data_scaled = pd.concat([data_num_scaled, data_cat], axis=1)
data_encoded_scaled = pd.get_dummies(data_scaled, columns=['apartmentType', 'location', 'roomType'])

model = NearestNeighbors(metric='cosine')
model.fit(data_encoded_scaled.dropna())

# Function to recommend properties
def recommend_properties(input_preferences):
    input_data = pd.DataFrame(input_preferences, index=[0])
    input_data_encoded = pd.get_dummies(input_data, columns=['apartmentType', 'location', 'roomType'])

    missing_cols = set(data_encoded_scaled.columns) - set(input_data_encoded.columns)
    for col in missing_cols:
        input_data_encoded[col] = 0

    input_data_encoded = input_data_encoded[data_encoded_scaled.columns]
    input_data_scaled = pd.DataFrame(ss.transform(input_data_encoded[data_num.columns]), columns=data_num.columns)
    input_data_scaled_encoded = pd.concat([input_data_scaled, input_data_encoded.drop(data_num.columns, axis=1)], axis=1)

    _, indices = model.kneighbors(input_data_scaled_encoded, n_neighbors=3)

    recommended_df = df_copy.iloc[indices[0]].copy()
    for col in columns_to_drop:
        recommended_df[col] = df_copy[col].iloc[indices[0]]

    recommended_df['_id'] = recommended_df['_id'].apply(lambda x: str(x))
    recommended_df['createdAt'] = recommended_df['createdAt'].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S'))
    recommended_df['updatedAt'] = recommended_df['updatedAt'].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S'))

    return recommended_df.to_dict(orient='records')

@app.route('/recommend/<string:preference_id>', methods=['GET'])
def get_recommendations_by_id(preference_id):
    preferences_doc = collection_2.find_one({"userRef": preference_id})

    availability_of_water = 1 if preferences_doc.get('availabilityOfWater', '').lower() == 'yes' else 0
    if preferences_doc:
        input_preferences = {
            'availabilityOfWater': availability_of_water,
            'regularPrice': preferences_doc.get('regularPrice', 0),
            'distanceFromSchool': preferences_doc.get('distanceFromSchool', 0),
            'apartmentType': preferences_doc.get('apartmentType', ''),
            'location': preferences_doc.get('location', ''),
            'roomType': preferences_doc.get('roomType', '')
        }
        recommended_properties = recommend_properties(input_preferences)
        return jsonify(recommended_properties)
    else:
        return jsonify({'error': 'Input preferences not found.'}), 404

if __name__ == '__main__':
    app.run(debug=True)

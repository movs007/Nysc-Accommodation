import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json
import bson

# Replace the placeholder with your Atlas connection string
uri = "mongodb+srv://muves218:idfZMHsuolF6WWMX@cluster0.1nv8pou.mongodb.net/cluster0?retryWrites=true&w=majority"

# Set the Stable API version when creating a new client
client = MongoClient(uri, server_api=ServerApi('1'))
                          
# Send a ping to confirm a successful connection
# try:
#     client.admin.command('ping')
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)
# Connect to MongoDB
# client = MongoClient("mongodb+srv://muves218:idfZMHsuolF6WWMX@cluster0.1nv8pou.mongodb.net/cluster0?retryWrites=true&w=majority")
db = client['cluster0']
collection = db['listings']
collection_2 = db['preferences']

# Fetch data from MongoDB
cursor = collection.find()
df = pd.DataFrame(list(cursor))
# print(df)

# for column in df.columns:
#     print(column)

# Assuming you have already loaded the dataset 'Rental_House_Data.csv'
# df = pd.read_csv("./Rental_House_Data.csv")

# Preprocessing
df.availabilityOfWater = (df.availabilityOfWater == 'yes')
df.availabilityOfWater.replace({True: 1, False: 0}, inplace=True)

columns_to_drop = ['createdAt', 'updatedAt','_id','name','description','state','university','discountPrice','furnished','parking','type','offer','imageUrls','userRef','__v']

# Create a copy of the DataFrame before dropping columns
df_copy = df.copy()

df.drop(columns=columns_to_drop, inplace=True)

# for column in df.columns:
#     print(column)

# Splitting data into numerical and categorical features
data_cat = df.select_dtypes(exclude=np.number)
data_num = df.select_dtypes(np.number)

# Standardize numerical features
ss = StandardScaler()
data_num_scaled = pd.DataFrame(ss.fit_transform(data_num), columns=data_num.columns)

# Concatenate scaled numerical features and categorical features
data_scaled = pd.concat([data_num_scaled, data_cat], axis=1)

# One-hot encode categorical features
data_encoded_scaled = pd.get_dummies(data_scaled, columns=['apartmentType', 'location', 'roomType'])

# Fit Nearest Neighbors model
model = NearestNeighbors(metric='cosine')
model.fit(data_encoded_scaled.dropna())  # Drop rows with missing values

# Function to recommend properties based on input preferences
def recommend_properties(input_preferences, model, data_encoded_scaled, original_df, columns_to_drop):
    # Transform input preferences to match the format of the dataset
    input_data = pd.DataFrame(input_preferences, index=[0])
    input_data_encoded = pd.get_dummies(input_data, columns=['apartmentType', 'location', 'roomType'])

    # Ensure input data has the same columns as the training data
    missing_cols = set(data_encoded_scaled.columns) - set(input_data_encoded.columns)
    for col in missing_cols:
        input_data_encoded[col] = 0
    
    # Reorder columns to match the order during model fit
    input_data_encoded = input_data_encoded[data_encoded_scaled.columns]

    # Standardize numerical features of input data
    input_data_scaled = pd.DataFrame(ss.transform(input_data_encoded[data_num.columns]), columns=data_num.columns)

    # Concatenate scaled numerical features and categorical features of input data
    input_data_scaled_encoded = pd.concat([input_data_scaled, input_data_encoded.drop(data_num.columns, axis=1)], axis=1)

    # Find nearest neighbors
    _, indices = model.kneighbors(input_data_scaled_encoded, n_neighbors=3)

    # Return recommended properties
    # return df.iloc[indices[0]]
    recommended_df = original_df.iloc[indices[0]].copy()
    for col in columns_to_drop:
        recommended_df[col] = original_df[col].iloc[indices[0]]
    
    # Convert ObjectId to string
    recommended_df['_id'] = recommended_df['_id'].apply(lambda x: str(x))
    recommended_df['createdAt'] = recommended_df['createdAt'].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S'))
    recommended_df['updatedAt'] = recommended_df['updatedAt'].apply(lambda x: x.strftime('%Y-%m-%d %H:%M:%S'))
    

    return recommended_df

    


# Example input preferences
input_preferences = {
    'availabilityOfWater': 1,    
    'regularPrice': 200000,
    'distanceFromSchool':5,
    'apartmentType': 'Bungalow',
    'location': 'bambere',
    'roomType': 'Self Contain'
}

# Get recommended properties
recommended_properties = recommend_properties(input_preferences, model, data_encoded_scaled, df_copy, columns_to_drop)

# Display recommended properties
print(json.dumps(recommended_properties.to_dict(orient='records')))

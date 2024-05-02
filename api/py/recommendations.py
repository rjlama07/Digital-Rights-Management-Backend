# recommendations.py

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_user_similarity(df):
    interactions = df[["likledSong", "artistFollowing", "searchHistory"]]  # Extract interaction columns
    interactions = interactions.fillna("")  # Fill NaN values with empty string
    interactions_str = interactions.apply(lambda x: " ".join(map(str, x)), axis=1)  # Combine interaction columns into one string
    # Calculate TF-IDF matrix
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(interactions_str)
    # Calculate cosine similarity
    similarity_matrix = cosine_similarity(tfidf_matrix)
    return similarity_matrix

def generate_recommendations(user_id, similarity_matrix, df):
    print("Generating recommendations for user with ID:", user_id)
    user_indices = df.index[df["_id"] == user_id].tolist()  # Find indices of the given user
    if not user_indices:
        return {"error": "User ID not found in the DataFrame."}

    user_index = user_indices[0]  # Get the first index (assuming there's only one user with the specified ID)
    similar_users = similarity_matrix[user_index]  # Get similarity scores of similar users
    # Sort similar users by similarity score (descending order) and get top similar users
    top_similar_users_indices = similar_users.argsort()[::-1][1:10]  # Exclude the user itself
    top_similar_users_ids = df.iloc[top_similar_users_indices]["_id"]  # Get IDs of top similar users

    # Placeholder for recommendations
    recommendations = {"songs": [], "artists": [], "albums": []}

    for similar_user_id in top_similar_users_ids:
        similar_user_data = df[df["_id"] == similar_user_id].iloc[0]  # Get data of similar user
        user_data = df[df["_id"] == user_id].iloc[0]  # Get data of given user

        # Find new song recommendations
        similar_user_liked_songs = similar_user_data["likledSong"]
        user_liked_songs = user_data["likledSong"]
        new_song_recommendations = [song for song in similar_user_liked_songs if song not in user_liked_songs]
        recommendations["songs"].extend(new_song_recommendations)

        # Find new artist recommendations
        similar_user_followed_artists = similar_user_data["artistFollowing"]
        user_followed_artists = user_data["artistFollowing"]
        new_artist_recommendations = [artist for artist in similar_user_followed_artists if artist not in user_followed_artists]
        recommendations["artists"].extend(new_artist_recommendations)

        # Find new album recommendations from search history
        similar_user_search_history = similar_user_data["searchHistory"]
        new_album_recommendations = []
        for search in similar_user_search_history:
            if search not in user_data["searchHistory"]:
                new_album_recommendations.append(search)
        recommendations["albums"].extend(new_album_recommendations)

    return recommendations


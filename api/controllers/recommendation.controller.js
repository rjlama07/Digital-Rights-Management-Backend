// app.js

const { PythonShell } = require("python-shell");

// Set the path to your Python script
const pythonScriptPath = "../py/recommendations.py";

// Example DataFrame (replace with your actual data)
const df = [
  {
    _id: 1,
    likledSong: ["song1", "song2"],
    artistFollowing: ["artist1", "artist2"],
    searchHistory: ["album1", "album2"],
  },
  {
    _id: 2,
    likledSong: ["song3", "song4"],
    artistFollowing: ["artist3", "artist4"],
    searchHistory: ["album3", "album4"],
  },
  // Add more data as needed
];

// User ID for which you want recommendations
const userId = 1;

// Options for PythonShell
const options = {
  mode: "json",
  pythonOptions: ["-u"], // get print results in real-time
  args: JSON.stringify(df),
};

// Call Python functions
PythonShell.run(pythonScriptPath, options, (err, results) => {
  if (err) throw err;
  // Extract recommendations for the user
  const userRecommendations = results.generate_recommendations(userId);
  console.log(userRecommendations);
});

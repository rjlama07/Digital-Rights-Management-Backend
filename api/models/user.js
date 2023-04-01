const mongoose = require("mongoose");

// mongose.connect(
//   "mongodb+srv://np03cs4s220363:S123456@cluster0.mrfhznh.mongodb.net/Shop?retryWrites=true&w=majority"
// );

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String,
});

userSchema.statics.isThisEmailInUse = async function (email) {
  try {
    const user = await this.findOne({ email: email });
    if (user) {
      return false;
    }

    return true;
  } catch (e) {
    console.log("Error inside isEmailInUseFunction", error.message);
    return false;
  }
};

module.exports = mongoose.model("user", userSchema);

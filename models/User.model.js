const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required.']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    },
    creations: [{
      type: Schema.Types.ObjectId,
      ref: "Recipe"
    }],
    favourites: [{
      type: Schema.Types.ObjectId,
      ref: "Recipe"
    }]
  }
);

const User = model("User", userSchema);

module.exports = User;

const { Schema, model } = require("mongoose");

const recipeSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      image: {
        type : 'String',
        default: 'http://res.cloudinary.com/dbhvhday2/image/upload/v1706109838/Recipe/xnbiiexpmuxseduff93z.jpg'
      },
      description: 'String',
      ingredients: {
        type: [Object],
        required: true,
      },
      instructions: {
        type: [Object],
        required: true,
      },
      category: {
        type: Object,
        default: {}
      },
      createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    }
    ,{
      timestamps: true
    }
  );
  
  
  const Recipe = model("Recipe", recipeSchema);
  
  module.exports = Recipe;
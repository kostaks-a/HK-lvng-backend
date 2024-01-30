const router = require("express").Router();
const { json } = require("express");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Recipe = require("../models/Recipe.model");
const cloudinary = require("../utils/cloudinary");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const cloudinaryOptions = {
  folder: "Recipe",
  resource_type: "image",
  allowed_formats: ["jpg", "png", "jpeg"],
  overwrite: true,
  transformation: [
    { width: 1000, crop: "scale" },
    { quality: "auto" },
    { fetch_format: "auto" },
  ],
};

// Get all recipes
router.get("/all", async (req, res, next) => {
  try {
    const recipes = await Recipe.find().populate('createdBy' , 'username');
    res.json(recipes);
  } catch (error) {
    console.log(error);
  }
});

// Get one recipe
router.get("/:id", async (req, res, next) => {
  //console.log(req.params.id);
  try {
    const recipe = await Recipe.findById(req.params.id);
    console.log(recipe);
    res.json(recipe);
  } catch (error) {
    console.log(error);
  }
});

// Add new recipe
router.post("/create", upload.single('file'), isAuthenticated, async (req, res, next) => {
  //console.log(req.file.path);
  const recipeData = JSON.parse(req.body.recipeData)
  console.log (req.payload)
  try {
    if (req.file) {
    const result = await cloudinary.uploader.upload(
      req.file.path,
      cloudinaryOptions
    );
    recipeData.image = result.url;
  }  
    const newRecipe = await Recipe.create({...recipeData , createdBy: req.payload._id});
    newRecipe.populate('createdBy' , 'username');
    res.status(200).json(newRecipe);
  } catch (error) {
    console.log(error);
  }
});

// Delete one recipe

router.get("/:id/delete", isAuthenticated, async (req, res, next) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "recipe deleted" });
  } catch (error) {
    console.log(error);
  }
});

// Edit one recipe
router.put("/:id/edit", upload.single('file'), isAuthenticated, async (req, res, next) => {
  const updatedRecipeData = JSON.parse(req.body.recipeData)
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        req.file.path,
        cloudinaryOptions
      );
      updatedRecipeData.image = result.url;
    }    
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updatedRecipeData,
      { new: true }
    );
    res.status(200).json({ message: "recipe updated", updatedRecipe });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

const router = require("express").Router();
const { json } = require("express");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");
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

// Get user's recipes
router.get("/personal", isAuthenticated, async (req, res, next) => {
  //console.log(req.payload._id);
  try {
    const recipes = await Recipe.find({ createdBy: req.payload._id }).populate('createdBy' , 'username');
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
    const user = await User.findById(req.payload._id);
    user.creations.push(newRecipe._id);
    await user.save();
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

// Save recipe to favourites
router.get("/:id/save", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload._id);
    if (!user.favourites.includes(req.params.id)) {
      user.favourites.push(req.params.id);
      await user.save();
      console.log (user.favourites)
      // user = await user.save({ new: true });
      res.status(200).json({ message: "recipe saved" , favourites: user.favourites});
    } else {
      res.status(400).json({ message: "recipe already saved" });
    }
  } catch (error) {
    console.log(error);
  }
});

//Remove recipe from favourites

router.get("/:recipeId/remove", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload._id);
    if (user.favourites.includes(req.params.recipeId)) {
      const index = user.favourites.indexOf(req.params.recipeId);
      user.favourites.splice(index, 1);
      await user.save();
      // user = await user.save({ new: true });
      console.log (user.favourites)
      res.status(200).json({ message: "recipe removed"  , favourites: user.favourites});
    } else {
      console.log (user.favourites)
      res.status(400).json({ message: "recipe is not saved" });
    }
  } catch (error) {
    console.log(error);
  }
});




// Get looged user's favourite recipes
router.get ("/favourites/all", isAuthenticated , async (req, res, next) => {
  try {
    const user = await User.findById(req.payload._id).populate('favourites');
    const recipes = await Recipe.find({ _id: { $in: user.favourites } }).populate('createdBy' , 'username');
    res.status(200).json(recipes);
  } catch (error) {
    console.log(error);
  }
})

// Get logged user's created recipes
router.get ("/creations/all", isAuthenticated , async (req, res, next) => {
  try {
    const user = await User.findById(req.payload._id);
    const recipes = await Recipe.find({ _id: { $in: user.creations } }).populate('createdBy' , 'username');
    res.status(200).json(recipes);
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;

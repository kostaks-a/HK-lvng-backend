
# HK lvng

## Description

HK lvng is a family-centric recipe management application designed to store and access cherished family recipes with ease. Developed out of the necessity to preserve and share culinary knowledge within a family, HK lvng offers a user-friendly platform for family members to create accounts, browse, save, and manage their favourite recipes all in one place.

## Features

- **User Accounts**: Securely create personal accounts to access the app's features.
- **Browse Recipes**: Explore a wide array of family recipes stored within the app's database.
- **Favourites**: Save your favourite recipes in your profile for quick access anytime.
- **Create and Edit Recipes**: Add new recipes to the database or make changes to existing ones, keeping the family culinary legacy alive and up-to-date.

## Upcoming Features

- **Measurement Conversion Tool**: A handy calculator to convert cooking measurement units, facilitating international recipes and making cooking more accessible to everyone in the family, regardless of their familiar measurement system.

## Technologies Used

- HTML5, CSS3, JavaScript
- React for the frontend
- Mantine library for the page styling and layout
- Node.js and Express for the backend
- MongoDB for the database
- Cloudinary for the image uploading

## Installation and Setup Instructions

Clone this repository. You will need `node` and `npm` installed globally on your machine.

Installation:

```bash
npm install
```

To Start Server:

```bash
npm run dev
```

To Visit App:

```bash
localhost:5173
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file. Replace the placeholder values with your actual data:

- `PORT=5005` - The port on which the server will run.
- `ORIGIN=http://localhost:5173` - The origin URL for allowing CORS (Cross-Origin Resource Sharing).
- `TOKEN_SECRET=your_secret_token` - A secret key for JWT (JSON Web Token) authentication.
- `CLOUD_NAME=your_cloud_name` - Your Cloudinary cloud name for storing media files.
- `CLOUD_API_KEY=your_cloudinary_api_key` - Your Cloudinary API key.
- `CLOUD_API_SECRET=your_cloudinary_api_secret` - Your Cloudinary API secret.
- `MONGODB_URI=mongodb://127.0.0.1:27017/backX` - The MongoDB connection string to connect to your database.

Please create a `.env` file in the root directory of your project and add the above variables. Ensure you replace the placeholder values with your actual data.


## Usage

After setting up the project, you can create an account to start exploring and managing family recipes. Upon sign up and sign in, you will be redirected to the profile Dashboard.  Use the app to keep your culinary heritage alive, share it with family members, and ensure it's passed down through generations.


## Contact Information

For further inquiries, you can reach us at [kostaks-a@gmail.com](mailto:kostaks-a@gmail.com) or file an issue on our GitHub repository.

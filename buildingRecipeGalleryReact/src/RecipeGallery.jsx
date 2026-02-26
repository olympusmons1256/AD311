import React from "react";
import "./RecipeGallery.css";
import spaghettiImage from "./assets/spaghetti-carbonara.jpg";
import chickenImage from "./assets/chicken-tikka-masala.jpg";
import avocadoImage from "./assets/avocado-toast.jpg";

const recipes = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    ingredients: ["Pasta", "Eggs", "Cheese", "Bacon"],
    image: spaghettiImage
  },
  {
    id: 2,
    title: "Chicken Tikka Masala",
    ingredients: ["Chicken", "Yogurt", "Spices", "Tomato Sauce"],
    image: chickenImage
  },
  {
    id: 3,
    title: "Avocado Toast",
    ingredients: ["Bread", "Avocado", "Salt", "Pepper"],
    image: avocadoImage 
  }
];

function RecipeGallery() {
  return (
    <div className="gallery">
      {recipes.map(recipe => (
        <div className="card" key={recipe.id}>
          <img src={recipe.image} alt={recipe.title} className="card-image" />
          <h2>{recipe.title}</h2>
          <ul>
            {recipe.ingredients.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default RecipeGallery;
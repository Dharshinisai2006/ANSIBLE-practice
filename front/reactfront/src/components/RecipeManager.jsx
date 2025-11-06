import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import config from "./config.js";

const RecipeBookManager = () => {
  const [recipes, setRecipes] = useState([]);
  const [recipe, setRecipe] = useState({
    recipeId: "",
    name: "",
    ingredients: "",
    instructions: "",
  });
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);

  const baseUrl = `${config.url}/recipeapi`;

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  const fetchAllRecipes = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setRecipes(res.data);
    } catch (err) {
      setMessage("Failed to fetch recipes.");
    }
  };

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (let key in recipe) {
      if (!recipe[key] || recipe[key].toString().trim() === "") {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const addRecipe = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${baseUrl}/add`, recipe);
      setMessage("Recipe added successfully!");
      fetchAllRecipes();
      resetForm();
    } catch (err) {
      setMessage("Error adding recipe.");
    }
  };

  const updateRecipe = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, recipe);
      setMessage("Recipe updated successfully!");
      fetchAllRecipes();
      resetForm();
    } catch (err) {
      setMessage("Error updating recipe.");
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage("Recipe deleted successfully!");
      fetchAllRecipes();
    } catch (err) {
      setMessage("Error deleting recipe.");
    }
  };

  const handleEdit = (r) => {
    setRecipe(r);
    setEditMode(true);
    setMessage(`Editing recipe with ID ${r.recipeId}`);
  };

  const resetForm = () => {
    setRecipe({
      recipeId: "",
      name: "",
      ingredients: "",
      instructions: "",
    });
    setEditMode(false);
  };

  return (
    <div className="app-container">
      <h1 className="title">Recipe Book Manager</h1>

      {message && <div className="toast">{message}</div>}

      {/* Recipe Form */}
      <div className="form-card">
        <h2 className="form-title">{editMode ? "Edit Recipe" : "Add Recipe"}</h2>
        <input
          type="text"
          name="recipeId"
          placeholder="Recipe ID"
          value={recipe.recipeId}
          onChange={handleChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Recipe Name"
          value={recipe.name}
          onChange={handleChange}
        />
        <textarea
          name="ingredients"
          placeholder="Ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
        />
        <textarea
          name="instructions"
          placeholder="Instructions"
          value={recipe.instructions}
          onChange={handleChange}
        />

        <div className="btn-group">
          {!editMode ? (
            <button className="btn-save" onClick={addRecipe}>
              Save Recipe
            </button>
          ) : (
            <>
              <button className="btn-green" onClick={updateRecipe}>
                Update Recipe
              </button>
              <button className="btn-gray" onClick={resetForm}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Recipes Table */}
      <div className="table-wrapper">
        <table className="recipe-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Ingredients</th>
              <th>Instructions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((r) => (
              <tr key={r.recipeId}>
                <td>{r.recipeId}</td>
                <td>{r.name}</td>
                <td>{r.ingredients}</td>
                <td>{r.instructions}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-green" onClick={() => handleEdit(r)}>
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => deleteRecipe(r.recipeId)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipeBookManager;

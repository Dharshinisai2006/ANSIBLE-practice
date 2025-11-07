import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/style.css";

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

  // Vite environment variable (import.meta.env)
  const baseUrl = `${import.meta.env.VITE_API_URL}/recipeapi`;

  // For fetch-by-id
  const [idToFetch, setIdToFetch] = useState("");
  const [fetchedRecipe, setFetchedRecipe] = useState(null);

  useEffect(() => {
    fetchAllRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllRecipes = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setRecipes(res.data || []);
    } catch (err) {
      console.error(err);
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
      console.error(err);
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
      console.error(err);
      setMessage("Error updating recipe.");
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage("Recipe deleted successfully!");
      fetchAllRecipes();
      // clear fetched recipe if it was the deleted one
      if (fetchedRecipe && fetchedRecipe.recipeId === id) setFetchedRecipe(null);
    } catch (err) {
      console.error(err);
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

  // Fetch by ID from backend
  const fetchRecipeById = async () => {
    if (!idToFetch || idToFetch.toString().trim() === "") {
      setMessage("Please enter an ID to fetch.");
      return;
    }
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedRecipe(res.data);
      setMessage("");
    } catch (err) {
      console.error(err);
      setFetchedRecipe(null);
      setMessage("Recipe not found.");
    }
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

      {/* Fetch-by-ID Section */}
      <div className="fetch-container">
        <h3>Find Recipe By ID</h3>
        <div className="fetch-input-group">
          <input
            type="number"
            value={idToFetch}
            onChange={(e) => setIdToFetch(e.target.value)}
            placeholder="Enter Recipe ID"
          />
          <button className="btn-find" onClick={fetchRecipeById}>
            Find Out
          </button>
        </div>

        {fetchedRecipe && (
          <div className="recipe-card" aria-live="polite">
            <h4>{fetchedRecipe.name}</h4>
            <p>
              <strong>Ingredients:</strong> {fetchedRecipe.ingredients}
            </p>
            <p>
              <strong>Instructions:</strong> {fetchedRecipe.instructions}
            </p>
            {fetchedRecipe.date && (
              <p>
                <strong>Date:</strong> {fetchedRecipe.date}
              </p>
            )}
          </div>
        )}
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
            {recipes.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "16px" }}>
                  No recipes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipeBookManager;

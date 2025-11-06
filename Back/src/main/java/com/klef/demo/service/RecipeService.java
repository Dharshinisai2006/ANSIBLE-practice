package com.klef.demo.service;

import java.util.List;
import com.klef.demo.entity.Recipe;

public interface RecipeService {

    Recipe addRecipe(Recipe recipe);
    List<Recipe> getAllRecipes();
    Recipe getRecipeById(int id);
    Recipe updateRecipe(Recipe recipe);
    void deleteRecipeById(int id);
}

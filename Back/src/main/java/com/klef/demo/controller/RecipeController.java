package com.klef.demo.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.klef.demo.entity.Recipe;
import com.klef.demo.service.RecipeService;

@RestController
@RequestMapping("/recipeapi")
@CrossOrigin(origins = "*")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    // Home endpoint
    @GetMapping("/")
    public String home() {
        return "Recipe Book API";
    }

    // Add a new recipe
    @PostMapping("/add")
    public ResponseEntity<?> addRecipe(@RequestBody Recipe recipe) {
        try {
            Recipe savedRecipe = recipeService.addRecipe(recipe);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRecipe);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding recipe: " + e.getMessage());
        }
    }

    // Get all recipes
    @GetMapping("/all")
    public ResponseEntity<?> getAllRecipes() {
        try {
            List<Recipe> recipes = recipeService.getAllRecipes();
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching recipes: " + e.getMessage());
        }
    }

    // Get recipe by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable int id) {
        Recipe recipe = recipeService.getRecipeById(id);
        if (recipe != null) {
            return ResponseEntity.ok(recipe);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Recipe with ID " + id + " not found.");
        }
    }

    // Update recipe
    @PutMapping("/update")
    public ResponseEntity<?> updateRecipe(@RequestBody Recipe recipe) {
        Recipe existing = recipeService.getRecipeById(recipe.getRecipeId());
        if (existing != null) {
            Recipe updatedRecipe = recipeService.updateRecipe(recipe);
            return ResponseEntity.ok(updatedRecipe);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Cannot update. Recipe with ID " + recipe.getRecipeId() + " not found.");
        }
    }

    // Delete recipe by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable int id) {
        Recipe existing = recipeService.getRecipeById(id);
        if (existing != null) {
            recipeService.deleteRecipeById(id);
            return ResponseEntity.ok("Recipe with ID " + id + " deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Cannot delete. Recipe with ID " + id + " not found.");
        }
    }

}

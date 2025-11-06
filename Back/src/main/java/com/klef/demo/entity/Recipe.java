package com.klef.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "recipe_table")
public class Recipe {

    @Id
    @Column(name = "recipe_id")
    private int recipeId;

    @Column(name = "recipe_name", nullable = false, length = 100)
    private String name;

    @Column(name = "ingredients", nullable = false, length = 500)
    private String ingredients;

    @Column(name = "instructions", nullable = false, length = 1000)
    private String instructions;


    // Getters and Setters
    public int getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(int recipeId) {
        this.recipeId = recipeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

   

    @Override
    public String toString() {
        return "Recipe [recipeId=" + recipeId + ", name=" + name + ", ingredients=" + ingredients
                + ", instructions=" + instructions + "]";
    }
}

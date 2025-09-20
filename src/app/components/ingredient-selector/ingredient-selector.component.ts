import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ingredient } from '../../models/recipe.interface';

@Component({
  selector: 'app-ingredient-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="ingredient-selector">
      <header class="ingredient-selector__header">
        <h2 class="ingredient-selector__title">¿Qué ingredientes tienes?</h2>
        <p class="ingredient-selector__subtitle">
          Selecciona entre 2 y 5 ingredientes para encontrar recetas
        </p>
      </header>
      
      <div class="ingredient-selector__grid">
        <button 
          *ngFor="let ingredient of availableIngredients"
          class="ingredient-selector__item"
          [class.ingredient-selector__item--selected]="isSelected(ingredient.id)"
          (click)="toggleIngredient(ingredient)"
          type="button"
        >
          <span class="ingredient-selector__emoji">{{ ingredient.emoji }}</span>
          <div class="ingredient-selector__name">{{ ingredient.name }}</div>
          <div class="ingredient-selector__calories">{{ ingredient.caloriesPer100g }} kcal/100g</div>
        </button>
      </div>

      <div class="ingredient-selector__counter">
        <span class="ingredient-selector__count">
          Ingredientes seleccionados: {{ selectedIngredients.length }}/5
        </span>
        <span *ngIf="selectedIngredients.length < 2" class="ingredient-selector__warning">
          (Mínimo 2 ingredientes)
        </span>
      </div>

      <button 
        class="ingredient-selector__search-btn"
        [disabled]="selectedIngredients.length < 2"
        (click)="onSearchRecipes()"
        type="button"
      >
        Buscar Recetas ({{ selectedIngredients.length }})
      </button>
    </section>
  `,
  styleUrls: ['./ingredient-selector.component.scss']
})
export class IngredientSelectorComponent {
  availableIngredients: Ingredient[] = [
    { id: '1', name: 'Pollo', emoji: '🐔', caloriesPer100g: 165 },
    { id: '2', name: 'Tomate', emoji: '🍅', caloriesPer100g: 18 },
    { id: '3', name: 'Cebolla', emoji: '🧅', caloriesPer100g: 40 },
    { id: '4', name: 'Arroz', emoji: '🍚', caloriesPer100g: 130 },
    { id: '5', name: 'Huevo', emoji: '🥚', caloriesPer100g: 155 },
    { id: '6', name: 'Queso', emoji: '🧀', caloriesPer100g: 113 },
    { id: '7', name: 'Papa', emoji: '🥔', caloriesPer100g: 77 },
    { id: '8', name: 'Zanahoria', emoji: '🥕', caloriesPer100g: 41 },
    { id: '9', name: 'Pasta', emoji: '🍝', caloriesPer100g: 220 },
    { id: '10', name: 'Pescado', emoji: '🐟', caloriesPer100g: 206 },
    { id: '11', name: 'Aguacate', emoji: '🥑', caloriesPer100g: 160 },
    { id: '12', name: 'Espinaca', emoji: '🥬', caloriesPer100g: 23 }
  ];

  selectedIngredients: Ingredient[] = [];

  isSelected(ingredientId: string): boolean {
    return this.selectedIngredients.some(ing => ing.id === ingredientId);
  }

  toggleIngredient(ingredient: Ingredient): void {
    const index = this.selectedIngredients.findIndex(ing => ing.id === ingredient.id);
    
    if (index >= 0) {
      this.selectedIngredients.splice(index, 1);
    } else if (this.selectedIngredients.length < 5) {
      this.selectedIngredients.push(ingredient);
    }
  }

  onSearchRecipes(): void {
    if (this.selectedIngredients.length >= 2) {
      // Emitir evento al componente padre
      window.dispatchEvent(new CustomEvent('ingredientsSelected', {
        detail: this.selectedIngredients
      }));
    }
  }
}
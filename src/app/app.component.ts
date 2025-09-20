import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientSelectorComponent } from './components/ingredient-selector/ingredient-selector.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { FirebaseService } from './services/firebase.service';
import { ShoppingService } from './services/shopping.service';
import { Recipe, Ingredient } from './models/recipe.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IngredientSelectorComponent, ShoppingListComponent],
  template: `
    <div class="app">
      <!-- Header -->
      <header class="app__header">
        <h1 class="app__title">🍳 Recetario por Ingredientes</h1>
        <p class="app__subtitle">Selecciona ingredientes y descubre recetas deliciosas</p>
      </header>

      <!-- Selector de Ingredientes -->
      <app-ingredient-selector></app-ingredient-selector>

      <!-- Resultados -->
      <section class="app__results" *ngIf="showResults">
        <div class="results__header">
          <h2 class="results__title">Recetas Encontradas ({{ filteredRecipes.length }})</h2>
        </div>

        <!-- Gráfico de Calorías -->
        <div class="chart" *ngIf="selectedIngredients.length > 0">
          <h3 class="chart__title">📊 Calorías por Ingrediente (por 100g)</h3>
          <div class="chart__container">
            <div 
              *ngFor="let ingredient of selectedIngredients" 
              class="chart__bar"
            >
              <div 
                class="chart__bar-fill" 
                [style.height.px]="getBarHeight(ingredient.caloriesPer100g)"
              >
                <span class="chart__bar-value">{{ ingredient.caloriesPer100g }}</span>
              </div>
              <div class="chart__bar-label">{{ ingredient.name }}</div>
            </div>
          </div>
        </div>

        <!-- Grid de Recetas -->
        <div class="recipes">
          <div class="recipes__grid">
            <div 
              *ngFor="let recipe of filteredRecipes"
              class="recipe-card"
              (click)="selectRecipe(recipe)"
            >
              <div class="recipe-card__image">🍽️</div>
              <div class="recipe-card__content">
                <button 
                  class="recipe-card__favorite"
                  [class.recipe-card__favorite--active]="isFavorite(recipe.id)"
                  (click)="toggleFavorite(recipe, $event)"
                  type="button"
                >
                  {{ isFavorite(recipe.id) ? '❤️' : '🤍' }}
                </button>
                <h3 class="recipe-card__title">{{ recipe.title }}</h3>
                <div class="recipe-card__info">
                  <span class="recipe-card__calories">{{ recipe.calories }} kcal</span>
                  <span class="recipe-card__time">⏱️ {{ recipe.cookingTime }} min</span>
                </div>
                <div class="recipe-card__ingredients">
                  Ingredientes: {{ recipe.ingredients.join(', ') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Modal de Receta -->
      <div class="modal" *ngIf="selectedRecipe" (click)="closeRecipeDetail()">
        <div class="modal__content" (click)="$event.stopPropagation()">
          <div class="modal__header">
            <h2 class="modal__title">{{ selectedRecipe.title }}</h2>
            <button class="modal__close" (click)="closeRecipeDetail()" type="button">×</button>
          </div>
          <div class="modal__body">
            <div class="modal__details">
              <p><strong>Calorías:</strong> {{ selectedRecipe.calories }} kcal</p>
              <p><strong>Tiempo:</strong> {{ selectedRecipe.cookingTime }} minutos</p>
              <p><strong>Ingredientes:</strong> {{ selectedRecipe.ingredients.join(', ') }}</p>
            </div>
            <div class="modal__instructions">
              <h3>Instrucciones:</h3>
              <ol>
                <li *ngFor="let step of selectedRecipe.instructions">{{ step }}</li>
              </ol>
            </div>
            <button 
              class="modal__shopping-btn"
              (click)="addToShoppingList(selectedRecipe)"
              type="button"
            >
              🛒 Agregar a Lista de Compras
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de Compras -->
      <app-shopping-list></app-shopping-list>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  selectedIngredients: Ingredient[] = [];
  filteredRecipes: Recipe[] = [];
  selectedRecipe: Recipe | null = null;
  showResults = false;
  
  private destroy$ = new Subject<void>();

  // Base de datos local de recetas
  allRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Pollo con Arroz',
      ingredients: ['Pollo', 'Arroz', 'Cebolla'],
      calories: 320,
      cookingTime: 30,
      instructions: [
        'Cortar el pollo en trozos pequeños',
        'Sofreír la cebolla hasta dorar',
        'Agregar el pollo y cocinar 10 minutos',
        'Añadir el arroz y agua, cocinar 20 minutos'
      ]
    },
    {
      id: '2',
      title: 'Tortilla de Papa',
      ingredients: ['Huevo', 'Papa', 'Cebolla'],
      calories: 280,
      cookingTime: 25,
      instructions: [
        'Pelar y cortar las papas en rodajas',
        'Freír las papas con cebolla',
        'Batir los huevos y mezclar con papas',
        'Cocinar en sartén hasta cuajar'
      ]
    },
    {
      id: '3',
      title: 'Ensalada de Pollo',
      ingredients: ['Pollo', 'Tomate', 'Aguacate'],
      calories: 250,
      cookingTime: 15,
      instructions: [
        'Cocinar el pollo a la plancha',
        'Cortar tomates y aguacate',
        'Mezclar todos los ingredientes',
        'Aliñar con aceite y limón'
      ]
    },
    {
      id: '4',
      title: 'Pasta con Queso',
      ingredients: ['Pasta', 'Queso', 'Tomate'],
      calories: 380,
      cookingTime: 20,
      instructions: [
        'Hervir la pasta según instrucciones',
        'Derretir el queso en sartén',
        'Agregar tomate picado',
        'Mezclar con la pasta caliente'
      ]
    },
    {
      id: '5',
      title: 'Pescado con Vegetales',
      ingredients: ['Pescado', 'Zanahoria', 'Espinaca'],
      calories: 290,
      cookingTime: 35,
      instructions: [
        'Cocinar el pescado al horno',
        'Saltear zanahorias en sartén',
        'Agregar espinacas al final',
        'Servir junto al pescado'
      ]
    }
  ];

  constructor(
    private firebaseService: FirebaseService,
    private shoppingService: ShoppingService
  ) {}

  ngOnInit(): void {
    // Escuchar evento de ingredientes seleccionados
    window.addEventListener('ingredientsSelected', (event: any) => {
      this.selectedIngredients = event.detail;
      this.searchRecipes();
    });

    this.firebaseService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchRecipes(): void {
    if (this.selectedIngredients.length < 2) return;

    const selectedNames = this.selectedIngredients.map(ing => ing.name);
    
    this.filteredRecipes = this.allRecipes.filter(recipe => {
      const matchCount = recipe.ingredients.filter(ingredient => 
        selectedNames.includes(ingredient)
      ).length;
      return matchCount >= 1;
    });

    this.showResults = true;
  }

  getBarHeight(calories: number): number {
    const maxCalories = Math.max(...this.selectedIngredients.map(ing => ing.caloriesPer100g));
    return Math.max(20, (calories / maxCalories) * 150);
  }

  selectRecipe(recipe: Recipe): void {
    this.selectedRecipe = recipe;
  }

  closeRecipeDetail(): void {
    this.selectedRecipe = null;
  }

  toggleFavorite(recipe: Recipe, event: Event): void {
    event.stopPropagation();
    if (this.isFavorite(recipe.id)) {
      this.firebaseService.removeFromFavorites(recipe.id);
    } else {
      this.firebaseService.addToFavorites(recipe.id);
    }
  }

  isFavorite(recipeId: string): boolean {
    return this.firebaseService.isFavorite(recipeId);
  }

  addToShoppingList(recipe: Recipe): void {
    recipe.ingredients.forEach(ingredient => {
      this.shoppingService.addItem(ingredient);
    });
    this.closeRecipeDetail();
  }
}
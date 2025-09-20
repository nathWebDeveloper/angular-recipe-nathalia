import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingService } from '../../services/shopping.service';
import { ShoppingItem } from '../../models/recipe.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="shopping-list">
      <header class="shopping-list__header">
        <h3 class="shopping-list__title">🛒 Mi Lista de Compras</h3>
        <span class="shopping-list__counter">{{ getTotalItems() }} productos</span>
      </header>

      <div class="shopping-list__add-form">
        <div class="shopping-list__input-group">
          <input 
            type="text"
            class="shopping-list__input"
            placeholder="Agregar producto..."
            [(ngModel)]="newItemName"
            (keyup.enter)="addItem()"
          >
          <input 
            type="number"
            class="shopping-list__quantity"
            min="1"
            [(ngModel)]="newItemQuantity"
            placeholder="1"
          >
          <select class="shopping-list__unit" [(ngModel)]="newItemUnit">
            <option value="unidad">unidad</option>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="litro">litro</option>
            <option value="ml">ml</option>
            <option value="paquete">paquete</option>
          </select>
          <button 
            class="shopping-list__add-btn"
            (click)="addItem()"
            [disabled]="!newItemName.trim()"
          >
            Agregar
          </button>
        </div>
      </div>

      <div class="shopping-list__items" *ngIf="shoppingItems.length > 0">
        <div 
          *ngFor="let item of shoppingItems"
          class="shopping-list__item"
          [class.shopping-list__item--completed]="item.completed"
        >
          <div class="shopping-list__item-main">
            <input 
              type="checkbox"
              class="shopping-list__checkbox"
              [checked]="item.completed"
              (change)="toggleCompleted(item.id)"
            >
            
            <div class="shopping-list__item-content" *ngIf="!item.editing">
              <span class="shopping-list__item-name">{{ item.name }}</span>
              <span class="shopping-list__item-quantity">{{ item.quantity }} {{ item.unit }}</span>
            </div>

            <div class="shopping-list__item-edit" *ngIf="item.editing">
              <input 
                type="text"
                class="shopping-list__edit-input"
                [(ngModel)]="item.name"
                (keyup.enter)="saveEdit(item)"
                (keyup.escape)="cancelEdit(item)"
              >
              <input 
                type="number"
                class="shopping-list__edit-quantity"
                min="1"
                [(ngModel)]="item.quantity"
              >
              <select class="shopping-list__edit-unit" [(ngModel)]="item.unit">
                <option value="unidad">unidad</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="litro">litro</option>
                <option value="ml">ml</option>
                <option value="paquete">paquete</option>
              </select>
            </div>
          </div>

          <div class="shopping-list__item-actions">
            <button 
              *ngIf="!item.editing"
              class="shopping-list__edit-btn"
              (click)="startEdit(item)"
              title="Editar"
            >
              ✏️
            </button>
            <button 
              *ngIf="item.editing"
              class="shopping-list__save-btn"
              (click)="saveEdit(item)"
              title="Guardar"
            >
              ✅
            </button>
            <button 
              *ngIf="item.editing"
              class="shopping-list__cancel-btn"
              (click)="cancelEdit(item)"
              title="Cancelar"
            >
              ❌
            </button>
            <button 
              class="shopping-list__delete-btn"
              (click)="removeItem(item.id)"
              title="Eliminar"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div class="shopping-list__empty" *ngIf="shoppingItems.length === 0">
        <p>Tu lista de compras está vacía</p>
      </div>

      <div class="shopping-list__actions" *ngIf="shoppingItems.length > 0">
        <button 
          class="shopping-list__action-btn shopping-list__action-btn--warning"
          (click)="clearCompleted()"
          *ngIf="getCompletedCount() > 0"
        >
          Limpiar Completados ({{ getCompletedCount() }})
        </button>
        <button 
          class="shopping-list__action-btn shopping-list__action-btn--danger"
          (click)="clearAll()"
        >
          Vaciar Lista
        </button>
        <button 
          class="shopping-list__action-btn shopping-list__action-btn--primary"
          (click)="exportList()"
        >
          Exportar Lista
        </button>
      </div>
    </section>
  `,
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  shoppingItems: ShoppingItem[] = [];
  newItemName = '';
  newItemQuantity = 1;
  newItemUnit = 'unidad';
  
  private destroy$ = new Subject<void>();
  private originalItems = new Map<string, ShoppingItem>();

  constructor(private shoppingService: ShoppingService) {}

  ngOnInit(): void {
    this.shoppingService.shoppingItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.shoppingItems = items.map(item => ({ ...item, editing: false }));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addItem(): void {
    if (this.newItemName.trim()) {
      this.shoppingService.addItem(
        this.newItemName.trim(),
        this.newItemQuantity,
        this.newItemUnit
      );
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.newItemName = '';
    this.newItemQuantity = 1;
    this.newItemUnit = 'unidad';
  }

  toggleCompleted(id: string): void {
    this.shoppingService.toggleCompleted(id);
  }

  startEdit(item: ShoppingItem & { editing?: boolean }): void {
    this.originalItems.set(item.id, { ...item });
    item.editing = true;
  }

  saveEdit(item: ShoppingItem & { editing?: boolean }): void {
    this.shoppingService.updateItem(item.id, {
      name: item.name,
      quantity: item.quantity,
      unit: item.unit
    });
    item.editing = false;
    this.originalItems.delete(item.id);
  }

  cancelEdit(item: ShoppingItem & { editing?: boolean }): void {
    const original = this.originalItems.get(item.id);
    if (original) {
      Object.assign(item, original);
      this.originalItems.delete(item.id);
    }
    item.editing = false;
  }

  removeItem(id: string): void {
    if (confirm('¿Eliminar este producto de la lista?')) {
      this.shoppingService.removeItem(id);
    }
  }

  clearCompleted(): void {
    if (confirm('¿Eliminar todos los productos completados?')) {
      this.shoppingService.clearCompleted();
    }
  }

  clearAll(): void {
    if (confirm('¿Vaciar toda la lista de compras?')) {
      this.shoppingService.clearAll();
    }
  }

  exportList(): void {
    const listText = this.shoppingService.exportList();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Mi Lista de Compras:\n\n${listText}`)
        .then(() => alert('Lista copiada al portapapeles'))
        .catch(() => this.fallbackCopy(listText));
    } else {
      this.fallbackCopy(listText);
    }
  }

  private fallbackCopy(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = `Mi Lista de Compras:\n\n${text}`;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Lista copiada al portapapeles');
  }

  getTotalItems(): number {
    return this.shoppingItems.length;
  }

  getCompletedCount(): number {
    return this.shoppingItems.filter(item => item.completed).length;
  }
}
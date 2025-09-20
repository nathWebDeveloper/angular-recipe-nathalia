import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private favoritesSubject = new BehaviorSubject<string[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private firestore: Firestore) {
    this.loadFavorites();
  }

  private async loadFavorites(): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'favorites', 'user-favorites');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.favoritesSubject.next(data['recipeIds'] || []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  async addToFavorites(recipeId: string): Promise<void> {
    try {
      const currentFavorites = this.favoritesSubject.value;
      if (!currentFavorites.includes(recipeId)) {
        const newFavorites = [...currentFavorites, recipeId];
        await this.saveFavorites(newFavorites);
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }

  async removeFromFavorites(recipeId: string): Promise<void> {
    try {
      const currentFavorites = this.favoritesSubject.value;
      const newFavorites = currentFavorites.filter(id => id !== recipeId);
      await this.saveFavorites(newFavorites);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  private async saveFavorites(favoriteIds: string[]): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'favorites', 'user-favorites');
      await setDoc(docRef, { recipeIds: favoriteIds });
      this.favoritesSubject.next(favoriteIds);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  isFavorite(recipeId: string): boolean {
    return this.favoritesSubject.value.includes(recipeId);
  }
}
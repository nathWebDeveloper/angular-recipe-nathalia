import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  // Tus credenciales de Firebase aquí
  apiKey: "AIzaSyDsKoi1F9TntDtbijW8dKljumshWWrW-nU",
  authDomain: "angular-recipe-app-e965b.firebaseapp.com",
  projectId: "angular-recipe-app-e965b",
  storageBucket: "angular-recipe-app-e965b.firebasestorage.app",
  messagingSenderId: "309609377256",
  appId: "1:309609377256:web:a830a86b743d039e32885d"
};

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())
  ]
}).catch(err => console.error(err));
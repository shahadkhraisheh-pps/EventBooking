import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, AuthProvider, authState, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut, updateProfile, User } from '@angular/fire/auth';
import { addDoc, collection, doc, Firestore, setDoc } from '@angular/fire/firestore/lite';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore=inject(Firestore);

  constructor() { }
  currentUser = toSignal(authState(this.auth), { initialValue: undefined });
  
  isLoggedIn = computed(() => this.currentUser() !== null && this.currentUser() !== undefined);

  getCurrentUser(): Observable<User | null> {
    return authState(this.auth);
  }

  signUpWithEmailAndPassword(displayName: string, email: string, password: string): Promise<any> {
  return createUserWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Update the Auth profile display name
      return updateProfile(user, { displayName: displayName })
        .then(() => {
          // Create a specific document reference using the user's Auth UID
          const userDocRef = doc(this.firestore, `users/${user.uid}`);

          // Use setDoc to save user metadata in Firestore
          return setDoc(userDocRef, {
            uid: user.uid,
            displayName: displayName,
            email: email,
            createdAt: new Date().toISOString(),
          });
        });
    });
  }
  
  loginWithEmailAndPassword(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }


 
  
loginWithGoogle(): Promise<any> {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(this.auth, provider);
}
  logout(): Promise<void> {
    return signOut(this.auth);
  }
}

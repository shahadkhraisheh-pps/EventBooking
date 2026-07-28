import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, AuthProvider, authState, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signOut, User } from '@angular/fire/auth';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private http = inject(HttpClient);

  constructor() { }
  currentUser = toSignal(authState(this.auth), { initialValue: undefined });
  
  isLoggedIn = computed(() => this.currentUser() !== null && this.currentUser() !== undefined);
authResolved = computed(() => this.currentUser() !== undefined);
  getCurrentUser(): Observable<User | null> {
    return authState(this.auth);
  }

  signUpWithEmailAndPassword(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
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

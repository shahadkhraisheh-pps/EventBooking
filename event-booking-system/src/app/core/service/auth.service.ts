import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, AuthProvider, authState, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithRedirect, signOut, User } from '@angular/fire/auth';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
   // Inject the modern Auth instance and HttpClient using the inject() function
  private auth = inject(Auth);
  private http = inject(HttpClient);

  constructor() { }
  
  getCurrentUser(): Observable<User | null> {
    return authState(this.auth);
  }

  signUpWithEmailAndPassword(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  loginWithEmailAndPassword(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signInWithProvider(provider: AuthProvider): Promise<void> {
    return signInWithRedirect(this.auth, provider);
  }

  signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    return this.signInWithProvider(provider);
  }

  loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    return this.signInWithProvider(provider);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }
}

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
  //get the current user from the authstate and convert it to signal 
  currentUser = toSignal(authState(this.auth), { initialValue: undefined });
  //see if the user is logged in 
  isLoggedIn = computed(() => this.currentUser() !== null && this.currentUser() !== undefined);

  //get the current user 
  getCurrentUser(): Observable<User | null> {
    return authState(this.auth);
  }

//sign up with name and email and password
  signUpWithEmailAndPassword(displayName: string, email: string, password: string): Promise<any> {
  return createUserWithEmailAndPassword(this.auth, email, password) //use the auth method that firebase provide
    .then((userCredential) => {
      const user = userCredential.user;
      
      // update the auth profile display name
      return updateProfile(user, { displayName: displayName })
        .then(() => {
          // create a specific document reference using the user's auth uid
          const userDocRef = doc(this.firestore, `users/${user.uid}`);

          // use setDoc to save user metadata in firestore
          return setDoc(userDocRef, {
            uid: user.uid,
            displayName: displayName,
            email: email,
            createdAt: new Date().toISOString(),
          });
        });
    });
  }
  
  async loginWithEmailAndPassword(email: string, password: string): Promise<any> {
  try{
 return signInWithEmailAndPassword(this.auth, email, password); //login in with auth proived method
  } catch(error:any){
    throw this.handelEroor(error)
  };
  
  }

private handelEroor(error:any):string{
 switch (error.code) {
      case 'auth/invalid-credential':
        return 'The email or password you entered is incorrect.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address format.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Contact support.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. This account is temporarily locked.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'An unexpected authentication error occurred. Please try again.';
      }
}

 
  
loginWithGoogle(): Promise<any> {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(this.auth, provider) .then((userCredential) => {
      const user = userCredential.user;
      
      // update the auth profile display name
      return updateProfile(user, { displayName: user.displayName })
        .then(() => {
          // create a specific document reference using the user's audth ui
          const userDocRef = doc(this.firestore, `users/${user.uid}`);

          // use setDoc to save user metadata in firestore
          return setDoc(userDocRef, {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            createdAt: new Date().toISOString(),
          });
        });
    });
}
  logout(): Promise<void> {
    return signOut(this.auth); //logout the user
  }
}

import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivateFn } from '@angular/router';

export const authGuardGuard: CanActivateFn = async (route, state) => {
const angularFireAuth = inject(AngularFireAuth);
  const user = await angularFireAuth.currentUser;

  const isLoggedIn = !!user;
  return isLoggedIn;};

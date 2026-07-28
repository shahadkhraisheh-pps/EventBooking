import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivateFn, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
import { take } from 'rxjs/internal/operators/take';
import { AuthService } from '../service/auth.service';

export const authGuardGuard: CanActivateFn = () => {
 const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.currentUser).pipe(
    filter(user => user !== undefined), 
    take(1),
        map(user => {
      if (user) return true;
      router.navigate(['/login']);
      return false;
    })
  );
};
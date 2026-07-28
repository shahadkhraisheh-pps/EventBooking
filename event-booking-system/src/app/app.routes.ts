import { Routes } from '@angular/router';
import { authGuardGuard } from './core/guard/auth.guard-guard';

export const routes: Routes = [
{path: '', loadComponent: () => import('./feature/events/event-list/event-list').then(m => m.EventList)},
{path:'login', loadComponent: () => import('./feature/users/login/login').then(m => m.Login)},
{path:'signup', loadComponent: () => import('./feature/users/signup/signup').then(m => m.Signup)},
{path:'bookings', loadComponent: () => import('./feature/booking/booking-list/booking-list').then(m => m.BookingList), canActivate: [authGuardGuard]},
{path:'events', loadComponent: () => import('./feature/events/event-list/event-list').then(m => m.EventList)},
];

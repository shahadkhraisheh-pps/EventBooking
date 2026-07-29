import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
 private authService=inject(AuthService);
 private route=inject(Router)

isLoggedIn = this.authService.isLoggedIn;


  logout() {
    this.authService.logout();
    this.route.navigate(['/events']);
  }
}

import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
 private authService=inject(AuthService);


    isLoggedIn = this.authService.isLoggedIn;


  logout() {
    this.authService.logout();
  }
}

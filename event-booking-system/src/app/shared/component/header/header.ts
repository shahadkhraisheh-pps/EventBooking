import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../core/service/auth.service';
import {MatIconModule} from '@angular/material/icon'


@Component({
  selector: 'app-header',
  imports: [RouterLink,MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
 private authService=inject(AuthService);
 private route=inject(Router);
 currentUser=this.authService.currentUser;

  isLoggedIn = this.authService.isLoggedIn;

//logout user that from auth service
  logout() {
    this.authService.logout();
    this.route.navigate(['/events']);
  }
}

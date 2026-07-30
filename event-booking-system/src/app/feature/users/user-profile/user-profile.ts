import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-user-profile',
  imports: [MatIconModule, RouterLink],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
private userService=inject(AuthService);
curentUser=this.userService.currentUser();
}

import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login   {
isLoading=signal(false);
error:string='';
constructor(private authService: AuthService,private router: Router) { }
loginForm:FormGroup=new FormGroup({
     email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/[0-9a-zA-Z]{6,}/)
    ])
  }) 

  loginWithEmailAndPassword():void{
const email=this.loginForm.value?.email;
const password=this.loginForm.value?.password;
this.authService.loginWithEmailAndPassword(email,password).then(
  (user) => {
    this.router.navigate(['/events']);
  }
).catch((error) => {
  alert('Error logging in:'+error);
  this.error = 'An error occurred during login. Please try again.';
});
  }

loginWithGoogle(){
this.authService.loginWithGoogle().then(
  (user) => {
    this.router.navigate(['/events']);
  }
).catch((error) => {
  alert('Error logging in with Google:'+error);
  this.error = 'An error occurred during login with Google. Please try again.'; 
});
  }
}

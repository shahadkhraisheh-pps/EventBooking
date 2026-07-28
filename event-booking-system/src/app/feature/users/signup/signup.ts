import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
isLoginMode=true;
isLoading=signal(false);
error:string='';
constructor(private authService: AuthService,private router:Router) { }
signupForm:FormGroup=new FormGroup({
  username: new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.pattern(/^[a-zA-Z0-9]+$/)
  ]),
     email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/[0-9a-zA-Z]{6,}/)
    ])})

ngOnInit(): void {
}

signUpWithEmailAndPassword(){
  const email=this.signupForm.value?.email;
  const password=this.signupForm.value?.password;
  const username=this.signupForm.value?.username;
  this.authService.signUpWithEmailAndPassword(username, email, password).then(
    (user) => {
      this.router.navigate(['/events']);
    }
  ).catch((error) => {
    alert('Error signing up:'+error);
    this.error = 'An error occurred during signup. Please try again.';
  });
}
  signUpWithGoogle():void{
    this.authService.loginWithGoogle().then(
      (user) => {
        this.router.navigate(['/events']);
      }
    ).catch((error) => {
      alert('Error signing up with Google:'+error);
      this.error = 'An error occurred during signup with Google. Please try again.';
    });
  }
}
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, LoadingSpinner],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
//for the loading spinner
isLoading=signal(false);
//for the error massage
error:string='';

constructor(private authService: AuthService,private router:Router) { }
//signup form
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
//signup method that with email and password form the auth service 
signUpWithEmailAndPassword(){
  
  //take the data form the signup input
  const email=this.signupForm.value?.email;
  const password=this.signupForm.value?.password;
  const username=this.signupForm.value?.username;

 //while login process work the loading spinner      
  this.isLoading.set(true);
//call the method from the service
  this.authService.signUpWithEmailAndPassword(username, email, password).then(
    (user) => {
      this.router.navigate(['/events']);  //if all good take you the event page 
    this.isLoading.set(false);
      
    }
  ).catch((error) => {
    alert('Error signing up:'+error);
    this.error = 'An error occurred during signup. Please try again.';//if not show error massage
     this.isLoading.set(true);

  });
}
//signup with google provider
  signUpWithGoogle():void{
        this.isLoading.set(false);

    this.authService.loginWithGoogle().then(
      (user) => {
        this.router.navigate(['/events']);
         this.isLoading.set(true);

      }
    ).catch((error) => {
      alert('Error signing up with Google:'+error);
      this.error = 'An error occurred during signup with Google. Please try again.';
          this.isLoading.set(true);

    });
  }
}
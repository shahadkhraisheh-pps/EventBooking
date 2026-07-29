import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, LoadingSpinner],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login   {
//for the loading spinner
isLoading=signal(false);
//for the error massage
error:string='';

constructor(private authService: AuthService,private router: Router) { }
//login form 
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
//login method that with email and password form the auth service 
  loginWithEmailAndPassword():void{
    //take the data form the login input
    const email=this.loginForm.value?.email; 
    const password=this.loginForm.value?.password;
    this.isLoading.set(true);  //while login process work the loading spinner work
    this.authService.loginWithEmailAndPassword(email,password).then( //call the method from the service
    (user) => {
    this.router.navigate(['/events']);    //if all good take you the event page 
    this.isLoading.set(false);

  }
).catch((error) => {
  alert('Error logging in:'+error);
  this.error = 'An error occurred during login. Please try again.';//if not show error massage
  this.isLoading.set(false);   //spinner stop

});
  }

//login with google provider
loginWithGoogle(){
this.isLoading.set(true); //the spinner work

this.authService.loginWithGoogle().then(
  (user) => {
    this.router.navigate(['/events']);   //if work go to event page 
        this.isLoading.set(false);

  }
).catch((error) => {
  alert('Error logging in with Google:'+error);
  this.error = 'An error occurred during login with Google. Please try again.'; //if not show error massage
      this.isLoading.set(false);

});
  }
}

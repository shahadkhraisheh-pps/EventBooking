import { Component, inject, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Events } from '../../../core/models/events.model';
import { EventsService } from '../../../core/service/events.service';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BookingsService } from '../../../core/service/bookings.service';
import { AuthService } from '../../../core/service/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";

@Component({
  selector: 'app-event-list',
  imports: [AsyncPipe, DatePipe, ReactiveFormsModule, MatIconModule, LoadingSpinner],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export class EventList implements OnInit{
    isLoading=signal(false);
private eventService=inject(EventsService);
private route=inject(Router);
private bookingService=inject(BookingsService);
private authService=inject(AuthService);

//add the input form for seats quntity
bookForm: FormGroup = new FormGroup({
    quntity: new FormControl('', [Validators.required]),    
  });

  //get the event data form the srvice to show in the page
  events$!: Observable<Events[]>;
ngOnInit(){
this.events$=this.eventService.getEvents();
}

//book the event by event id and the seats quntity
bookEvent(eventId:string){
const formValue=this.bookForm.value;
  this.isLoading.set(true)
  if(!this.authService.isLoggedIn()){
    this.route.navigate(['/login']);
    return
  }

  this.bookingService.bookEvent(eventId,formValue.quntity) //use the method in booking service
  .then(()=>{this.route.navigate(['/bookings'])
    this.isLoading.set(false);

  }
)
  .catch((error)=>{alert("Error while book the event "+error)
    this.isLoading.set(false);
  })
}
}

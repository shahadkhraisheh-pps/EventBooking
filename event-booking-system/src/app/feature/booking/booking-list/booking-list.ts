import { Component, inject, OnInit, signal } from '@angular/core';
import { BookingsService } from '../../../core/service/bookings.service';
import { EventsService } from '../../../core/service/events.service';
import { BookingAndEvent, Bookings } from '../../../core/models/bookings.model';
import { Events } from '../../../core/models/events.model';
import { combineLatest, map, Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { AuthService } from '../../../core/service/auth.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-booking-list',
  imports: [AsyncPipe, DatePipe, LoadingSpinner,MatIconModule],
  templateUrl: './booking-list.html',
  styleUrl: './booking-list.css',
})
export class BookingList {
  //for the loading spinner
  isLoading=signal(false);
  
  private bookingService=inject(BookingsService);
  private eventService=inject(EventsService); 
  private route=inject(Router);
  public authService=inject(AuthService);

  //the booking and event data togather to show them in the page 
  bookingAndEvent$: Observable<BookingAndEvent[]> = combineLatest([ //use this method to combine two data
    this.bookingService.getBookingForUser(),//get the booking of the current user id
    this.eventService.getEvents(),//get the event 
  ]).pipe(
    map(([bookings, events]) =>
      bookings.map((booking) => ({
        booking, 
        event: events.find((event) => event.id === booking.eventId),
      }))//just take the event that in the booking db of the same event id
    )
  );

  //cancle booking 
  cancel(bookingId:string,eventId:string):void{
    this.isLoading.set(true);
    this.bookingService.cancelBookin(bookingId,eventId).catch((error)=>{
      alert("cancel failed"+error)
    }).finally(
     ()=> {this.route.navigate(['/events'])
       this.isLoading.set(false);
     }
    )
  }






}

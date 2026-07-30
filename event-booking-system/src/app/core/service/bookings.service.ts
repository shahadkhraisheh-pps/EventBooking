import { inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, query, runTransaction, updateDoc, where } from '@angular/fire/firestore/lite';
import { Bookings } from '../models/bookings.model';
import { Observable } from 'rxjs/internal/Observable';
import id from '@angular/common/locales/extra/id';
import { AuthService } from './auth.service';
import {  toSignal } from '@angular/core/rxjs-interop';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { of } from 'rxjs';
import { getDoc } from 'firebase/firestore/lite';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
 private firestore = inject(Firestore);
 private authService = inject(AuthService);
seate=0;

//get the booking for one user with same id
getBookingForUser():Observable<Bookings[]> {
  const currentUser = this.authService.currentUser();//get the current user login 

  const bookingQuery = query(
    collection(this.firestore, 'bookings'),//from booking collection
    where('userId', '==', currentUser?.uid),//get the same user id 
    where('status','==','confirmed')//and only if the status confirmed to show in booking list
  );
  //retrun the collectin as observable 
  return collectionData(bookingQuery,{idField:'id'}) as Observable<Bookings[]>; 

}
//book event for current user 
 bookEvent(eventId: string, quntity: number): Promise<void> {
   if (confirm("are you sure fro booking the event")) {

     const currentUser = this.authService.currentUser(); //get the current user
     if (!currentUser) {
       return Promise.reject('User not logged in'); //check if user login if no reject
     }
     const eventRef = doc(this.firestore, 'events', eventId); //get the doc of the event collection
     const bookingRef = collection(this.firestore, 'bookings'); //get or create booking collection to save that in it

     return runTransaction(this.firestore, async (transaction) => {
       const eventDoc = await transaction.get(eventRef); //get the event doc
       if (!eventDoc.exists()) {  //if not exists throw error
         throw new Error('Event does not exist');
       }
       const eventData = eventDoc.data() as any; //take the data in doc save as any 
       if (eventData.capacity < quntity) {
         throw new Error('Event is fully booked'); //check if the seate quntity less than capcity if yes book if not error
       }
       //update the booked seat number in event 
       transaction.update(eventRef, { bookedSeats: eventData.bookedSeats + quntity });
       //update the capacity
       transaction.update(eventRef, { capacity: eventData.capacity === 0 ? 0 : eventData.capacity - quntity });

       //write the data of the booking to save in firstore
       const bookingData: Omit<Bookings, 'id'> = {
         eventId: eventId,
         userId: currentUser.uid,
         bookingDate: new Date().toISOString(),
         status: 'confirmed',
         seatsqty: Number(quntity)
       };
       //add doc in booking collection
       const bookingDocRef = await addDoc(bookingRef, bookingData);
       transaction.set(bookingDocRef, bookingData);
     });
   }

   return Promise.resolve();
 }
 //cancel the booking
     async cancelBookin(bookingId:string,eventId:string):Promise<void>{
  if( confirm("Are your sure you want to cancle the event booking ")){
  const eventRef=doc(this.firestore,'events',eventId); //get the doc in event in same eventId
      const bookingRef=doc(this.firestore,'bookings',bookingId); //get the doc in booking same bookinId

      await runTransaction(this.firestore,async (transaction)=>{
        const eventSnap=await transaction.get(eventRef);
        if(!eventSnap.exists()){
          throw new Error('event not found')
        }
       
       const currentBooked=eventSnap.data()['bookedSeats']; //get the data of bookedseats
       const currentCapacitey=eventSnap.data()['capacity'];//get the data of the capacity
       const bookingsdoc=await getDoc(bookingRef);//get doc of the booking

       if(bookingsdoc.exists()){
         this.seate=bookingsdoc.data()['seatsqty']
       }
       
     transaction.update(eventRef,{bookedSeats:currentBooked===0?0:currentBooked-this.seate}) //update the seat number
     transaction.update(eventRef,{capacity:currentCapacitey+this.seate}) //update the cpacity number
     transaction.update(bookingRef,{status:'cancelled'}) //change the status to cancel
     transaction.update(bookingRef,{seatsqty:0})//change the stea qty to 0


      }
    );


     }

   }
    


}


import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore/lite';
import { Bookings } from '../models/bookings.model';
import { Observable } from 'rxjs/internal/Observable';
import id from '@angular/common/locales/extra/id';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
 
private firestore = inject(Firestore);
    addBookings(bookingData: any) {
        const bookingRef=collection(this.firestore, 'bookings');
        return addDoc(bookingRef, bookingData);
    }

    getBookings():Observable<Bookings[]> {
        const bookingsRef=collection(this.firestore, 'bookings');

        return collectionData(bookingsRef,{idField: 'id'}) as Observable<Bookings[]>;
    }
    getBookingById(id: string): Observable<Bookings> {
        const bookingDocRef = doc(this.firestore, 'bookings', id);
        return docData(bookingDocRef,{idField: 'id'}) as Observable<Bookings>;
    }

    updateBooking(id: string, bookingData: any) {
      const bookingsRef=doc(this.firestore, 'bookings', id);
        return updateDoc(bookingsRef, {
            userId: bookingData.userId,
            eventId: bookingData.eventId,
            numberOfSeats: bookingData.numberOfSeats,
            bookingDate: bookingData.bookingDate
        });
    }

    deleteBooking(id: string) {
        const bookingsRef = doc(this.firestore, 'bookings', id);
        return deleteDoc(bookingsRef);
    }
}


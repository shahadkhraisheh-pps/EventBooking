import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore/lite';
import { Events } from '../models/events.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  
private firestore = inject  (Firestore);
    addEvents(eventData: any) {
        const eventRef=collection(this.firestore, 'events');
        return addDoc(eventRef, eventData);
    }

    getEvents():Observable<Events[]> {
        const eventsRef=collection(this.firestore, 'events');

        return collectionData(eventsRef,{idField: 'id'}) as Observable<Events[]>;
    }
    getEventById(id: string): Observable<Events> {
        const eventDocRef = doc(this.firestore, 'events', id);
        return docData(eventDocRef,{idField: 'id'}) as Observable<Events>;
    }

    updateEvent(id: string, eventData: any) {
      const eventsRef=doc(this.firestore, 'events', id);
        return updateDoc(eventsRef, {
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            capacity: eventData.capacity,
            location: eventData.location,
            bookedSeats: eventData.bookedSeats,
            imageUrl: eventData.imageUrl
        });
    }

    deleteEvent(id: string) {
        const eventsRef = doc(this.firestore, 'events', id);
        return deleteDoc(eventsRef);
    }
}

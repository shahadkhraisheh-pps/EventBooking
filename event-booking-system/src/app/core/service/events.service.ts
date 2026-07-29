import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore/lite';
import { Events } from '../models/events.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  
private firestore = inject  (Firestore);
//add the event data and store it as doc in event collection
    addEvents(eventData: Omit<Events, 'id'>) {
        const eventRef=collection(this.firestore, 'events');
        return addDoc(eventRef, eventData);
    }
//get all event doc in the collection
    getEvents():Observable<Events[]> {
        const eventsRef=collection(this.firestore, 'events');
        return collectionData(eventsRef,{idField: 'id'}) as Observable<Events[]>;
    }
    //get the event by id 
    getEventById(id: string): Observable<Events | undefined> {
        const eventDocRef = doc(this.firestore, 'events', id);
        return docData(eventDocRef,{idField: 'id'}) as Observable<Events | undefined>;
    }
//update the event data
    updateEvent(id: string, eventData: Partial<Omit<Events, 'id'>>) {
      const eventsRef=doc(this.firestore, 'events', id);
        return updateDoc(eventsRef, eventData);
    }
//delete the event
    deleteEvent(id: string) {
        const eventsRef = doc(this.firestore, 'events', id);
        return deleteDoc(eventsRef);
    }
}

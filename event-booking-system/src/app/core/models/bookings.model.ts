import { Events } from "./events.model";

export interface Bookings {
  id: string;
  eventId: string;
  userId: string;
  bookingDate: string;
  status:  'confirmed' | 'cancelled';
  seatsqty:number;
}
export interface BookingAndEvent{
  booking:Bookings;
  event:Events |undefined;
}
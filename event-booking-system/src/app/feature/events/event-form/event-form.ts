import { Component, inject, signal } from '@angular/core';
import { EventsService } from '../../../core/service/events.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-form',
  imports: [ReactiveFormsModule],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm {
 private eventsService = inject(EventsService);
  private router = inject(Router);

  isLoading = signal (false);
  errorMessage = signal<string>('');
//event input form 
  eventForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    date: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    capacity: new FormControl(1, [Validators.required, Validators.min(1)]),
  });

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formValue = this.eventForm.value;
//add the event data to the doc i event collection
    this.eventsService
      .addEvents({
        title: formValue.title,
        description: formValue.description,
        date: new Date(formValue.date).toISOString(),
        location: formValue.location,
        capacity: formValue.capacity,
        bookedSeats: 0,
      })
      .then(() => {
        this.router.navigate(['/events']);
      })
      .catch((error) => {
        this.errorMessage.set('Failed to create event. Please try again.');
        console.error('Error adding event:', error);
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }
}

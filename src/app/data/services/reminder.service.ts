import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { environment } from 'src/app/environment/environment';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import { selectUser } from '../selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class ReminderService {
  private apiUrl = environment.api_url + '/reminder';
  user$ = this.store.select(selectUser);

  constructor(private http: HttpClient, private store: Store) {}

  getRemindersForToday(): Observable<any> {
    let userId = 0;

    this.user$.subscribe((user) => {
      if (user) {
        userId = user.id;
      }
    });

    return this.http.get<ReminderDTO>(`${this.apiUrl}/user/today`, {
      withCredentials: true,
      params: { userId: userId.toString() }
    });
  }
}

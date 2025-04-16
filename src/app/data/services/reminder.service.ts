import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { skipWhile, Observable, of } from 'rxjs';

import { environment } from 'src/app/environment/environment';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import { selectUser } from 'src/app/auth/selectors/auth.selectors';
import { AuthStateDTO } from 'src/app/auth/models/auth.dto';

@Injectable({
  providedIn: 'root',
})
export class ReminderService {
  private apiUrl = environment.api_url + '/reminder';
  user$ = this.store.select(selectUser);

  constructor(private http: HttpClient, private store: Store<AuthStateDTO>) {}

  getRemindersForToday(userId: number): Observable<any> {
    const response = this.http.get<ReminderDTO>(`${this.apiUrl}/user/today`, {
      withCredentials: true,
      params: { userId: userId.toString() },
    });

    // console.log(response)

    return response;
  }
}

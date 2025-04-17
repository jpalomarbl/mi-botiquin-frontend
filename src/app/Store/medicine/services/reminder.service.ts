import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { environment } from 'src/app/environment/environment';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';
import { AuthStateDTO } from 'src/app/Models/authState.dto';
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';

@Injectable({
  providedIn: 'root',
})
export class ReminderService {
  private apiUrl = environment.api_url + '/reminder';
  user$ = this.store.select(selectUser);

  constructor(private http: HttpClient, private store: Store<GlobalStateDTO>) {}

  getUserRemindersForToday(userId: number): Observable<any> {
    const response = this.http.get<ReminderDTO>(`${this.apiUrl}/user/today`, {
      withCredentials: true,
      params: { userId: userId.toString() },
    });

    return response;
  }
}

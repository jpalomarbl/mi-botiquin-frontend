import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UserRelationshipsService {
  private apiUrl = environment.api_url + 'user/relationship';

  constructor(private http: HttpClient) {}

  fetchCaretakerRelationships(userId: number): Observable<[]> {
    return this.http.get<[]>(`${this.apiUrl}/caretaker`, {
      withCredentials: true,
      params: { id: userId.toString() },
    });
  }

  fetchFamilyMemberRelationships(userId: number): Observable<[]> {
    return this.http.get<[]>(`${this.apiUrl}/familyMember`, {
      withCredentials: true,
      params: { id: userId.toString() },
    });
  }
}

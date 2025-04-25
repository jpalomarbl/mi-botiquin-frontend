import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environment/environment';
import { UserRelationshipDTO } from '../Models/userRelaitonship.dto';

@Injectable({
  providedIn: 'root',
})
export class UserRelationshipsService {
  private apiUrl = environment.api_url + '/user/relationship';

  constructor(private http: HttpClient) {}

  fetchCaretakerRelationships(userId: number): Observable<UserRelationshipDTO[]> {
    return this.http.get<UserRelationshipDTO[]>(`${this.apiUrl}/caretaker`, {
      withCredentials: true,
      params: { caretakerId: userId.toString() },
    });
  }

  fetchFamilyMemberRelationships(userId: number): Observable<UserRelationshipDTO[]> {
    return this.http.get<UserRelationshipDTO[]>(`${this.apiUrl}/familyMember`, {
      withCredentials: true,
      params: { familyMemberId: userId.toString() },
    });
  }
}

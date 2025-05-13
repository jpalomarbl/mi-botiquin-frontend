import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environment/environment';

import { UserDTO } from '../Models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserRelationshipsService {
  private apiUrl = environment.api_url + '/user/relationship';

  constructor(private http: HttpClient) {}

  fetchPatientRelationships(userId: number): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/patient`, {
      withCredentials: true,
      params: { patientId: userId.toString() },
    });
  }

  fetchCaretakerRelationships(userId: number): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/caretaker`, {
      withCredentials: true,
      params: { caretakerId: userId.toString() },
    });
  }

  fetchFamilyMemberRelationships(userId: number): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/familyMember`, {
      withCredentials: true,
      params: { familyMemberId: userId.toString() },
    });
  }

  searchUsers(searchTerm: string): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/search`, {
      withCredentials: true,
      params: { searchTerm: searchTerm },
    });
  }
}

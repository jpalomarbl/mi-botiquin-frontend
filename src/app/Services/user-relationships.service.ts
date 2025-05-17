import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { environment } from '../environment/environment';

import { relationshipRequestNotificationDTO } from '../Models/notification.dto';
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

  acceptRelationshipRequest(
    requesterId: number,
    receiverId: number,
    requesterRole: string
  ): Observable<UserDTO | null> {
    let route = '';

    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();
    body.set('patientId', receiverId.toString());

    if (requesterRole === 'caretaker') {
      body.set('caretakerId', requesterId.toString());

      route = '/patient-caretaker';
    } else if (requesterRole === 'family member') {
      body.set('familyMemberId', requesterId.toString());

      route = '/patient-familyMember';
    } else return of(null);

    return this.http.post<UserDTO>(this.apiUrl + route, body.toString(), {
      withCredentials: true,
      headers: headers,
    });
  }

  removePatientCaretakerRelationship(patientId: number, caretakerId: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();
    body.set('patientId', patientId.toString());
    body.set('caretakerId', caretakerId.toString());

    return this.http.delete(`${this.apiUrl}/patient-caretaker`, {
      body: body.toString(),
      withCredentials: true,
      headers: headers,
    });
  }

  removePatientFamilyMemberRelationship(patientId: number, familyMemberId: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();
    body.set('patientId', patientId.toString());
    body.set('familyMemberId', familyMemberId.toString());

    return this.http.delete(`${this.apiUrl}/patient-familyMember`, {
      body: body.toString(),
      withCredentials: true,
      headers: headers,
    });
  }
}

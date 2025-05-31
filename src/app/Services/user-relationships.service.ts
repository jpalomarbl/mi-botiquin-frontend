import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { environment } from '../environment/environment';

import { NotificationDTO } from '../Models/notification.dto';
import { UserDTO } from '../Models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserRelationshipsService {
  private apiUrlRelationships = environment.api_url + '/user/relationship';
  private apiUrlNotifications = environment.api_url + '/notification';

  constructor(private http: HttpClient) {}

  fetchPatientRelationships(userId: number): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrlRelationships}/patient`, {
      withCredentials: true,
      params: { patientId: userId.toString() },
    });
  }

  fetchCaretakerRelationships(userId: number): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrlRelationships}/caretaker`, {
      withCredentials: true,
      params: { caretakerId: userId.toString() },
    });
  }

  fetchFamilyMemberRelationships(userId: number): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(
      `${this.apiUrlRelationships}/familyMember`,
      {
        withCredentials: true,
        params: { familyMemberId: userId.toString() },
      }
    );
  }

  searchUsers(searchTerm: string): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrlRelationships}/search`, {
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

    return this.http.post<UserDTO>(
      this.apiUrlRelationships + route,
      body.toString(),
      {
        withCredentials: true,
        headers: headers,
      }
    );
  }

  removePatientCaretakerRelationship(
    patientId: number,
    caretakerId: number
  ): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();
    body.set('patientId', patientId.toString());
    body.set('caretakerId', caretakerId.toString());

    return this.http.delete(`${this.apiUrlRelationships}/patient-caretaker`, {
      body: body.toString(),
      withCredentials: true,
      headers: headers,
    });
  }

  removePatientFamilyMemberRelationship(
    patientId: number,
    familyMemberId: number
  ): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();
    body.set('patientId', patientId.toString());
    body.set('familyMemberId', familyMemberId.toString());

    return this.http.delete(
      `${this.apiUrlRelationships}/patient-familyMember`,
      {
        body: body.toString(),
        withCredentials: true,
        headers: headers,
      }
    );
  }

  sendRelationshipRequest(request: NotificationDTO): Observable<void> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();
    body.set('requesterId', request.id1.toString());
    body.set('receiverId', request.id2.toString());

    return this.http.post<void>(
      this.apiUrlNotifications + '/relationship-request',
      body.toString(),
      {
        withCredentials: true,
        headers: headers,
      }
    );
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/app/environment/environment';

import { UserDTO } from '../../Models/user.dto';
import { LoginDTO, RegisterDTO } from '../models/auth.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.api_url + '/auth';

  constructor(private http: HttpClient) {}

  login(credentials: LoginDTO): Observable<UserDTO> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();
    body.set('email', credentials.email);
    body.set('password', credentials.password);

    return this.http.post<UserDTO>(`${this.apiUrl}/login`, body.toString(), {
      withCredentials: true,
      headers: headers,
    });
  }

  register(userData: RegisterDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}/register`, userData, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  checkSession(): Observable<any> {
    return this.http.get(`${this.apiUrl}/check-session`, {
      withCredentials: true,
    });
  }

  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/email`, {
      withCredentials: true,
      params: { id: id.toString() },
    });
  }

  // getCurrentUser(): UserDTO | null {
  //   const user = localStorage.getItem('user'); //Change for selector
  //   return user ? JSON.parse(user) : null;
  // }
}

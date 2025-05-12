import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

import { environment } from 'src/app/environment/environment';

import { LoginDTO, RegisterDTO } from '../Models/auth.dto';
import { NotificationDTO } from '../Models/notification.dto';
import { UserDTO } from '../Models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = environment.api_url + '/auth';
  private notificationUrl = environment.api_url + '/notification';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(credentials: LoginDTO): Observable<UserDTO> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();
    body.set('email', credentials.email);
    body.set('password', credentials.password);

    return this.http.post<UserDTO>(`${this.authUrl}/login`, body.toString(), {
      withCredentials: true,
      headers: headers,
    });
  }

  register(userData: RegisterDTO): Observable<UserDTO> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();

    body.set('email', userData.email);
    body.set('firstName', userData.firstName);
    body.set('role', userData.role);
    body.set('password', userData.password);

    if (userData.lastName) {
      body.set('lastName', userData.lastName);
    }

    return this.http.post<UserDTO>(
      `${this.authUrl}/register`,
      body.toString(),
      {
        withCredentials: true,
        headers: headers,
      }
    );
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.authUrl}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  checkSession(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.authUrl}/check-session`, {
      withCredentials: true,
    });
  }

  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.authUrl}/email`, {
      withCredentials: true,
      params: { id: id.toString() },
    });
  }

  getWsJwtToken(): Observable<string> {
    return this.http.get<string>(`${this.authUrl}/ws-token`, {
      withCredentials: true,
    });
  }

  fetchUsersUnreadNotifications(userId: number): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(`${this.notificationUrl}/user`, {
      withCredentials: true,
      params: { userId: userId.toString() },
    });
  }

  updateUser(user: UserDTO, password: string): Observable<UserDTO> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();
    body.set('email', user.email);
    body.set('password', password);
    body.set('firstName', user.firstName);
    body.set('role', user.role);
    body.set('userId', user.id.toString());

    if (user.lastName) {
      body.set('lastName', user.lastName);
    } else {
      body.set('lastName', '');
    }

    return this.http.put<UserDTO>(`${this.authUrl}/user/update`, body.toString(), {
      withCredentials: true,
      headers: headers,
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

const API_URL = 'http://localhost:3000';

export interface AuthResponse {
  accessToken: string;
  user: { id: number; name: string; email: string; phone: string; role: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
    role?: string;
  }) {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register`, data);
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.accessToken);
          localStorage.setItem('user', JSON.stringify(res.user));
        }),
      );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:5001/api/Account';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  register(model: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, model);
  }

  login(model: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, model).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
        return response;
      })
    );
  }

  githubLogin(): void {
    window.location.href = 'https://localhost:5001/api/Account/github-login';
  }

  handleGitHubCallback(): void {
    const token = this.extractTokenFromUrl();
    if (token) {
      localStorage.setItem('token', token);
      this.router.navigate(['/product']); 
    }
  }

  private extractTokenFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

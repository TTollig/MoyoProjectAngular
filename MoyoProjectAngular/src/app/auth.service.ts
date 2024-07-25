import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:5001/api/Account';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

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
        console.log("Handle GitHub callback works");
        console.log(this.getRole());
    }
    
}

private extractTokenFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
}


  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Here we assume token expiration checking is skipped for simplicity
    return !!token;
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  //getAuthHeaders(): HttpHeaders {
    //const token = this.getToken();
    //return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //}

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

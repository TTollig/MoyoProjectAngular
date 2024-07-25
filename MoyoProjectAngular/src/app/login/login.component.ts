import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.logout();
    this.authService.handleGitHubCallback(); // Handle GitHub callback on initialization
  }

  login() {
    this.authService.login(this.model).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/product']);
      },
      error => {
        console.log(error);
      }
    );
  }

  loginWithGitHub(): void {
    this.authService.githubLogin();
  }
}

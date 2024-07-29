import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../Angular Material/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule,FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  hide: boolean = true; 

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.logout();
    this.authService.handleGitHubCallback(); 
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

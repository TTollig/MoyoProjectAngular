import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../Angular Material/material.module';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, MatCardModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  model: any = {};
  hide: boolean = true; // Added to control password visibility

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.model).subscribe(
      response => {
        this.router.navigate(['/login']);
      },
      error => {
        console.log(error);
      }
    );
  }
}

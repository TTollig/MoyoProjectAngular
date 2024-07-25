import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  model: any = {};

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

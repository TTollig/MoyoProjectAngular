import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Updated import
import { MaterialModule } from '../../Angular Material/material.module';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, MatCardModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  productForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', Validators.required],
      
    });
  }

  createProduct() {
    if (this.productForm.invalid) {
      return;
    }

    const productObj = this.productForm.value;

    this.http.post('https://localhost:5001/api/product/AddProduct', productObj).subscribe(
      (res: any) => {
        if (res) {
          console.log(productObj);
          this.snackBar.open(`${productObj.name} successfully sent for approval`, 'Close', {
            duration: 3000
          });
          this.router.navigateByUrl('/product');
        } else {
          this.snackBar.open('Failed to add product', 'Close', {
            duration: 3000
          });
        }
      },
      (error) => {
        this.snackBar.open('Error occurred while creating product', 'Close', {
          duration: 3000
        });
      }
    );
  }

  onCancel() {
    this.router.navigateByUrl('/product');
  }
}

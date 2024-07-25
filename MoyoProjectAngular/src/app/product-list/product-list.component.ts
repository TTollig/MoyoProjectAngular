import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  editProductId: number | null = null;
  editedProduct: { [key: number]: { name: string, description: string } } = {};

  private apiUrl = 'https://localhost:5001/api/product';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadApprovedProducts();
  }

  loadApprovedProducts() {
    this.http.get<any[]>(`${this.apiUrl}/GetApprovedProducts`).subscribe(
      (data: any[]) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  startEdit(productId: number) {
    this.editProductId = productId;
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.editedProduct[productId] = { name: product.name, description: product.description };
    }
  }

  cancelEdit(productId: number) {
    this.editProductId = null;
    delete this.editedProduct[productId];
  }

  saveProduct(productId: number) {
    const updatedProduct = this.editedProduct[productId];
    if (updatedProduct) {
      this.http.put<void>(`${this.apiUrl}/UpdateProduct/${productId}`, updatedProduct).subscribe(
        () => {
          this.editProductId = null;
          delete this.editedProduct[productId];
          this.loadApprovedProducts(); // Reload the list to reflect changes
        },
        (error) => {
          console.error('Error updating product:', error);
        }
      );
    }
  }

  isEditing(productId: number): boolean {
    return this.editProductId === productId;
  }

  getEditedProductName(productId: number): string {
    return this.editedProduct[productId]?.name || '';
  }

  getEditedProductDescription(productId: number): string {
    return this.editedProduct[productId]?.description || '';
  }
}

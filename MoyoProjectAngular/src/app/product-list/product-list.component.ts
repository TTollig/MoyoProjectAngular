import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../Angular Material/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CommonModule, MaterialModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  editProductId: number | null = null;
  editedProduct: { [key: number]: { name: string, description: string } } = {};
  displayedColumns: string[] = ['name', 'description', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  private apiUrl = 'https://localhost:5001/api/product';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadApprovedProducts();
  }

  loadApprovedProducts() {
    this.http.get<any[]>(`${this.apiUrl}/GetApprovedProducts`).subscribe(
      (data: any[]) => {
        this.products = data;
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
          this.loadApprovedProducts(); 
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
}

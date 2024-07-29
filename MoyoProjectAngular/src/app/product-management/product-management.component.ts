import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../Angular Material/material.module';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [FormsModule, CommonModule, MaterialModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  approvedProducts: any[] = [];
  createdProducts: any[] = [];
  deletedProducts: any[] = [];

  displayedColumns: string[] = ['name', 'description', 'actions'];
  dataSourceApproved!: MatTableDataSource<any>;
  dataSourceCreated!: MatTableDataSource<any>;
  dataSourceDeleted!: MatTableDataSource<any>;

  @ViewChild('paginatorApproved') paginatorApproved!: MatPaginator;
  @ViewChild('paginatorCreated') paginatorCreated!: MatPaginator;
  @ViewChild('paginatorDeleted') paginatorDeleted!: MatPaginator;
  @ViewChild('sortApproved') sortApproved: MatSort = new MatSort();
  @ViewChild('sortCreated') sortCreated: MatSort = new MatSort();
  @ViewChild('sortDeleted') sortDeleted: MatSort = new MatSort();

  private apiUrl = 'https://localhost:5001/api/product';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadApprovedProducts();
    this.loadCreatedProducts();
    this.loadDeletedProducts();
  }

  loadApprovedProducts() {
    this.http.get<any[]>(`${this.apiUrl}/GetApprovedProducts`).subscribe(
      (data: any[]) => {
        this.approvedProducts = data;
        this.dataSourceApproved = new MatTableDataSource(this.approvedProducts);
        this.dataSourceApproved.paginator = this.paginatorApproved;
        this.dataSourceApproved.sort = this.sortApproved;
      },
      (error) => {
        console.error('Error fetching approved products:', error);
      }
    );
  }

  loadCreatedProducts() {
    this.http.get<any[]>(`${this.apiUrl}/GetCreatedProducts`).subscribe(
      (data: any[]) => {
        this.createdProducts = data;
        this.dataSourceCreated = new MatTableDataSource(this.createdProducts);
        this.dataSourceCreated.paginator = this.paginatorCreated;
        this.dataSourceCreated.sort = this.sortCreated;
      },
      (error) => {
        console.error('Error fetching created products:', error);
      }
    );
  }

  loadDeletedProducts() {
    this.http.get<any[]>(`${this.apiUrl}/GetDeletedProducts`).subscribe(
      (data: any[]) => {
        this.deletedProducts = data;
        this.dataSourceDeleted = new MatTableDataSource(this.deletedProducts);
        this.dataSourceDeleted.paginator = this.paginatorDeleted;
        this.dataSourceDeleted.sort = this.sortDeleted;
      },
      (error) => {
        console.error('Error fetching deleted products:', error);
      }
    );
  }

  approveProduct(productId: number) {
    const statusPayload = { status: "Approved" };
    this.http.put<void>(`${this.apiUrl}/UpdateProductStatus/${productId}/status`, statusPayload).subscribe(
      () => {
        this.loadCreatedProducts();
        this.loadDeletedProducts();
        this.ngOnInit();
      },
      (error) => {
        console.error('Error approving product:', error);
      }
    );
  }
  
  removeProduct(productId: number) {
    const statusPayload = { status: "Deleted" };
    this.http.put<void>(`${this.apiUrl}/UpdateProductStatus/${productId}/status`, statusPayload).subscribe(
      () => {
        this.loadCreatedProducts();
        this.loadApprovedProducts();
        this.ngOnInit();
      },
      (error) => {
        console.error('Error removing product:', error);
      }
    );
  }
  

  applyFilter(event: Event, dataSource: MatTableDataSource<any>) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();
  
    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }
  
}

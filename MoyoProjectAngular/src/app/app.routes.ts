import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductListComponent } from './product-list/product-list.component';
import { authGuard } from './auth.guard';
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductManagementComponent } from './product-management/product-management.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'product', component: ProductListComponent, canActivate: [authGuard], data: { role: ['Manager', 'Capturer'] } },
  { path: 'createproduct', component: CreateProductComponent, canActivate: [authGuard], data: { role: ['Manager', 'Capturer'] } },
  { path: 'manageproduct', component: ProductManagementComponent, canActivate: [authGuard], data: { role: ['Manager'] } }
];

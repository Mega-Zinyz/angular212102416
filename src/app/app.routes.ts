import { RouterModule,Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Dashboard2 } from './dashboard2/dashboard2';
import { Dashboard3 } from './dashboard3/dashboard3';
import { Login } from './login/login';
import { NgModule } from '@angular/core';
import { Register } from './register/register';
import { Admin } from './admin/admin';
import { Mahasiswa } from './mahasiswa/mahasiswa';
import { Logout } from './logout/logout';
import { otentikasiGuard } from './otentikasi-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'admin', component: Admin, canActivate: [otentikasiGuard]},
    { path: 'dashboard', component: Dashboard,canActivate: [otentikasiGuard]},
    { path: 'dashboard2', component: Dashboard2, canActivate: [otentikasiGuard]},
    { path: 'dashboard3', component: Dashboard3, canActivate: [otentikasiGuard]},
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'logout', component: Logout, canActivate: [otentikasiGuard]},
    { path: 'mahasiswa', component: Mahasiswa, canActivate: [otentikasiGuard]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

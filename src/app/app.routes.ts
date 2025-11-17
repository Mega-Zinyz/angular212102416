import { RouterModule,Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Dashboard2 } from './dashboard2/dashboard2';
import { Dashboard3 } from './dashboard3/dashboard3';
import { Login } from './login/login';
import { NgModule } from '@angular/core';
import { Register } from './register/register';
import { Admin } from './admin/admin';
import { Mahasiswa } from './mahasiswa/mahasiswa';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'admin', component: Admin },
    { path: 'dashboard', component: Dashboard },
    { path: 'dashboard2', component: Dashboard2 },
    { path: 'dashboard3', component: Dashboard3 },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'mahasiswa', component: Mahasiswa }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

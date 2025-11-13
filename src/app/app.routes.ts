import { Routes } from '@angular/router';
import { Login } from './auth/pages/login/login';
import { DashboardLayout } from './dashboard/layout/dashboard-layout/dashboard-layout';
import { authGuard } from './auth/guards/auth-guard';

export const routes: Routes = [

    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: DashboardLayout,
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: ''
    }
];

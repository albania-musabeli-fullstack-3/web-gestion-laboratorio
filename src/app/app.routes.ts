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
        path: 'create-account',
        loadComponent: () => import('./auth/pages/create-account/create-account')
    },
    {
        path: 'recovery-password',
        loadComponent: () => import('./auth/pages/recovery-password/recovery-password')
    },
    {
        path: '',
        component: DashboardLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'home',
                loadComponent: () => import('./dashboard/pages/home/home')
            },
            {
                path: 'usuarios',
                loadComponent: () => import('./dashboard/pages/usuarios/usuarios')
            },
            {
                path: 'resultados',
                loadComponent: () => import('./dashboard/pages/resultados/resultados')
            },
            {
                path: 'laboratorios',
                loadComponent: () => import('./dashboard/pages/laboratorios/laboratorios')
            },
            {
                path: 'perfil',
                loadComponent: () => import('./dashboard/pages/profile/profile')
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            }
        ]
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

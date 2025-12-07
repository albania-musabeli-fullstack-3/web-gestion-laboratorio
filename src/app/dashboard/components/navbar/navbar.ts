import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../shared/services/alert-service';

@Component({
  selector: 'dashboard-navbar',
  imports: [
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './navbar.html'
})
export class Navbar {

  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);


  async logout(){
    
    const confirmado = await this.alertService.confirmar(
      '¿Cerrar sesión?',
      'Estás a punto de cerrar tu sesión actual',
      'Sí, cerrar sesión',
      'Cancelar'
    );

    if (confirmado) {
      
      localStorage.removeItem('usuario');

      this.alertService.handlerAlerta(
        'Sesión cerrada',
        'Has cerrado sesión correctamente',
        'success'
      );

      this.router.navigate(['/login']);
    }
  }



}

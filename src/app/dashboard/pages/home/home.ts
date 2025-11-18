import { Component, inject, OnInit, signal } from '@angular/core';
import { UserStorage } from '../../services/user-storage/user-storage';
import { MatTabsModule } from '@angular/material/tabs';
import { Submenu } from '../../interfaces/sidebar-item.interface';
import { SidebarMenu } from '../../services/sidebar-menu/sidebar-menu';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    MatTabsModule,
    MatCardModule,
    RouterModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export default class Home implements OnInit {

  horaActual: string = '';
  fechaActual: string = '';
  saludo: string = '';
  nombre = signal<string>('');
  programas = signal<Submenu[]>([]);

  private userStorage = inject(UserStorage);
  private menuService = inject(SidebarMenu);
  private router = inject(Router);


  ngOnInit(): void {
    this.actualizarFechaHora();
    setInterval(() => this.actualizarFechaHora(), 1000);

    this.nombre.set(this.userStorage.userLoginComp()?.nombre || '')

    this.programas.set(this.menuService.menu()[0].submenu!)
  }


  actualizarFechaHora() {
    const fecha = new Date();
    this.horaActual = fecha.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
    this.fechaActual = fecha.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });

    // Saludo basado en la hora
    const hour = fecha.getHours();
    if (hour < 12) {
      this.saludo = 'Buenos días';
    } else if (hour < 18) {
      this.saludo = 'Buenas tardes';
    } else {
      this.saludo = 'Buenas noches';
    }
  }


  navegarCards(ruta: string){
    this.router.navigate([ruta]);
  }


}
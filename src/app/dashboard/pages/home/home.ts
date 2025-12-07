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

  private readonly userStorage = inject(UserStorage);
  private readonly menuService = inject(SidebarMenu);
  private readonly router = inject(Router);


  ngOnInit(): void {
    const primerMenu = this.menuService.menu()[0];

    this.actualizarFechaHora();
    setInterval(() => this.actualizarFechaHora(), 1000);

    this.nombre.set(this.userStorage.userLoginComp()?.nombre || '')

    if (primerMenu) {
      this.programas.set(primerMenu.submenu ?? [])
    } else {
      this.programas.set([]);
    }
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
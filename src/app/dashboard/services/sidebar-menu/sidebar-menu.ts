import { Injectable, signal } from '@angular/core';
import { DashboarItem } from '../../interfaces/sidebar-item.interface';

@Injectable({
  providedIn: 'root',
})
export class SidebarMenu {

  public menu = signal<DashboarItem[]>([
    {
      label: 'Módulos',
      icon: 'lni lni-list',
      submenu: [
        {
          label: 'Usuarios',
          link: 'usuarios',
          codPrograma: 'GL001',
          nombrePrograma: 'GL001 - Mantención Usuarios'
        },

        {
          label: 'Resultados',
          link: 'resultados',
          codPrograma: 'GL002',
          nombrePrograma: 'GL002 - Resultados Laboratorio'
        },
      ]
    }
  ])
}
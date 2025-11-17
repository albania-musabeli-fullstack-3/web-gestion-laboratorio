import { Injectable, signal } from '@angular/core';
import { DashboarItem } from '../interfaces/sidebar-item.interface';

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
          link: 'usuarios'
        },

        {
          label: 'Laboratorios',
          link: 'productos'
        },
      ]
    }
  ])
}
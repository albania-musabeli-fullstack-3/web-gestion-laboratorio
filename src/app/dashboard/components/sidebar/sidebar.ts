import { Component, computed, ElementRef, inject } from '@angular/core';
import { SidebarMenu } from '../../services/sidebar-menu/sidebar-menu';
import { Router, RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';


@Component({
  selector: 'dashboard-sidebar',
  imports: [
    RouterModule,
    NgClass,
  ],
  templateUrl: './sidebar.html'
})
export class Sidebar {

  private readonly elementRef = inject(ElementRef);
  private readonly sidebarService = inject(SidebarMenu);
  private readonly router = inject(Router);


  public menuItems = computed(() => this.sidebarService.menu())


  toggleSidebar() {
    const sidebar = this.elementRef.nativeElement.querySelector('#sidebar');
    sidebar.classList.toggle('expand');
  }

}

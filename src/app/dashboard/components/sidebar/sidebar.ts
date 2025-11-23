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
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {

   private elementRef = inject(ElementRef);
  private sidebarService = inject(SidebarMenu);
  private router = inject(Router);


  public menuItems = computed(() => this.sidebarService.menu())


  toggleSidebar() {
    const sidebar = this.elementRef.nativeElement.querySelector('#sidebar');
    sidebar.classList.toggle('expand');
  }

}

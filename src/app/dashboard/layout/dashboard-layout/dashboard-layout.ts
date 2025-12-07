import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    Navbar,
    Sidebar,
    RouterOutlet,
  ],
  templateUrl: './dashboard-layout.html'
})
export class DashboardLayout {

}

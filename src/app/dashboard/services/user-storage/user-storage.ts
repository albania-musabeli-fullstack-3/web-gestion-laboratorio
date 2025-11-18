import { computed, Injectable, signal } from '@angular/core';
import { User } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserStorage {

  private userLogin  = signal<User | null>(null);

  public userLoginComp = computed(() => this.userLogin());

  constructor(){
    this.loadUserFromLocalStorage()
  }


  loadUserFromLocalStorage(){
    const user = localStorage.getItem('usuario')

    if (user) this.userLogin.set(JSON.parse(user));
    
  }
  
}

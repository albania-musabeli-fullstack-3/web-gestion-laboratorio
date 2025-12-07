import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserRequest } from '../interfaces/auth.request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {

  private readonly http = inject(HttpClient);

  private readonly urlBaseAPI = 'http://localhost:8080/api';

  login(correo: string, password: string){
    return this.http.post(`${ this.urlBaseAPI }/usuario/login`, { correo, password });
  }


  register(request: UserRequest){
    return this.http.post(`${ this.urlBaseAPI }/usuario`, request)
  }


  recoveryUserPassword(correo: string): Observable<any>{
    return this.http.get(`${ this.urlBaseAPI }/usuario/recoveryPassword?correo=${correo}`)
  }


}

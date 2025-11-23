import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRequest } from '../interfaces/auth.request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {

  constructor(private http: HttpClient){}

  private urlBaseAPI = 'http://localhost:8080/api';

  login(correo: string, password: string){
    return this.http.post(`${ this.urlBaseAPI }/usuario/login`, { correo, password });
  }


  register(request: UserRequest){
    return this.http.post(`${ this.urlBaseAPI }/usuario`, request)
  }


  recoveryPassword(correo: string): Observable<any>{
    return this.http.get(`${ this.urlBaseAPI }/usuario/recoveryPassword?correo=${correo}`)
  }


}

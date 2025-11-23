import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRequest } from '../interfaces/auth.request';

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



}

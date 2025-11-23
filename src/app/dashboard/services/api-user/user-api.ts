import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserApi {

  constructor(private http: HttpClient){}

  private urlBaseAPI = 'http://localhost:8080/api';


  updateUser(user: any): Observable<any>{
    return this.http.put(`${ this.urlBaseAPI }/usuario/${user.id}`, user);
  }


}

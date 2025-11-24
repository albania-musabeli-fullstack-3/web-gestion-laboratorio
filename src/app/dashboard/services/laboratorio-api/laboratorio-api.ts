import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LaboratorioRes } from '../../interfaces/laboratorio.response';

@Injectable({
  providedIn: 'root',
})
export class LaboratorioApi {
  

  constructor(private http: HttpClient){}

  private urlBaseAPI = 'http://localhost:8081/api';


  getAllLaboratorios(){
    return this.http.get<LaboratorioRes[]>(`${this.urlBaseAPI}/laboratorio`)
  }
  
}

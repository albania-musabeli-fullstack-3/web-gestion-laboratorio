import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Laboratorio, ResultadoReq, ResultadosLabRes } from '../../interfaces/laboratorio.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiLaboratorio {
  

  constructor(private http: HttpClient){}

  private urlBaseAPI = 'http://localhost:8081/api';


  getAllLaboratorios(){
    return this.http.get<Laboratorio[]>(`${this.urlBaseAPI}/laboratorio`);
  }


  createLaboratorio(request: Laboratorio){
    return this.http.post<Laboratorio>(`${this.urlBaseAPI}/laboratorio`, request);
  }


  getAllResultadosAnalisis(){
    return this.http.get<ResultadosLabRes[]>(`${this.urlBaseAPI}/resultado`);
  }


  editarLaboratorio(id: number, request: Laboratorio){
    return this.http.put<Laboratorio>(`${this.urlBaseAPI}/laboratorio/${id}`, request);
  }


  eliminarLaboratorio(id: number){
    return this.http.delete<Laboratorio>(`${this.urlBaseAPI}/laboratorio/${id}`);
  }


  createResultado(request: ResultadoReq){
    return this.http.post<ResultadosLabRes>(`${this.urlBaseAPI}/resultado` , request);
  }
}

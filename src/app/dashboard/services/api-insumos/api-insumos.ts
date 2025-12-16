import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Insumo } from '../../interfaces/insumo.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiInsumos {

  private readonly http = inject(HttpClient);
  private readonly urlBaseAPI = 'http://localhost:8082/api';


  getAllInsumos(){
    return this.http.get<Insumo[]>(`${this.urlBaseAPI}/insumo`);
  }
  
}

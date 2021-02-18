import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComprasPublicasService {

  constructor(private http: HttpClient) { }

  postIniciarSesionCP(cedula, pasw){
    return this.http.post('http://localhost:3000/login/loginMunicipio',{cedula, pasw});
  }

}

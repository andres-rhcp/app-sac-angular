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

  postIniciarSesionAdmin(cedula, pasw){
    return this.http.post('http://localhost:3000/login/loginAdmin',{cedula, pasw});
  }

  getObtenerPacUsua(anio, cod_dep){
    return this.http.get(`http://localhost:3000/pac/${anio}/${cod_dep}`)
  }
}

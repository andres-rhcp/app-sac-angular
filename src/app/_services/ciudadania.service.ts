import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class CiudadaniaService 
{
  constructor(private http: HttpClient) 
  {}

  postRegistrarCiudadano(cedula, nombres, apellidos, password, email)
  {
    return this.http.post('http://localhost:3000/login/nuevoUsuario',{cedula, nombres, apellidos, password, email});
  }

  getActivarCiudadano(cedula)
  {
    return this.http.get(`http://localhost:3000/login/cambiarEstado/${cedula}`);
  }

  postLoginCiudadano(cedula, password)
  {
    return this.http.post(`http://localhost:3000/login-ciudadano`,{cedula, password});
  }

  postLoginCiudadanoPaso2(codigo, identificacion)
  {
    return this.http.post(`http://localhost:3000/login-ciudadano/paso-dos`,{codigo, identificacion})
  }
}
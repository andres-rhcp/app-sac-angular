import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { CiudadaniaService } from 'src/app/_services/ciudadania.service'
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_models/user'

@Component({
  selector: 'app-login-ciudadano',
  templateUrl: './login-ciudadano.component.html',
  styleUrls: ['./login-ciudadano.component.css']
})
export class LoginCiudadanoComponent implements OnInit 
{
  datos: any = []
  cedula: string;
  password: string;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public usuario: string;

  constructor(private ciudadanoService: CiudadaniaService, private router: Router) 
  { 
    this.currentUserSubject = new BehaviorSubject<any>((localStorage.getItem('usuario')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.usuario = (localStorage.getItem('usuario'));
  }

  ngOnInit() {
  }

  LoginCiudadano()
  {
    this.ciudadanoService.postLoginCiudadano(this.cedula,this.password).subscribe(
      data => {
        this.datos = data
        if(this.datos.mensaje==='OK')
        {
          localStorage.setItem('token', this.datos.token);
          localStorage.setItem('transacciones', JSON.stringify(this.datos.transacciones))
          localStorage.setItem('cedula', this.datos.usuario_cedula);
          localStorage.setItem('nombre', this.datos.usuario_nombres);
          this.currentUserSubject.next(this.datos);
          //reenvio al landing page
          this.router.navigate(['ciudadano/landing-page'])
        }
      }
    )
  }

  LogoutCiudadano()
  {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }
}
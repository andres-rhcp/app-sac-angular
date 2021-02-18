import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import {Md5} from "md5-typescript";
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_models';
import { ComprasPublicasService } from 'src/app/_services/compras-publicas.service';

@Component({
  selector: 'app-login-cp',
  templateUrl: './login-cp.component.html',
  styleUrls: ['./login-cp.component.css']
})
export class LoginCpComponent implements OnInit {

  datos: any = []
  cedula: string;
  password: string;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public usuario: string;

  constructor(private ComprasPublicasService: ComprasPublicasService, 
    private router: Router, 
    public dialog: MatDialog) 
    {
      this.currentUserSubject = new BehaviorSubject<any>((localStorage.getItem('usuario')));
      this.currentUser = this.currentUserSubject.asObservable();
      this.usuario = (localStorage.getItem('usuario'));
    }

  ngOnInit() {
  }

  loginComprasPublicas(){
    const pswd = Md5.init(this.password)
    this.ComprasPublicasService.postIniciarSesionCP(this.cedula, pswd).subscribe(
      data =>{
        this.datos = data
        if(this.datos.mensaje ==='OK-Usua-Muni'){
          localStorage.setItem('cedula', this.datos.cedula);
          localStorage.setItem('nombres', this.datos.nombres);
          localStorage.setItem('apellidos', this.datos.apellidos);
          localStorage.setItem('departamento', this.datos.departamento);
          localStorage.setItem('jefe', this.datos.jefe);
          this.currentUserSubject.next(this.datos);

          this.router.navigate(['compras-publicas/menu'])
        }else{

        }
      }
    )
  }
  

}

import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import {NotificationsService} from 'angular2-notifications'; 

import { User } from 'src/app/_models/user';
import { CiudadaniaService } from 'src/app/_services/ciudadania.service';

export interface DialogData {
  respuesta: string;
  ciu_cedula: string;
}

@Component({
  selector: 'app-dialog-ciudadano',
  templateUrl: './dialog-ciudadano.component.html',
  styleUrls: ['./dialog-ciudadano.component.css']
})

export class DialogCiudadanoComponent implements OnInit 
{
  //variable que elmacena el mensaje del consumo
  dato: string;

  //variable que almacena los resultados del consumo del api
  datos: any = []

  //variable que toma el codigo para la verificacion del paso 2 del Login Ciudadano mediante el html
  codigo: any

  //variables para localStorage
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public usuario: string;

  constructor(public dialogRef: MatDialogRef<DialogCiudadanoComponent>, 
              private route: Router, 
              public dialog: MatDialog, 
              @Inject(MAT_DIALOG_DATA) public data: DialogData, 
              private ciudadanoService: CiudadaniaService,
              private notificaciones: NotificationsService) 
  {
    this.dato = this.data.respuesta;

    this.currentUserSubject = new BehaviorSubject<any>((localStorage.getItem('usuario')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.usuario = (localStorage.getItem('usuario'));
  }

  ngOnInit() 
  {}

  LoginCiudadano_paso2()
  {
    this.ciudadanoService.postLoginCiudadanoPaso2(this.codigo, this.data.ciu_cedula).subscribe(
      data => {
        this.datos = data

        if(this.datos.mensaje === 'OK')
        {
          localStorage.setItem('token', this.datos.token);
          localStorage.setItem('transacciones', JSON.stringify(this.datos.transacciones))
          localStorage.setItem('cedula', this.datos.usuario_cedula);
          localStorage.setItem('nombre', this.datos.usuario_nombres);
          localStorage.setItem('apellidos', this.datos.usuario_appeliidos);
          localStorage.setItem('carpeta',this.datos.ruta_carpeta)
          this.currentUserSubject.next(this.datos);
          //Renvio al landing page
          this.route.navigate(['ciudadano/landing-page'])
          this.cerrarDialog()
        }else if(this.datos.mensaje === 'NO-CODIGO')
        {
          this.notificacionDeError('Codigo invalido', 'El codigo ingresado es el incorrecto verifique su correo electronico')
        }else if(this.datos.mensaje === 'TIEMPO-FUERA')
        {
          this.notificacionDeAlerta('Tiempo agotado', 'El tiempo de espera para ingresar el codigo se ha agotado')
        }
      }
    )
  }

  Dirigir_a_LoginCiudadano() 
  {
    this.route.navigate(['login-ciudadano'])
    this.dialog.closeAll();
  }

  onNoClick(): void 
  {
    this.dialogRef.close();
  }

  cerrarDialog()
  {
    this.dialog.closeAll();
  }

  //FUNCIONES DE NOTIFICACIONES
  notificacionDeError(titulo, mensaje)
  {
    this.notificaciones.error(titulo, mensaje, {
      position: ['top', 'right'],
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: false
    })
  }

  notificacionDeAlerta(titulo, mensaje)
  {
    this.notificaciones.alert(titulo, mensaje, {
      position: ["top", "right"],
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: false
    })
  }
}

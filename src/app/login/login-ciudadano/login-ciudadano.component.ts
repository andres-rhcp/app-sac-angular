import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CiudadaniaService } from 'src/app/_services/ciudadania.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_models/user';
import { MatDialog } from '@angular/material';
import { DialogCiudadanoComponent } from 'src/app/login/dialog-ciudadano/dialog-ciudadano.component';

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

  constructor(private ciudadanoService: CiudadaniaService, private router: Router, public dialog: MatDialog) 
  { 
    this.currentUserSubject = new BehaviorSubject<any>((localStorage.getItem('usuario')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.usuario = (localStorage.getItem('usuario'));
  }

  ngOnInit() 
  {}

  loginCiudadano_paso1()
  {
    this.password = btoa(this.password);
    this.ciudadanoService.postLoginCiudadano(this.cedula, this.password).subscribe(
      data => {
        this.datos = data
        if(this.datos.mensaje === 'OK-paso1')
        {
          this.abrirDialog2("OK-PASO2", this.cedula)
        }else
        {
          this.abrirDialog("NO-LOGIN")
        }
      })
  }

  LoginCiudadano()
  {
    this.password = btoa(this.password);
    this.ciudadanoService.postLoginCiudadano(this.cedula,this.password).subscribe(
      data => {
        this.datos = data
        if(this.datos.mensaje==='OK')
        {
          localStorage.setItem('token', this.datos.token);
          localStorage.setItem('transacciones', JSON.stringify(this.datos.transacciones))
          localStorage.setItem('cedula', this.datos.usuario_cedula);
          localStorage.setItem('nombre', this.datos.usuario_nombres);
          localStorage.setItem('apellidos', this.datos.usuario_appeliidos);
          localStorage.setItem('carpeta',this.datos.ruta_carpeta)
          this.currentUserSubject.next(this.datos);
          //reenvio al landing page
          this.router.navigate(['ciudadano/landing-page'])
        }else
        {
          this.abrirDialog("NO-LOGIN")
        }
      }
    )
  }

  LogoutCiudadano()
  {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  abrirDialog(respuesta)
  {
    const dialogRef = this.dialog.open(DialogCiudadanoComponent, {
      data: { respuesta: respuesta},
      width: '500PX',
      height:'590px',
      panelClass: 'my-class'
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  abrirDialog2(respuesta, cedula)
  {
    const dialogRef = this.dialog.open(DialogCiudadanoComponent, {
      data:{respuesta: respuesta, ciu_cedula: cedula},
      width: '500px',
      height: '590px',
      panelClass: 'my-class'
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
}
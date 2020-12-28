import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CiudadaniaService } from 'src/app/_services/ciudadania.service'
import { DialogCiudadanoComponent } from '../dialog-ciudadano/dialog-ciudadano.component';

@Component({
  selector: 'app-activacion-cuenta',
  templateUrl: './activacion-cuenta.component.html',
  styleUrls: ['./activacion-cuenta.component.css']
})

export class ActivacionCuentaComponent implements OnInit 
{
  cedula: any
  dato_envio: any

  constructor(private parametro: ActivatedRoute, private ciudadaniaService: CiudadaniaService, public dialog: MatDialog)
  { 
    this.cedula = this.parametro.snapshot.paramMap.get('cedula')
  }

  ngOnInit() {
  }

  Activar_Cuenta_Ciudadano() 
  {
    console.log(this.cedula)
    try 
    {
      this.ciudadaniaService.getActivarCiudadano(this.cedula).subscribe(
        data=>{
          console.log(data)
          this.dato_envio=data
          this.AbrirDialog(this.dato_envio.mensaje)
        }
      )
        
    }catch (error)
    {
      console.log("HA OCURRIDO UN ERROR CON LA ACTIVACION: ", error)
    }
  }

  AbrirDialog(respuesta)
  {
    const dialogRef = this.dialog.open(DialogCiudadanoComponent, {
      data: { respuesta: respuesta},
      width: '500PX',
      height:'590px',
      panelClass: 'my-class'
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
}
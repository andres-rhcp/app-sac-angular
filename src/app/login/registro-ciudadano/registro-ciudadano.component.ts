import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CiudadaniaService } from 'src/app/_services/ciudadania.service'
import { DialogCiudadanoComponent } from 'src/app/login/dialog-ciudadano/dialog-ciudadano.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-ciudadano',
  templateUrl: './registro-ciudadano.component.html',
  styleUrls: ['./registro-ciudadano.component.css']
})

export class RegistroCiudadanoComponent implements OnInit 
{
  ingresarForm = new FormGroup({
    cedula: new FormControl('', [Validators.required, Validators.pattern(/^(([0-9]*[a-z]*)*)$/)]),
  });

  nombres: string
  apellidos: string
  correo_electronico: string
  contrasenia: string
  
  dato_envio: any

  constructor(private ciudadanoService: CiudadaniaService, public dialog: MatDialog) { }

  ngOnInit() {
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

  ValidarCedula()
  {
    var suma = 0
    var numero
    var x

    for (let i = 0; i < this.ingresarForm.controls.cedula.value.length; i++) 
    {
      numero = parseInt(this.ingresarForm.controls.cedula.value.charAt(i));

      if((i+1)%2 != 0)
      {
        x = numero * 2;

        if (x>9)
        {
          x = x - 9;
        }
        suma = suma + x;
      }else
      {
        suma = suma + numero
      }
    }

    if(suma % 10 != 0)
    {
      console.log("CEDULA INGRESADA INCORRECTA")
      this.abrirDialog("NO-CEDULA")
    }else
    {
      console.log("CEDULA INGRESADA CORRECTA")
    }
  }

  registrar_usuario()
  {
    //validarCedula()
    console.log(this.ingresarForm.controls.cedula.value, this.nombres, this.apellidos, this.correo_electronico)
    this.ciudadanoService.postRegistrarCiudadano(this.ingresarForm.controls.cedula.value, this.nombres, this.apellidos, this.contrasenia, this.correo_electronico).subscribe(
      recibido =>{
        this.dato_envio = recibido;
        this.abrirDialog(this.dato_envio.mensaje)
      }
    )
  }
  public hasError = (controlName:string, errorName: string) =>{
    return this.ingresarForm.controls[controlName].hasError(errorName);
  }
}

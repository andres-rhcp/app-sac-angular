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
    nombres: new FormControl('',[Validators.required, Validators.pattern(/(^[A-ZÁÉÍÓÚ]{1}([a-zñáéíóú]+){2,})(\s[A-ZÁÉÍÓÚ]{1}([a-zñáéíóú]+){2,})?$/)]),
    apellidos: new FormControl('',[Validators.required, Validators.pattern(/(^[A-ZÁÉÍÓÚ]{1}([a-zñáéíóú]+){2,})(\s[A-ZÁÉÍÓÚ]{1}([a-zñáéíóú]+){2,})?$/)]),
    correo_electronico: new FormControl('',[Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/)]),
    contrasenia: new FormControl('',[Validators.required, Validators.pattern('')])
  });

  //nombres: string
  //apellidos: string
  //correo_electronico: string
  //contrasenia: string
  
  tipo_identificacion: string
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

  registrar_usuario()
  {
    var contrasenia = btoa(this.ingresarForm.controls.contrasenia.value);
    this.ciudadanoService.postRegistrarCiudadano(this.ingresarForm.controls.cedula.value, this.ingresarForm.controls.nombres.value, this.ingresarForm.controls.apellidos.value, contrasenia, this.ingresarForm.controls.correo_electronico.value).subscribe(
      recibido =>{
        this.dato_envio = recibido;
        this.abrirDialog(this.dato_envio.mensaje)
      }
    )
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
      this.abrirDialog("NO-CEDULA")
    }else
    {
      this.registrar_usuario()
    }
  }

  validarRUC()
  {    
    var coeficiente = []
    var identificador = parseInt(this.ingresarForm.controls.cedula.value.charAt(2));
    console.log("DIJITO VERIFICADOR DE TIPO IGUAL A: ",identificador)

    //COMPROBACION DE RUC DE PERSONA NORMAL
    if(identificador<6)
    {
      var id = this.ingresarForm.controls.cedula.value.substring(0,10)
      var suma = 0
      var numero
      var x

      for (let i = 0; i < id.length; i++) 
      {
        numero = parseInt(id.charAt(i));

        if((i+1)%2 != 0)
        {
          x = numero * 2;
          if(x>9)
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
        this.abrirDialog("NO-RUC")
      }else
      {
        this.registrar_usuario()
      }
    }

    //COMPROBACION DE RUC DE PERSONA JURIDICA
    if(identificador==9)
    {
      coeficiente = [4,3,2,7,6,5,4,3,2]
      var id = this.ingresarForm.controls.cedula.value.substring(0,10)

      var suma = 0
      var digito
      var multiplicador
      var resultado = 0;
      var residuo = 0;

      for(let i = 0; i < coeficiente.length ; i++)
      {
        digito = parseInt(id.charAt(i));
        multiplicador = coeficiente[i]
        suma = suma + (digito*multiplicador)
      }

      residuo = suma%11;

      var resta = 11 - residuo

      if (resta == parseInt(this.ingresarForm.controls.cedula.value.charAt(9)))
      {
        this.registrar_usuario()
      }else
      {
        this.abrirDialog("NO-RUC")
      }
    }

    //VERIFICADOR DE RUC DE PERSONA PUBLICA
    if(identificador==6)
    {
      coeficiente = [3,2,7,6,5,4,3,2]
      var id = this.ingresarForm.controls.cedula.value.substring(0,9)

      var suma = 0
      var digito
      var multiplicador
      var resultado = 0
      var residuo = 0

      for (let i = 0; i < coeficiente.length; i++)
      {
        digito = parseInt(id.charAt(i));
        multiplicador = coeficiente[i]
        suma = suma + (digito*multiplicador)
      }

      residuo = suma%11;

      var resta = 11 - residuo

      if (resta == parseInt(this.ingresarForm.controls.cedula.value.charAt(8)))
      {
        this.registrar_usuario()
      }else
      {
        this.abrirDialog("NO-RUC")
      }
    }
  }

  validar_y_registrar()
  {
    if(this.ingresarForm.controls.cedula.invalid || this.ingresarForm.controls.nombres.invalid || this.ingresarForm.controls.apellidos.invalid || this.ingresarForm.controls.correo_electronico.invalid || this.ingresarForm.controls.contrasenia.invalid)
    {
      this.abrirDialog("NO-CREDENCIALES")
    }else
    {
      if(this.tipo_identificacion !== undefined)
      {
        if(this.tipo_identificacion == 'cedula')
        {
          this.ValidarCedula()
        }

        if(this.tipo_identificacion == 'ruc')
        {
          this.validarRUC()
        }

        if(this.tipo_identificacion == 'pasaporte')
        {
          this.registrar_usuario()
        }
      }else
      {
        this.abrirDialog("SIN-TIPO")
      }
    }
  }

  public hasError = (controlName:string, errorName: string) =>{
    return this.ingresarForm.controls[controlName].hasError(errorName);
  }
}

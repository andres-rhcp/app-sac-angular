import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  respuesta: string;
}

@Component({
  selector: 'app-dialog-ciudadano',
  templateUrl: './dialog-ciudadano.component.html',
  styleUrls: ['./dialog-ciudadano.component.css']
})

export class DialogCiudadanoComponent implements OnInit 
{
  dato: string;

  constructor(public dialogRef: MatDialogRef<DialogCiudadanoComponent>, private route: Router, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: DialogData) 
  {
    this.dato = this.data.respuesta;
    console.log(this.dato)
  }

  ngOnInit() {
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
}

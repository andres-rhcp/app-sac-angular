import { Component, Inject, OnInit } from '@angular/core';
import { ServidorService } from '../../_services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';

export interface openRequisitos {
  id;
  nombre_tramite: string;
  titulo_grupo: string;
  campo_nombre: string;
}

@Component({
  selector: 'app-requisitos',
  templateUrl: './requisitos.component.html',
  styleUrls: ['./requisitos.component.css']
})
export class RequisitosComponent {

  id;
  nombre_tramite: string;
  titulo_grupo: string;
  campo_nombre: string;

  displayedColumns: string[] = ['titilo_grupo', 'campo_nombre'];
  dataServidores: openRequisitos[] = [];
  dataSource = new MatTableDataSource<openRequisitos>(this.dataServidores);

  constructor(
    private servidorService: ServidorService,
    @Inject(MAT_DIALOG_DATA) public data: openRequisitos){}

  ngOnInit() {
    console.log(this.id)
    this.servidorService.getRequisitosByTramiteId(this.data.id)
    .pipe(first()).subscribe(data => { 
      this.dataSource = new MatTableDataSource(data);
      console.log(data)
      }, error => {
        console.log(error);
      });
  }
}
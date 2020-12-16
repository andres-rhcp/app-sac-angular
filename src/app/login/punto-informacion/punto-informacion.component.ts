import { Component, OnInit } from '@angular/core';
import { ServidorService } from '../../_services';
import { MatDialog } from '@angular/material';
import { RequisitosComponent } from '../requisitos/requisitos.component'
@Component({
  selector: 'app-punto-informacion',
  templateUrl: './punto-informacion.component.html',
  styleUrls: ['./punto-informacion.component.css']
})
export class PuntoInformacionComponent implements OnInit {

  lista = [];
  conversion: any;

  constructor(
    private servidorService: ServidorService,
    private dialog: MatDialog) {
  }


  ngOnInit() {
    this.servidorService.getPuntoInformacionAll().subscribe(data => {
      this.conversion = data;
      this.lista = this.conversion;
    });
  }

  openRequisitos(item): void {
    const dialogRef = this.dialog.open(RequisitosComponent, {
      width: '500px',
      height: '450px',
      data: {
        tittle: 'Requisitos', message: 'Lista de requisitos', id: item.id,
        panelClass: 'my-class'
      }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

}

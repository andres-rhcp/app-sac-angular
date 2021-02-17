import { Component, OnInit } from '@angular/core';
import { ServidorService, ConstantsService } from '../../_services';
import { MatDialog } from '@angular/material';
import { RequisitosComponent } from '../requisitos/requisitos.component'
@Component({
  selector: 'app-punto-informacion',
  templateUrl: './punto-informacion.component.html',
  styleUrls: ['./punto-informacion.component.css']
})
export class PuntoInformacionComponent implements OnInit {

  lista = [];
  lista2 = [];
  departamentos = [];
  conversion: any;
  buscar: String;

  constructor(
    private servidorService: ServidorService,
    public constantsService: ConstantsService,
    private dialog: MatDialog) {

  }

  ngOnInit() {
    this.extraerDatos()
  }


  extraerDatos() {
    this.servidorService.getTramitesAllDepartamentos().subscribe(data => {
      this.conversion = data;
      this.lista = this.conversion;
      this.lista2 = this.lista;
    });
  }

  comparacionGob() {

  }

  limpiarListaDepartamentos() {
    this.departamentos.push("Todos")
    for (var i = 0; i < this.lista.length; i++) {
      this.departamentos.push(this.lista[i].nombre_departamento)
    }
    for (var i = this.departamentos.length - 1; i >= 0; i--) {
      if (this.departamentos.indexOf(this.departamentos[i]) !== i) this.departamentos.splice(i, 1);
    }
  }

  openRequisitos(item): void 
  {
    const dialogRef = this.dialog.open(RequisitosComponent, {
      width: '2000px',
      height: '2900px',
      data: {
        tittle: 'Requisitos', 
        message: 'Lista de requisitos', 
        id: item.id, 
        ref_docum: item.ref_docum,
        nombre_tramite: item.nombre_tramite,
        enlace_gob: item.enlace_gob,
        panelClass: 'my-class'
      }
    });
    dialogRef.afterClosed().subscribe(result => { });
  }

  busqueda(event: Event) {
    const filtarBusqueda = [];
    this.buscar = (event.target as HTMLInputElement).value;
    this.buscar = this.buscar.toUpperCase();
    this.lista = this.lista2;

    for (var i = 0; i < this.lista.length; i++) {
      if (this.lista[i].nombre_tramite.indexOf(this.buscar, 0) != -1) {
        filtarBusqueda.push(this.lista[i]);
      }
    }
    this.lista = filtarBusqueda;
  }

  BusquedaPorDepartamento(item): void {
    const Busqueda = [];
    console.log(item)
    if (item == 'Todos') {
      this.lista = this.lista2;
    } else {
      for (var i = 0; i < this.lista.length; i++) {
        if (this.lista[i].nombre_departamento == item) {
          Busqueda.push(this.lista[i]);
        }
      }
      this.lista = Busqueda;
    }
    console.log(this.lista)
  }
}

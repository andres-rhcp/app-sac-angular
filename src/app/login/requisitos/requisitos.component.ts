import { Component, Inject, OnInit } from '@angular/core';
import { ServidorService, PrintService} from '../../_services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';

export interface openRequisitos 
{
  id;
  ref_docum;
  nombre_tramite: string;
  descripcion_requisito: string;
  enlace_gob: string;
}

@Component({
  selector: 'app-requisitos',
  templateUrl: './requisitos.component.html',
  styleUrls: ['./requisitos.component.css']
})
export class RequisitosComponent 
{

  id;
  ref_docum;
  nombre_tramite: string;
  enlace_gob: string;
  descripcion_requisito: string;
  requisitos_gobierno: any;
  ref: any;
  url_gobierno: any;

  displayedColumns: string[] = ['descripcion_requisito'];
  dataServidores: openRequisitos[] = [];
  dataSource = new MatTableDataSource<openRequisitos>(this.dataServidores);

  constructor(
    public printService: PrintService,
    private servidorService: ServidorService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: openRequisitos)
    {
      this.id = this.data.id
      this.ref_docum = this.data.ref_docum
      this.enlace_gob = this.data.enlace_gob
      this.nombre_tramite=this.data.nombre_tramite
    }

  ngOnInit() {
    
    
    console.log(this.nombre_tramite)
    console.log(this.ref_docum)
    console.log(this.enlace_gob)

    //this.requisitosMunicipio(),
    //this.consumo()
  }

  requisitosMunicipio()
  {
    this.servidorService.getRequisitosByTramiteId(this.data.id)
    .pipe(first()).subscribe(data => { 
      this.dataSource = new MatTableDataSource(data);
      console.log(data)
      }, error => {
        console.log(error);
      });
  }

  getRequisitosGob(){
    this.servidorService.getrequisitosByTramiteGob(this.data.ref_docum).subscribe(
      dato => {
        this.requisitos_gobierno = dato
        this.url_gobierno = this.requisitos_gobierno[0].url
        console.log(this.requisitos_gobierno)   
      })
  } 

  consumo(){
    if (this.data.ref_docum != null){
      this.getRequisitosGob()
    }else{
      this.requisitosMunicipio()
    }
  }

  cerrarDialog(){
    this.dialog.closeAll();
  }

  onPrintInvoice() {
    const invoiceIds = [this.id, '102'];
    window.print();
    // this.printService
    //   .printDocument('requisitos', invoiceIds);
  }
}
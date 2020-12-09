import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { LoadingService, ServidorService, SnackBarService, ConstantsService, SharingDataService, DialogService } from '../../_services';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChip, MatTooltipModule } from '@angular/material';
import { DialogComponent } from '../../_components/dialog/dialog.component';
import { HttpParams } from '@angular/common/http'
import {SelectionModel} from '@angular/cdk/collections';
// import { Socket } from 'ngx-socket-io';
import { FacturaDetallesComponent } from '../factura-detalles/factura-detalles.component';
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-formas-pago',
  templateUrl: './formas-pago.component.html',
  styleUrls: ['./formas-pago.component.css']
})
export class FormasPagoComponent implements OnInit {

  animal: string;
  name: string;
  result: string = '';
 
  // respuesta: string = '';
  displayedColumns: string[] = [ 'id_forma_pago', 'forma_pago', 'cantidadServidor',  'cantidadFarmacia','diferenciaCantidad', 'totalServidor','totalFarmacia', 'diferenciaTotal'];
  dataServidores: ServidorElement[] = [];
  dataSource = new MatTableDataSource<ServidorElement>(this.dataServidores);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  length: number = 0;
  pageSize: number = this.constantsService.pageSizeDefault;
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<ServidorElement>(true, []);
  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    
    // private socket: Socket,
    private router: Router,
    private loadingService: LoadingService,
    // private dialog: MatDialog,
    private servidorService: ServidorService,
    private snackBarService: SnackBarService,
    public constantsService: ConstantsService,
    private sharingDataService: SharingDataService,
    public dialog: MatDialog,
  ) { 

    this.sharingDataService.dataArray("prueba");

  }

  cargarFormasPago(evt?: any) {
    let offset = 0;
    let limit = 0;
    let tabla;
    if (evt) {
      let pageSize = evt.pageSize;
      let pageIndex = evt.pageIndex;
      offset = pageSize * pageIndex;
      limit = pageSize;
      this.constantsService.pageSizeDefault = pageSize;
    }
    else {
      limit = this.constantsService.pageSizeDefault;
      offset = 0;
    }
    this.loadingService.show();
    this.servidorService.getFormasPagoServidor(this.sharingDataService.dataVentas)
      .pipe(first())
      .subscribe(
        respuesta => {
          if(respuesta.length>0)
          {
          tabla = respuesta;
          this.dataSource =  new MatTableDataSource(tabla);
          this.dataSource.paginator = this.paginator;
          var auxiliar = this.sharingDataService.dataVentas;
          console.log(this.sharingDataService.dataVentas+" - "+this.sharingDataService.ipOficina)
            this.servidorService.getFormasPagoFarmacia(this.sharingDataService.dataVentas, this.sharingDataService.ipOficina).pipe(first()).subscribe(
              respuesta1 => {
                console.log("element*");
                  tabla.forEach(element => {
                  console.log("element");
                  console.log(element);
                      respuesta1.forEach(e => {                    
                        this.dataSource.paginator = this.paginator;
                        console.log("1");
                        console.log(e);
                        if(element.id_forma_pago === e.id_forma_pago)
                        { 
                          console.log("2");
                          element.cantidadFarmacia = e.cantidad;
                          element.totalFarmacia = e.total;
                          let number_parsed1: any = parseFloat(element.total).toFixed(2);
                          let number_parsed2: any = parseFloat(e.total).toFixed(2);
                          element.totalFarmacia = number_parsed2;
                          element.diferenciaTotal = number_parsed1-number_parsed2;
                          console.log(number_parsed1+"-"+number_parsed2+"= "+(number_parsed1-number_parsed2));
                          this.dataSource.paginator = this.paginator;
                        } 
                    });
                });
            })
          this.loadingService.hide();
          }else
          {
            this.dialogRef.close();
            this.loadingService.hide();
            this.snackBarService.openSnackBar('No existe información para la oficina.', 'error', 'Error');
          }
        },
        error => {
          this.snackBarService.openSnackBar('Error al obtener oficinas.', 'error', 'Error');
          this.loadingService.hide();
        });
  }

seleccionarOficinas()
{
  this.sharingDataService.data=this.selection.selected;
  console.log(this.selection.selected);
}

  crearServidor() {
    //limpiar data del servicio
    this.sharingDataService.data = null;
    this.router.navigate([{ outlets: { componentes: 'crear-servidor' } }]);
  }

  aceptarSeleccionados()
  {
    //var this.selection.selected
  }

  ngOnInit() {
    this.cargarFormasPago();   
   
  }

  ngAfterViewInit() {
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

      /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
    }
  
    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: ServidorElement): string {
      if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Oficina}`;
    }
}



export interface ServidorElement {
  Oficina: string;
  vtf_serie_factura: string;
  NOMBRE_SUCURSAL: string;
  NOMBRE: string;
  IP: string;
  AUXILIAR: string;
}





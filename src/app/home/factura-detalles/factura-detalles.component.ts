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
import { element } from 'protractor';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-tabla-oficinas',
  templateUrl: './factura-detalles.component.html',
  styleUrls: ['./factura-detalles.component.css']
})
export class FacturaDetallesComponent implements OnInit {

  animal: string;
  name: string;
  result: string = '';
 
  // respuesta: string = '';
  displayedColumns: string[] = [ 'vtd_codigo_material', 'total', 'totalFarmacia', 'diferencia'];
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
    private servidorService: ServidorService,
    private snackBarService: SnackBarService,
    public constantsService: ConstantsService,
    private sharingDataService: SharingDataService,
    public dialog: MatDialog,
  ) { 

    this.sharingDataService.dataArray("prueba");
  }

  cargarListaDetalles(evt?: any) {
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
    this.servidorService.getFacturasNotasCDetalleFacturaServidor(this.sharingDataService.dataVentas,this.sharingDataService.facturaVentas)
      .pipe(first()).subscribe(respuestaServidor => {
          if(respuestaServidor.length>0)
          {
            tabla = respuestaServidor;
            this.servidorService.getFacturasNotasCDetalleFacturaFarmacia(this.sharingDataService.facturaVentas, this.sharingDataService.numero_factura, this.sharingDataService.ipOficina)
            .pipe(first()).subscribe(respuestaFarmacia => {
              let bandera = "NO";
              respuestaFarmacia.forEach(elementF => {
                console.log(elementF)
                tabla.forEach(elementS => {
                  if(elementS.vtd_codigo_material === elementF.codigo_producto)
                  {
                    elementS.totalFarmacia = elementF.precio_total;
                    bandera = "SI";
                  }
                });
                if(bandera === "NO")
                {
                  var file = {vtf_serie_factura: this.sharingDataService.facturaVentas, vtd_codigo_material: elementF.codigo_producto, vtf_oficina: '', vtf_fecha_factura:'', vtd_total:'', totalFarmacia:elementF.precio_total};
                  tabla.push(file);
                  console.log(elementF.precioTotal);
                  console.log(tabla);
                  this.dataSource.paginator = this.paginator;
                }
              });

            })
            this.dataSource.paginator = this.paginator;
            this.dataSource =  new MatTableDataSource(tabla);
            this.dataSource.paginator = this.paginator;
            this.loadingService.hide();
          }else
          {
            this.dialogRef.close();
            this.loadingService.hide();
            this.snackBarService.openSnackBar('No existe información para la factura seleccionada.', 'error', 'Error');
          }
        },
        error => {
          this.snackBarService.openSnackBar('Error al obtener detalles de factura.', 'error', 'Error');
          this.loadingService.hide();
        });
  }

  ngOnInit() {
    this.cargarListaDetalles();   
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





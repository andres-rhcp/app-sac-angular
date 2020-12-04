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
import { TablaOficinasComponent } from '../tabla-oficinas/tabla-oficinas.component';
import { Oficina } from 'src/app/_models';
import { FacturaDetallesComponent } from '../factura-detalles/factura-detalles.component';
import { VentaDetallesComponent } from '../venta-detalles/venta-detalles.component';
import { FormasPagoComponent } from '../formas-pago/formas-pago.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'cuadre-facturas',
  templateUrl: './cuadre-facturas.component.html',
  styleUrls: ['./cuadre-facturas.component.css']
})
export class CuadreFacturasComponent implements OnInit {

  animal: string;
  name: string;
  result: string = '';
  oficina: Oficina;
  // respuesta: string = '';
  displayedColumns: string[] = [ 'Oficina','Nombre',  'ofi_codigo_auxiliar', 'cantidadServidor', 'cantidadFarmacia', 'diferenciaCantidad', 'totalServidor',  'totalFarmacia',  'diferenciaTotal', 'action', 'pago','estado'];
  dataServidores: ServidorElement[] = [];
  dataSource = new MatTableDataSource<ServidorElement>(this.dataServidores);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  length: number = 0;
  pageSize: number = this.constantsService.pageSizeDefault;
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  constructor(
    // private socket: Socket,
    private router: Router,
    private loadingService: LoadingService,
    // private dialog: MatDialog,
    private servidorService: ServidorService,
    private snackBarService: SnackBarService,
    public constantsService: ConstantsService,
    private sharingDataService: SharingDataService,
    public dialog: MatDialog,
  ) { }

   ngOnInit() {

    // this.cargarListaTablas();    
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  openDialog(element): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '340px',
      data: { title: 'Mensaje', message: '¿Está seguro de sincronizar esta tabla?' },
      panelClass: 'my-class'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'OK') {
        // this.loadingService.show();
        console.log('Hola');
        element.estado = 'hourglass_empty';  
        this.dataSource.paginator = this.paginator;
        this.servidorService.sincronizarTabla( element.tablaDestino )
        .pipe(first())
        .subscribe(
          respuesta => {
            console.log(respuesta);
            if(respuesta.mensaje=='OK')
            {
              element.estado = "done";  
              element.ok = "OK";          
              // this.snackBarService.openSnackBar('La tabla se sincronizó correctamente.', 'error', 'Error');
            }
            else{
              element.estado = respuesta.mensaje;
              element.no = "OK";
              // this.snackBarService.openSnackBar(respuesta.mensaje, 'error', 'Error');
            }
            this.dataSource.paginator = this.paginator;
            // this.loadingService.hide();
          },
          error => {
            // this.loadingService.hide();
            this.snackBarService.openSnackBar('Ocurrió un error al sincronizar tabla!', 'error', 'Error');
          });
      }
    });    
  }

  openDialogFacturaDetalles(): void {

    const dialogRef = this.dialog.open(FacturaDetallesComponent, {
      width: '840px',
      data: {title:"Detalles", tablaOrigen:'', id:'',tablaDestino: '', descripcion: '', rutaServicio: ''},
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.tabla.id = 0;
      // this.tabla.tablaOrigen = result.tablaOrigen;
      // this.tabla.tablaDestino = result.tablaDestino;
      // this.tabla.descripcion = result.descripcion;
      // this.tabla.rutaServicio = result.rutaServicio;
      // this.tabla.estado = result.estado;  
      // this.tabla.usuarioCreacion = "cdelgado";
      // console.log(this.tabla);
 
      // if (this.tabla != null) {
      //   this.loadingService.show();
      //   this.servidorService.crearTabla(this.tabla)
      //   .pipe(first())
      //   .subscribe(
      //     respuesta => {
      //       if(respuesta.mensaje=='OK')
      //       {
      //         this.snackBarService.openSnackBar('La tabla se creó correctamente.', 'error', 'Error');
      //       }
      //       else{
      //         this.snackBarService.openSnackBar(respuesta.mensaje, 'error', 'Error');
      //       }
      //       this.cargarListaTablas();
      //       this.dataSource.paginator = this.paginator;
      //       this.loadingService.hide();
      //     },
      //     error => {
      //       this.loadingService.hide();
      //       this.snackBarService.openSnackBar('Ocurrió un error al crear tabla!', 'error', 'Error');
      //     });
      // }

    });
  }

 

 openDialogOficinas() {
    const dialogRef = this.dialog.open(TablaOficinasComponent, {
      width: '840px',
      data: {title:"Selecciones oficinas"},
    });
    var oficinasSeleccionadas;
    dialogRef.afterClosed().subscribe(result => {
      oficinasSeleccionadas = this.sharingDataService.data; 
      this.sharingDataService.data = null;
      this.dataSource =  new MatTableDataSource(oficinasSeleccionadas);
      this.dataSource.paginator = this.paginator;
       oficinasSeleccionadas.forEach(ofi => {    
      if(ofi.AUXILIAR !== null) 
      {
          this.servidorService.getFacturasNotasCServidor(ofi.AUXILIAR).pipe(first()).subscribe(
          respuesta => {
          respuesta.forEach(ca => {
            ofi.cantidad = ca.cantidad; 
            ofi.total = ca.total; 
          });
          ofi.estado = 'hourglass_empty'; 
          ofi.cantidadFarmacia="--";                           
          ofi.totalFarmacia="--"; 
          this.dataSource.paginator = this.paginator;
          this.servidorService.getFacturasNotasCFarmacias(ofi.AUXILIAR).pipe(first()).subscribe(
            respuesta1 => {
          //   this.socket.on("proceso-terminado", (r) =>
          //   {
          //     console.log("respuesta")
          //     console.log(r);
          //     // let [AUXILIAR, IP,NOMBRE, NOMBRE_SUCURSAL, OFICINA,SUCURSAL,cantidad,cantidadFarmacia,estado,total, totalFarmacia] = r;
          //       r.forEach(e => {                    
          //         this.dataSource.paginator = this.paginator;                
          //         if(ofi.OFICINA === e.Oficina)
          //         { 
          //           ofi.cantidadFarmacia=e.cantidad;                           
          //           ofi.totalFarmacia=e.total;
          //           ofi.estado = "done";              
          //           this.dataSource.paginator = this.paginator;
          //         }                                 
          //     });
          //     if(r.length==0)
          //     {
          //       ofi.estado="cancel";
          //       this.dataSource.paginator = this.paginator;
          //     }
             
          //   })
          })
         })
      }
    });
    });
 
  }

openDialogVentasDetalles(element): void {
          this.sharingDataService.dataVentas = element.AUXILIAR;  
          this.sharingDataService.ipOficina = element.IP; 
          const dialogRef = this.dialog.open(VentaDetallesComponent, {
            width: '800px',
            data: { title: 'Detalles de ventas', message: 'Detalles de ventas'},
            panelClass: 'my-class'
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result == 'OK') {
                }
                  this.dataSource.paginator = this.paginator;
                },
                error => {
                  this.snackBarService.openSnackBar('Ocurrió un error al sincronizar tabla!', 'error', 'Error');
                });
  }   

  openDialogFormasPago(element): void {
    this.sharingDataService.dataVentas = element.AUXILIAR;  
    this.sharingDataService.ipOficina = element.IP; 
    const dialogRef = this.dialog.open(FormasPagoComponent, {
      width: '700px',
      data: { title: 'Formas pago', message: 'Formas pago'},
      panelClass: 'my-class'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'OK') {
          }
            this.dataSource.paginator = this.paginator;
          },
          error => {
            this.snackBarService.openSnackBar('Ocurrió un error al obtener información!', 'error', 'Error');
          });
}   
}





export interface ServidorElement {
  id: number;
  tablaDestino: string;
  descripcion: string;
  rutaServicio: string;
  usuarioCreacion: string;
  fechaCreacion: string;
  estado: string;
}





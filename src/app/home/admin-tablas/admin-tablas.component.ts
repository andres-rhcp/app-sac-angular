import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { LoadingService, ServidorService, SnackBarService, ConstantsService, SharingDataService, DialogService } from '../../_services';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogNewComponent } from '../../_components/dialog-new/dialog-new.component';
import { DialogEditComponent } from '../../_components/dialog-edit/dialog-edit.component';
import { DialogComponent } from '../../_components/dialog/dialog.component';
import { HttpParams } from '@angular/common/http'
import { SelectionModel } from '@angular/cdk/collections';
import { CrearTablaComponent } from '../crear-tabla/crear-tabla.component'
import { EditarTablaComponent } from '../editar-tabla/editar-tabla.component'
import { Tablas } from 'src/app/_models';
export interface DialogData {
  tablaOrigen: string;
  tablaDestino: string;
  descripcion: string;
}

@Component({
  selector: 'admin-tablas.component',
  templateUrl: './admin-tablas.component.html',
  styleUrls: ['./admin-tablas.component.css']
})
export class AdminTablasComponent implements OnInit {

  tablaOrigen: string;
  tablaDestino: string;
  descripcion: string;
  rutaServicio: string;
  result: string = '';

  tabla: Tablas = new Tablas();
  // respuesta: string = '';
  displayedColumns: string[] = ['psm_id_pago', 'psm_fecha_transaccion',
    'psm_valor', 'psm_campo1',
    'psm_campo2', 'psm_campo3', 'psm_campo4','psm_estado', 'ver', 'aceptar', 'rechazar'];
  dataServidores: ServidorElement[] = [];
  dataSource = new MatTableDataSource<ServidorElement>(this.dataServidores);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  length: number = 0;
  pageSize: number = this.constantsService.pageSizeDefault;
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<ServidorElement>(true, []);
  constructor(
    private router: Router,
    private loadingService: LoadingService,
    // private dialog: MatDialog,
    private servidorService: ServidorService,
    private snackBarService: SnackBarService,
    public constantsService: ConstantsService,
    private sharingDataService: SharingDataService,
    public dialog: MatDialog
  ) { }

  cargarListaTablas(evt?: any) {
    console.log('ingreso metodo')
    let offset = 0;
    let limit = 0;
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
    this.servidorService.getAllPagosByEstado('INGRESADO')
      .pipe(first())
      .subscribe(
        respuesta => {
          this.dataSource = new MatTableDataSource(respuesta);
          console.log(respuesta);
          this.loadingService.hide();
        },
        error => {
          this.snackBarService.openSnackBar('Error al obtener información de pagos.', 'error', 'Error');
          this.loadingService.hide();
        });
  }

  ngOnInit() {
    this.cargarListaTablas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openNewDialog(): void {
    const dialogRef = this.dialog.open(EditarTablaComponent, {
      width: '540px',
      data: { title: "Crear tabla", tablaOrigen: '', id: '', tablaDestino: '', descripcion: '', rutaServicio: '' },
    });
    dialogRef.afterClosed().subscribe(result => {
      result.usuarioCreacion = "cdelgado";
      if (this.tabla != null) {
        this.loadingService.show();
        this.servidorService.crearTabla(result)
          .pipe(first()).subscribe(respuesta => {
            if (respuesta.mensaje == 'OK') {
              this.snackBarService.openSnackBar('La tabla se creó correctamente.', 'error', 'Error');
            }
            else {
              this.snackBarService.openSnackBar(respuesta.mensaje, 'error', 'Error');
            }
            this.cargarListaTablas();
            this.dataSource.paginator = this.paginator;
            this.loadingService.hide();
          },
            error => {
              this.loadingService.hide();
              this.snackBarService.openSnackBar('Ocurrió un error al crear tabla!', 'error', 'Error');
            });
      }
    });
  }

  openEditDialog(element): void {
    const dialogRef = this.dialog.open(EditarTablaComponent, {
      width: '540px',
      data: { title: 'Ver archivo', message: 'Ver archivo', nombre: element.psm_campo5 },
      panelClass: 'my-class'
    });
    dialogRef.afterClosed().subscribe(result => {
      result.usuarioCreacion = "cdelgado";
      if (this.tabla != null) {
        delete result.title;
        delete result.message;
        this.loadingService.show();
        this.servidorService.crearEditarTabla(result)
          .pipe(first()).subscribe(respuesta => {
            if (respuesta.mensaje == 'OK') {
              this.snackBarService.openSnackBar('La tabla se modificó correctamente.', 'error', 'Error');
            }
            else {
              this.snackBarService.openSnackBar(respuesta.mensaje, 'error', 'Error');
            }
            this.cargarListaTablas();
            this.dataSource.paginator = this.paginator;
            this.loadingService.hide();
          },
            error => {
              this.loadingService.hide();
              this.snackBarService.openSnackBar('Ocurrió un error al modificar tabla!', 'error', 'Error');
            });
      }
    });
  }

  openDeleteDialog(element): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '340px',
      data: { title: 'Rechazar', message: '¿Está seguro de rechazar este registro de pago?' },
      panelClass: 'my-class'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'OK') {
        this.loadingService.show();
        let registro = {
          id: element.psm_id_pago,
          usuario: "1004567891",
          estado: "DESCARTADO",
          observacion: "Correcto!"
        };
        this.servidorService.updatePagos(registro.id, registro.estado, registro.usuario, null, registro.observacion)
          .pipe(first()).subscribe(respuesta => {
            if (respuesta.mensaje == 'OK') {
              ///ENVIAR EMAIL A CONTRIBUYENTE///
              this.snackBarService.openSnackBar('Operación realizada correctamente.', 'Success', 'Success');
            }
            else {
              this.snackBarService.openSnackBar(respuesta.mensaje, 'error', 'Error');
            }
            this.cargarListaTablas();
            this.dataSource.paginator = this.paginator;
            this.loadingService.hide();
          },
            error => {
              this.loadingService.hide();
              this.snackBarService.openSnackBar('Ocurrió un error al descartar registro de pago!', 'error', 'Error');
            });
      }

    });
  }

  openAceptarDialog(element): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '340px',
      data: { title: 'Aceptar', message: '¿Está seguro de aceptar este registro de pago?' },
      panelClass: 'my-class'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'OK') {
        this.loadingService.show();
        let registro = {
          id: element.psm_id_pago,
          usuario: "1004567891",
          estado: "REVISADO",
          observacion: "Correcto!"
        };
        this.servidorService.updatePagos(registro.id, registro.estado, registro.usuario, null, registro.observacion)
          .pipe(first()).subscribe(respuesta => {
            if (respuesta.mensaje == 'OK') {
              this.snackBarService.openSnackBar('Operación realizada correctamente.', 'Success', 'Success');
            }
            else {
              this.snackBarService.openSnackBar(respuesta.mensaje, 'error', 'Error');
            }
            this.cargarListaTablas();
            this.dataSource.paginator = this.paginator;
            this.loadingService.hide();
          },
            error => {
              this.loadingService.hide();
              this.snackBarService.openSnackBar('Ocurrió un error al realizar operación!', 'error', 'Error');
            });
      }

    });
  }
}

export interface ServidorElement {
  id: number;
  tablaDestino: string;
  descripcion: string;
  rutaServicio: string;
  usuarioCreacion: string;
  fechaCreacion: string
}





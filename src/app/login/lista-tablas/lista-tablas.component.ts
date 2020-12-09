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
import {MatCardModule} from '@angular/material/card';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-lista-tablas',
  templateUrl: './lista-tablas.component.html',
  styleUrls: ['./lista-tablas.component.css']
})
export class ListaTablasComponent implements OnInit {

  animal: string;
  name: string;
  result: string = '';
  // respuesta: string = '';
  displayedColumns: string[] = ['select', 'id', 'tablaOrigen', 'tablaDestino', 'descripcion', 'rutaServicio', 'usuarioCreacion', 'fechaCreacion', 'action', 'estado'];
  dataServidores: ServidorElement[] = [];
  dataSource = new MatTableDataSource<ServidorElement>(this.dataServidores);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  length: number = 0;
  pageSize: number = this.constantsService.pageSizeDefault;
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<ServidorElement>(true, []);
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

  cargarListaTablas(evt?: any) {
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
    this.servidorService.getListaTablas(['ACTIVO'])
      .pipe(first())
      .subscribe(
        respuesta => {
          this.dataSource =  new MatTableDataSource(respuesta);
          console.log(respuesta);
          this.loadingService.hide();
        },
        error => {
          this.snackBarService.openSnackBar('Error al obtener informaciÃ³n de tablas.', 'error', 'Error');
          this.loadingService.hide();
        });
  }
  editarServidor(obj_servidor) {
  }

  crearServidor() {
    //limpiar data del servicio
    this.sharingDataService.data = null;
    this.router.navigate([{ outlets: { componentes: 'crear-servidor' } }]);
  }


  ngOnInit() {

    // this.cargarListaTablas();    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog(element): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '340px',
      data: { title: 'Mensaje', message: '¿Está seguro de sincronizar esta tabla?' },
      panelClass: 'my-class'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'OK') {
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
            }
            else{
              element.estado = respuesta.mensaje;
              element.no = "OK";
            }
            this.dataSource.paginator = this.paginator;
          },
          error => {
            this.snackBarService.openSnackBar('Ocurrió un error al sincronizar tabla!', 'error', 'Error');
          });
      }
    });    
  }

  openDialogSincronizarVarios(): void {  
    var selectedRows = this.selection.selected;
    if(selectedRows.length>0)
    {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '340px',
        data: { title: 'Mensaje', message: '¿Está seguro de sincronizar las tablas seleccionadas?' },
        panelClass: 'my-class'
      });
        dialogRef.afterClosed().subscribe(result => {
          selectedRows.forEach(element => {
          if (result == 'OK') {
            element.estado = 'hourglass_empty';  
            this.dataSource.paginator = this.paginator;
            this.servidorService.sincronizarTabla( element.tablaDestino )
            .pipe(first()).subscribe(respuesta => {
                if(respuesta.mensaje=='OK')
                {
                  element.estado = "done";  
                }
                else{
                  element.estado = respuesta.mensaje;
                }
                this.dataSource.paginator = this.paginator;
                this.loadingService.hide();
              },
              error => {
                this.loadingService.hide();
                this.snackBarService.openSnackBar('Ocurrió un error al sincronizar tablas seleccionadas!', 'error', 'Error');
              });
          }
          });
        });   
        }else
        {
          this.snackBarService.openSnackBar('Por favor seleccione una o más tablas antes de sincronizar!', 'error', 'Error');
        }
  }


    sincronizarTabla(result) {
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
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
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





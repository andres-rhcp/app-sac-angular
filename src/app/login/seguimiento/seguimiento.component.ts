import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { LoadingService, ServidorService, SnackBarService, ConstantsService, SharingDataService, DialogService } from '../../_services';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChip, MatTooltipModule } from '@angular/material';
import { DialogComponent } from '../../_components/dialog/dialog.component';
import { HttpParams } from '@angular/common/http'
import { SelectionModel } from '@angular/cdk/collections';
// import { Socket } from 'ngx-socket-io';
import { MatCardModule } from '@angular/material/card';
import { NodoTramiteComponent } from '../nodo-tramite/nodo-tramite.component';
import { ArbolTramiteComponent } from '../arbol-tramite/arbol-tramite.component';

export interface DialogData {
  animal: string;
  name: string;
  tramite: string; 
}

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {
  tramite: string;
  animal: string;
  name: string;
  result: string = '';
  // respuesta: string = '';
  displayedColumns: string[] = ['codigo_tramite', 'tramite', 'asunto', 'fecha', 'ver'];
  dataServidores: ServidorElement[] = [];
  dataSource = new MatTableDataSource<ServidorElement>(this.dataServidores);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  length: number = 0;
  pageSize: number = this.constantsService.pageSizeDefault;
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
    if (this.tramite == '') {
      this.snackBarService.openSnackBar('¡Ingrese número de trámite!', 'error', 'Error');
    } else {
      this.loadingService.show();
      this.servidorService.getTramitesById(this.tramite)
        .pipe(first())
        .subscribe(
          respuesta => {
            this.dataSource = new MatTableDataSource(respuesta);
            this.dataSource.paginator = this.paginator;
            console.log(respuesta);
            this.loadingService.hide();
            if (JSON.stringify(respuesta).length == 2) {
              this.snackBarService.openSnackBar('¡No se encontró trámite!', 'error', 'Error');
            }

          },
          error => {
            this.snackBarService.openSnackBar('Error al obtener información de trámites.', 'error', 'Error');
            this.loadingService.hide();
          });
    }
  }
  editarServidor(obj_servidor) {
  }

  crearServidor() {
    //limpiar data del servicio
    this.sharingDataService.data = null;
    this.router.navigate([{ outlets: { componentes: 'crear-servidor' } }]);
  }


  ngOnInit() {

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }  


  openEditDialog(element): void {
    const dialogRef = this.dialog.open(ArbolTramiteComponent, {
      width: '740px',
      data: { title: 'Ver archivo', message: 'Ver archivo', tramite: element.codi_barras, codigo_tramite: element.codigo_tramite, asunto:element.asunto },
      panelClass: 'my-class'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
 
export interface ServidorElement {
  codi_barras: string;
  codigo_tramite: string;
  id: number;
  nombres: string;
  asunto: string;
}





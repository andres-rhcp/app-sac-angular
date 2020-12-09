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

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-tabla-oficinas',
  templateUrl: './tabla-oficinas.component.html',
  styleUrls: ['./tabla-oficinas.component.css']
})
export class TablaOficinasComponent implements OnInit {

  animal: string;
  name: string;
  result: string = '';
  // respuesta: string = '';
  displayedColumns: string[] = ['select', 'OFICINA', 'SUCURSAL', 'NOMBRE', 'NOMBRE_SUCURSAL', 'IP', 'AUXILIAR'];
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
    this.servidorService.getOficinas()
      .pipe(first())
      .subscribe(
        respuesta => {
          this.dataSource =  new MatTableDataSource(respuesta);
          this.dataSource.paginator = this.paginator;
          console.log(respuesta);
          this.loadingService.hide();
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

    this.cargarListaTablas();    
  }

  ngAfterViewInit() {
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
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.OFICINA}`;
    }
    onNoClick(): void {
      this.dialogRef.close();
    }

    public doFilter = (value: string) => {
      this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
}

export interface ServidorElement {
  OFICINA: string;
  SUCURSAL: string;
  NOMBRE_SUCURSAL: string;
  NOMBRE: string;
  IP: string;
  AUXILIAR: string;
}





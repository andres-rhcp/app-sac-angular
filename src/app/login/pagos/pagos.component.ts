import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { FileUploadService, LoadingService, ServidorService, SnackBarService, ConstantsService, SharingDataService, DialogService } from '../../_services';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../../_components/dialog/dialog.component';
import { CrearTablaComponent } from '../../home/crear-tabla/crear-tabla.component'
import { HttpParams } from '@angular/common/http'
import { SelectionModel } from '@angular/cdk/collections';
import { FileComponent } from 'src/app/home/file/file.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListaTablasComponent } from '../lista-tablas/lista-tablas.component';
import { EventEmitter } from '@angular/core';
import { MaterialFileUploadComponent } from '../../_components/material-file-upload/material-file-upload.component';
import { formatDate } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})

export class PagosComponent implements OnInit {
  @ViewChild('lab', { static: false }) lab;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  });
  returnUrl: string;
  animal: string;
  name: string;
  result: string = '';
  cedula: string;
  nombres: string;
  apellidos: string;
  impuesto: string;
  valor: string;
  referencia: string;
  email: string;
  fileToUpload: File = null;
  file: string = '';
  link: string = '';
  success: string = '';
  type: string = '';
  @ViewChild(MaterialFileUploadComponent, { static: true }) nombre: string;
  private timerComponent: MaterialFileUploadComponent;
  // respuesta: string = '';
  displayedColumns: string[] = ['id', 'accion', 'tipo', 'objeto', 'mensaje', 'ip', 'usuario', 'fecha'];
  dataServidores: ServidorElement[] = [];
  dataSource = new MatTableDataSource<ServidorElement>(this.dataServidores);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  length: number = 0;
  pageSize: number = this.constantsService.pageSizeDefault;
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<ServidorElement>(true, []);
  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private servidorService: ServidorService,
    private snackBarService: SnackBarService,
    public constantsService: ConstantsService,
    private sharingDataService: SharingDataService,
    private fileUploadService: FileUploadService,
  ) {

    this.route.queryParams.subscribe(params => {
      this.cedula = params['cedula'];
      this.nombres = params['nombres'] + ' ' + params['apellidos'];
      this.apellidos = params['apellidos'];
      this.impuesto = params['impuesto'];
      this.valor = params['valor'];
      this.referencia = params['referencia'];
      this.email = '';
    });
  }

  onClick() {
    // const fileUpload = this.fileUpload.nativeElement; fileUpload.onchange = () => {
    //   for (let index = 0; index < fileUpload.files.length; index++) {
    //     const file = fileUpload.files[index];
    //     this.files.push({ data: file, inProgress: false, progress: 0 });
    //   }
    //   this.uploadFiles();
    // };
    // fileUpload.click();
  }

  cargarListaLogs(evt?: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: { title: 'Mensaje', message: '¿Está seguro de registrar pago?' },
      panelClass: 'my-class'
    });
    dialogRef.afterClosed().subscribe(result => {
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
      this.servidorService.getListaLogs()
        .pipe(first())
        .subscribe(
          respuesta => {

            this.dataSource = new MatTableDataSource(respuesta);
            this.dataSource.paginator = this.paginator;
            console.log(respuesta);
            this.loadingService.hide();
          },
          error => {
            this.snackBarService.openSnackBar('Error al registrar pago.', 'error', 'Error');
            this.loadingService.hide();
          });
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

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  }
  ngAfterViewInit() {

  }

  openDialog(element): void {
    if (this.success) {
      if (this.email != null && this.email != '') {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '400px',
          data: { title: 'Mensaje', message: '¿Está seguro de ingresar el pago?' },
          panelClass: 'my-class'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result == 'OK') {
            this.loadingService.show();
            let dia = formatDate(new Date(), 'dd', 'en')
            let mes = formatDate(new Date(), 'MM', 'en')
            let anio = formatDate(new Date(), 'yyyy', 'en')
            let ext = '';
            if (this.type == 'image/jpeg')
              ext = '.jpg'
            if (this.type == 'image/png')
              ext = '.png'
            if (this.type == 'application/pdf')
              ext = '.pdf'
            var nombre = this.cedula.trim() + '-' + this.referencia + '-' + dia + anio + ext;
            console.log(nombre);
            this.servidorService.insertPago(this.cedula, this.nombres, this.apellidos, this.email, this.impuesto, this.valor, this.referencia, nombre)
              .pipe(first())
              .subscribe(
                respuesta => {

                  if (respuesta.mensaje == 'OK') {

                    this.servidorService.saveFile(nombre, this.link)
                      .pipe(first())
                      .subscribe(
                        respuesta => {
                          if (respuesta.mensaje == 'OK') {
                            console.log('ingresa 2')
                          }
                          else {
                            this.snackBarService.openSnackBar(respuesta.mensaje, 'error', 'Error');
                          }
                          this.loadingService.hide();
                        },
                        error => {
                          this.loadingService.hide();
                          this.snackBarService.openSnackBar('!Ocurrió un error al ingresar pago!', 'error', 'Error');
                        });

                    this.cedula = '';
                    this.nombres = '';
                    this.apellidos = '';
                    this.impuesto = '';
                    this.valor = '';
                    this.referencia = '';
                    this.email = '';
                    this.file = '';
                    this.link = '';
                    this.success = '';
                    this.router.navigate(['/final']);
                  }
                  else {
                    this.snackBarService.openSnackBar(respuesta.mensaje, 'error', 'Error');
                  }
                  this.loadingService.hide();
                },
                error => {
                  this.loadingService.hide();
                  this.snackBarService.openSnackBar('!Ocurrió un error al ingresar pago!', 'error', 'Error');
                });
          }

        });
      } else {
        this.snackBarService.openSnackBar('¡Por favor ingresar email!', 'error', 'Warning');
      }
    } else {
      this.snackBarService.openSnackBar('¡Por favor subir archivo', 'error', 'Warning');
    }
  }

  openDialogPayment(element): void {
    // if (this.success) {
      window.location.href = 'assets/pay.html';
    // } 
    // else {
    //   this.snackBarService.openSnackBar('¡Por favor subir archivo', 'error', 'Warning');
    // }-------------------------------------------
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
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onFileComplete(data: any) {

    this.snackBar.open('El archivo ha sido cargado correctamente.', '', {
      duration: 1000,
      verticalPosition: 'bottom',
      horizontalPosition: 'left',
    });
    this.file = data.expiry;
    this.link = data.link;
    this.success = data.success;
    this.type = data.key;
    console.log(this.type)
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





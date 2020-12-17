import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { LoadingService, ServidorService, SnackBarService, ConstantsService, SharingDataService, DialogService } from '../../_services';
import { first } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from '../../_components/dialog/dialog.component';
@Component({
  selector: 'app-intranet',
  templateUrl: './intranet.component.html',
  styleUrls: ['./intranet.component.css']
})
export class IntranetComponent implements OnInit {

  constructor(private loadingService: LoadingService,
    private dialog: MatDialog,
    private servidorService: ServidorService,
    private snackBarService: SnackBarService,
    public constantsService: ConstantsService,
    private sharingDataService: SharingDataService) { }

  ngOnInit() {
  }

  abrirFieldWeb(element): void {
    
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '400px',
        data: { title: 'Confirmación', message: '¿Está seguro de redirigirse a Fiel Web?' },
        panelClass: 'my-class'
      });
      dialogRef.afterClosed().subscribe(result => {
          // this.loadingService.show();
          this.servidorService.abrirFieldWeb('');
          this.loadingService.hide();
      });
  }

}

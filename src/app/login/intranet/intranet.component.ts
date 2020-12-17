import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { LoadingService, ServidorService, SnackBarService, ConstantsService, SharingDataService, DialogService } from '../../_services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from '../../_components/dialog/dialog.component';
import { map, first } from 'rxjs/operators';
import {CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
@Component({
  selector: 'app-intranet',
  templateUrl: './intranet.component.html',
  styleUrls: ['./intranet.component.css']
})
export class IntranetComponent implements OnInit {
  urlFielWeb:string;
  constructor(private loadingService: LoadingService,
    private dialog: MatDialog,
    private servidorService: ServidorService,
    private snackBarService: SnackBarService,
    public constantsService: ConstantsService,
    private sharingDataService: SharingDataService,
    private router: Router) { }

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
      this.servidorService.abrirFieldWeb(this.constantsService.token)
      .pipe(first())
      .subscribe(
        respuesta => { 
          
          this.urlFielWeb=this.constantsService.urlFielWeb+respuesta.token.toString().split('<ObtenerTokenResult>')[1].toString().split('</ObtenerTokenResult>')[0].toString();
          // window.location.href = this.router.navigate[this.urlFielWeb];
          window.open(this.urlFielWeb, '_blank');
          console.log(this.urlFielWeb)
        });
      this.loadingService.hide();
    });
  }

}

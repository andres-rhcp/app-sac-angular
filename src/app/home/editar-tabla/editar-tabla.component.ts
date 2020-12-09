import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingService, ServidorService, SnackBarService, ConstantsService, SharingDataService, DialogService } from '../../_services';

export interface DialogData {
  animal: string;
  name: string;
  nombre: string;
}

@Component({
  selector: './editar-tabla-component',
  styleUrls: ['./editar-tabla.component.css'],
  templateUrl: './editar-tabla.component.html',
})
export class EditarTablaComponent {

  constructor(
    public dialogRef: MatDialogRef<EditarTablaComponent>,
    private servidorService: ServidorService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.getImageFromService();
  }
  private imageToShow: any;
  private isImageLoading: any;
  getImageFromService() {
    this.isImageLoading = true;
    this.servidorService.getFile(this.data.nombre).subscribe(data => {
      this.createImageFromBlob(data);
      this.isImageLoading = false;
    }, error => {
      this.isImageLoading = true;
      console.log(error);
    });
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
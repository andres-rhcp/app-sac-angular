import { Component, OnInit, Input  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService, ServidorService, SnackBarService, SharingDataService } from '../../_services';
import { first } from 'rxjs/operators';
import { Kushki } from "@kushki/js";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface DialogData {
  origen: string;
  destino: string;
  descripcion: string;
  ruta: string;
}

@Component({
  selector: 'app-crear-tabla',
  templateUrl: './crear-tabla.component.html',
  styleUrls: ['./crear-tabla.component.css']
})
export class CrearTablaComponent implements OnInit {
  @Input() form: FormGroup;
  // tablaForm = new FormGroup({
  //   tablaOrigen: new FormControl('', [Validators.required]),
  //   tablaDestino: new FormControl('', [Validators.required]),
  //   descripcion: new FormControl('', [Validators.required]),
  //   rutaServicio: new FormControl(true, [Validators.required]),

  // });

  origen: string;
  destino: string;
  descripcion: string;
  ruta: string;

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private servidorService: ServidorService,
    private snackBarService: SnackBarService,
    private sharingDataService: SharingDataService,
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document: Document) { }

  ngOnInit() {
   
  }

}

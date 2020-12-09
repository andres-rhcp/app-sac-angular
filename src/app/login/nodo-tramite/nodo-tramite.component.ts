import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingService, ServidorService, SnackBarService, ConstantsService, SharingDataService, DialogService } from '../../_services';
import { first } from 'rxjs/operators';

export interface DialogData {
  animal: string;
  name: string;
  nombre: string;
  codigo: string;

}

@Component({
  selector: './nodo-tramite-component',
  styleUrls: ['./nodo-tramite.component.css'],
  templateUrl: './nodo-tramite.component.html',
})
export class NodoTramiteComponent {
  informacion: any;
  origen_nombres: string;
  origen_form_asunto: string;
  leaf: string;
  fecha: string;
  hora_ingreso: string;
  estado: string;
  destino_nombres: string;
  destino_cargo: string;
  destino_departament: string;
  origen_departament: string;
  origen_tipo_tramite: string;
  origen_tipodoc: string;
  respuesta_observacion: string;
  respuesta_comentariotxt: string;
  fech_tiempo_dias: string;
  fecha_tiempo_atencion: string;
  resp_comentario_anterior: string;
  codigo_documento: string;
  constructor(
    public dialogRef: MatDialogRef<NodoTramiteComponent>,
    private servidorService: ServidorService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.origen_nombres = "INICIO DE TRÁMITE";
    var nodos = this.servidorService.getDocumentoById(this.data.codigo).pipe(first()).subscribe(data => {
      var nodos = JSON.stringify(data, null, "    ");
      data.forEach(nodo => {
        this.origen_nombres = nodo.origen_nombres
        this.origen_form_asunto = nodo.origen_form_asunto
        this.leaf = nodo.leaft
        this.fecha = nodo.fecha
        this.hora_ingreso = nodo.hora_ingreso
        this.estado = nodo.estado
        this.destino_nombres = nodo.destino_nombres
        this.destino_cargo = nodo.destino_cargo
        this.destino_departament = nodo.destino_departament.replace('<BR>','\n');
        this.origen_departament = nodo.origen_departament.replace('<BR>','\n');
        this.origen_tipo_tramite = nodo.origen_tipo_tramite
        this.origen_tipodoc = nodo.origen_tipodoc
        this.respuesta_observacion = nodo.respuesta_observacion
        this.respuesta_comentariotxt = nodo.respuesta_comentariotxt
        this.fech_tiempo_dias = nodo.fech_tiempo_dias
        this.fecha_tiempo_atencion = nodo.fecha_tiempo_atencion
        this.resp_comentario_anterior = nodo.resp_comentario_anterior
        this.codigo_documento = nodo.codigo_documento
      }, error => {
        console.log(error);
      });

    });
  }
}
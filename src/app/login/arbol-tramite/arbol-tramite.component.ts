import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingService, ServidorService, SnackBarService, ConstantsService, SharingDataService, DialogService } from '../../_services';
import * as cytoscape from 'cytoscape';
import { first } from 'rxjs/operators';
import { NodoTramiteComponent } from '../nodo-tramite/nodo-tramite.component';
import { Router } from '@angular/router';

export interface DialogData {
  animal: string;
  name: string; 
  nombre: string;
  tramite: string;
}   
     
@Component({
  selector: './arbol-tramite-component',
  styleUrls: ['./arbol-tramite.component.css'],
  templateUrl: './arbol-tramite.component.html',
})
export class ArbolTramiteComponent {
  cy: any; 
  constructor(

    public dialogRef: MatDialogRef<NodoTramiteComponent>,
    private servidorService: ServidorService,
    public dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {

    this.getImageFromService();
    var nodos = this.servidorService.getTramiteById(this.data.tramite).pipe(first()).subscribe(data => {
      // console.log(JSON.stringify(data, null, "    "))
      var nodos = JSON.stringify(data, null, "    ");

      this.cy = cytoscape({
        container: document.getElementById('cy'),

        boxSelectionEnabled: true,
        autounselectify: true,

        style: cytoscape.stylesheet()
          .selector('node')
          .css({  
            'height': 40,
            'width': 40,
            "text-valign": "center",
            "text-halign": "right",
            'background-image': '/assets/img/formulario.png',
            'background-color': 'white',
            'background-fit': 'cover', 
            'border-color': '#000',
            'border-width': 3,
            'border-opacity': 0.5,
            'label': 'data(id)',
            'font-size': '12px',
            'label-position': 'left',
            'font': 20,
            "background-height": '200px',
            "background-width": '200px',
            'content': 'data(id)', 
            'text-wrap': 'wrap',
            'cursor': 'pointer !important'
          })
          .selector('#inicio')
          .css({
            'background-color': 'white',
            'background-image': '/assets/img/inicio3.png',
          })
          .selector('node')
          .css({
            'border-color': '#e30052',
            'border-sise': '8'
          })
          .selector('node')
          .style({
            'content': 'data(label)'
          })
          .selector('.eating')
          .css({
            'border-color': 'red'
          })
          .selector('.eater')
          .css({
            'border-width': 9
          })
          .selector('edge')
          .css({
            'curve-style': 'bezier',
            'width': 6,
            'target-arrow-shape': 'triangle',
            'line-color': '#ffaaaa',
            'target-arrow-color': '#ffaaaa'
          })
        ,
        layout: {
          name: 'breadthfirst',
          roots: 'node[id = "inicio"]',
          spacingFactor: 1,
          avoidOverlap: true,
          fit: true,
          padding: 50
        }
      });
      var padre = 'inicio';
      var e = {
        nodes: [
          { data: { id: 'inicio', label: ' INICIO' }, renderedPosition: { x: -50, y: -30 } },
        ],
      }
      this.cy.add(e)
      var posy = 45;
      data.forEach(nodo => {
        var e = {
          nodes: [
            {
              data: { id: nodo.id, label: nodo.fecha + ' - ' + nodo.origen_tipo_tramite + '\n' + nodo.destino_departament.replace('<BR>', '\n') },
              position: { x: -50, y: -30 }
            },
          ],
          edges: [
            { data: { source: padre, target: nodo.id } },
          ]
        }
        posy += 65;
        this.cy.add(e)
        padre = nodo.id;
      });
     
      var i = 70;
      this.cy.nodes().layout({
        name: 'preset',
        animate: true,
        fit: false,
        animationDuration: 400,
        transform: (node) => {
          let position = {};
          position.x = node.position('x') + 100;
          position.y = node.position('y') + i;
          i += 70;
          return position;
        } 
      }).run();
      this.cy.on('tap', 'node', e => this.onNodeClicked(e),

      );
      this.cy.resize();

      var collection = this.cy.collection();

    }, error => {
      this.isImageLoading = true;
      console.log(error);
    });
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

  onNodeClicked(e) {
    var node = e.target;
    console.log('tapped ' + node.id());
    if (node.id() != 'inicio') {
      const dialogRef = this.dialog.open(NodoTramiteComponent, {
        width: '740px',
        data: { title: 'Ver archivo', message: 'Ver archivo', codigo: node.id() },
        panelClass: 'my-class'
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
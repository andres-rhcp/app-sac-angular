import { Component, OnInit } from '@angular/core';
import { ServidorService } from '../../_services';


@Component({
  selector: 'app-requisitos',
  templateUrl: './requisitos.component.html',
  styleUrls: ['./requisitos.component.css']
})
export class RequisitosComponent implements OnInit {

  constructor(
    private servidorService: ServidorService ) {
    }

  ngOnInit() {
    
  }

}

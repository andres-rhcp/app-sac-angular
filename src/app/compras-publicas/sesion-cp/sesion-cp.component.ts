import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sesion-cp',
  templateUrl: './sesion-cp.component.html',
  styleUrls: ['./sesion-cp.component.css']
})
export class SesionCpComponent implements OnInit {

  nombres: string
  apellidos: string
  usuario: string

  constructor(private router: Router) {
    this.nombres = (localStorage.getItem ('nombre'));
    this.apellidos = (localStorage.getItem('apellidos'));
    this.usuario = this.nombres + " "+this.apellidos;
   }

  ngOnInit() {
  }

  cerrarsesion(){
    localStorage.clear()
    this.router.navigate(['login-cp'])
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent implements OnInit {

  nombres: string
  apellidos: string
  usuario: string

  constructor(private router: Router) {
    this.nombres = (localStorage.getItem ('nombres'));
    this.apellidos = (localStorage.getItem('apellidos'));
    this.usuario = this.nombres + " "+this.apellidos;
   }

  ngOnInit() {
  }

  cerrarsesion(){
    localStorage.clear()
    this.router.navigate(['compras-publicas/login'])
  }

}

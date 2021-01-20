import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sesion-landingpage',
  templateUrl: './sesion-landingpage.component.html',
  styleUrls: ['./sesion-landingpage.component.css']
})
export class SesionLandingpageComponent implements OnInit 
{
  nombres: string
  apellidos: string
  usuario: string

  constructor(private router: Router) 
  { 
    this.nombres = (localStorage.getItem('nombre'));
    this.apellidos = (localStorage.getItem('apellidos'));
    this.usuario = this.nombres+" "+this.apellidos;
  }

  ngOnInit() 
  { }

  cerrarsesion()
  {
    localStorage.clear()
    this.router.navigate(['login-ciudadano'])
  }

}

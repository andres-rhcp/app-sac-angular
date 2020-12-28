import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SesionLandingpageComponent } from './sesion-landingpage/sesion-landingpage.component';

const routes: Routes = [
  { path: 'ciudadano/landing-page', component: SesionLandingpageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalCiudadanoRoutingModule { }

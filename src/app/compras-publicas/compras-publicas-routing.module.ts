import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { LoginCpComponent } from './login-cp/login-cp.component';
import { SesionCpComponent } from './sesion-cp/sesion-cp.component';


const routes: Routes = [
  {path: 'compras-publicas/login', component: LoginCpComponent},
  {path: 'compras-publicas/menu', component: SesionCpComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasPublicasRoutingModule { }

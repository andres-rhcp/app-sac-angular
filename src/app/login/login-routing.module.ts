import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PagosComponent } from './pagos/pagos.component';
import { ListaTablasComponent } from './lista-tablas/lista-tablas.component';
import { Payment } from './payment/payment.component';
import { TramitesComponent } from './tramites/tramites.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component:LoginComponent },
  { path: 'pagos', component:PagosComponent },
  { path: 'final', component:ListaTablasComponent },
  { path: 'payment', component:Payment },
  { path: 'tramites', component:TramitesComponent },
  { path: 'seguimiento', component:SeguimientoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
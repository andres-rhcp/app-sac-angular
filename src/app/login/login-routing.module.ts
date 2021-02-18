import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PagosComponent } from './pagos/pagos.component';
import { ListaTablasComponent } from './lista-tablas/lista-tablas.component';
import { Payment } from './payment/payment.component';
import { TramitesComponent } from './tramites/tramites.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { IntranetComponent } from './intranet/intranet.component';
import { PuntoInformacionComponent } from './punto-informacion/punto-informacion.component';
import { RequisitosComponent } from './requisitos/requisitos.component';
import { LoginCiudadanoComponent } from '../login/login-ciudadano/login-ciudadano.component';
import { RegistroCiudadanoComponent } from '../login/registro-ciudadano/registro-ciudadano.component';
import { ActivacionCuentaComponent } from '../login/activacion-cuenta/activacion-cuenta.component'


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component:LoginComponent },
  { path: 'pagos', component:PagosComponent },
  { path: 'final', component:ListaTablasComponent },
  { path: 'payment', component:Payment },
  { path: 'tramites', component:TramitesComponent },
  { path: 'seguimiento', component:SeguimientoComponent },
  { path: 'intranet', component:IntranetComponent },
  { path: 'punto-informacion', component:PuntoInformacionComponent},
  { path: 'requisitos', component:RequisitosComponent},
  { path: 'login-ciudadano', component: LoginCiudadanoComponent },
  { path: 'registro-ciudadano', component: RegistroCiudadanoComponent },
  { path: 'activar-cuenta/:cedula', component: ActivacionCuentaComponent }

]; 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }

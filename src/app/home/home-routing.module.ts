import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'
import { ListaTablasComponent } from '../home/lista-tablas/lista-tablas.component';
import { Payment } from '../login/payment/payment.component';
import { ListaLogsComponent } from './lista-logs/lista-logs.component';
// import { ConfirmDialogComponent } from '../_components/dialog/dialog.component';
import { CommonModule } from '@angular/common';
import { AdminTablasComponent } from './admin-tablas/admin-tablas.component';
import { CuadreFacturasComponent } from './cuadre-facturas/cuadre-facturas.component';

const routes: Routes = [
  { path: 'lista-logs', component: ListaLogsComponent, outlet: 'componentes' },
  // { path: 'dashboard', component: DashboardComponent, outlet: 'componentes' },
  { path: 'lista-tablas', component: ListaTablasComponent, outlet: 'componentes' },
  // { path: 'dialog', component: ConfirmDialogComponent, outlet: 'componentes' },
  { path: 'admin-tablas', component: AdminTablasComponent, outlet: 'componentes' },
  { path: 'cuadre-facturas', component: CuadreFacturasComponent, outlet: 'componentes' },
  { path: 'payment', component: AdminTablasComponent, outlet: 'componentes' },
];

@NgModule({
 


  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class HomeRoutingModule { }

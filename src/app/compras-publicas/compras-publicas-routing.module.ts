import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { LoginCpComponent } from './login-cp/login-cp.component';
import { SesionCpComponent } from './sesion-cp/sesion-cp.component';
import { MenuAdminComponent} from './menu-admin/menu-admin.component'
import { PacComponent} from './pac/pac.component'
import { ListaCpComponent } from './lista-cp/lista-cp.component'

const routes: Routes = [
  {path: 'compras-publicas/login', component: LoginCpComponent},
  {path: 'compras-publicas/menu', component: SesionCpComponent,
    children: [
      {path: 'compras-publicas/Pac', component: PacComponent},
      {path: 'compras-publicas/cp', component: ListaCpComponent}
  ]},
  {path: 'compras-publicas/menu-admin', component: MenuAdminComponent,
    children: [
      {path: 'compras-publicas/Pac', component: PacComponent},
      {path: 'compras-publicas/cp', component: ListaCpComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasPublicasRoutingModule { }

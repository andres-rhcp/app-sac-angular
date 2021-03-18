import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprasPublicasRoutingModule } from './compras-publicas-routing.module';
import { LoginCpComponent } from './login-cp/login-cp.component';

import {MatFormFieldModule, MatInputModule, MatRadioModule, MatToolbarModule, MatIconModule,
MatMenuModule} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { SesionCpComponent } from './sesion-cp/sesion-cp.component';
import { FormsModule } from '@angular/forms';
import { MenuAdminComponent } from './menu-admin/menu-admin.component';
import { PacComponent } from './pac/pac.component';
import { ListaCpComponent } from './lista-cp/lista-cp.component';


@NgModule({
  declarations: [LoginCpComponent, SesionCpComponent, MenuAdminComponent, PacComponent, ListaCpComponent],
  imports: [
    CommonModule,
    ComprasPublicasRoutingModule, 
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatRadioModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule, 
    MatCheckboxModule,
    FormsModule
  ]
})
export class ComprasPublicasModule { }

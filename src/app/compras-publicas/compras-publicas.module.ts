import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprasPublicasRoutingModule } from './compras-publicas-routing.module';
import { LoginCpComponent } from './login-cp/login-cp.component';

import {MatFormFieldModule, MatInputModule, MatRadioModule, MatToolbarModule, MatIconModule,
MatMenuModule} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { SesionCpComponent } from './sesion-cp/sesion-cp.component';


@NgModule({
  declarations: [LoginCpComponent, SesionCpComponent],
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
    MatCheckboxModule
  ]
})
export class ComprasPublicasModule { }

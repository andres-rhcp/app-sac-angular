import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';

import { PortalCiudadanoRoutingModule } from './portal-ciudadano-routing.module';
import { SesionLandingpageComponent } from './sesion-landingpage/sesion-landingpage.component';

@NgModule({
  declarations: [SesionLandingpageComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    PortalCiudadanoRoutingModule
  ],
  exports: [SesionLandingpageComponent]
})
export class PortalCiudadanoModule { }

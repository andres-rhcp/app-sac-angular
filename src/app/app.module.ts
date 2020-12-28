import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { InicioModule } from './inicio/inicio.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { MatSidenavModule, MatListModule, MatExpansionModule } from '@angular/material';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingComponent } from './_components/loading/loading.component';
import { SnackBarComponent } from './_components/snack-bar/snack-bar.component';
import { MenuComponent } from './home/menu/menu.component';
import { ErrorInterceptor, JwtInterceptor } from './_helpers';
//import { DialogComponent } from './_components/dialog/dialog.component';
// import { DialogOverviewExampleDialog } from './home/lista-tablas/lista-tablas.component';
// import { ConfirmDialogComponent } from './_components/dialog/dialog.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
// import { ChipsComponent } from './_components/chips/chips.component';
// import { DialogEditComponent } from './_components/dialog-edit/dialog-edit.component';
// import { DialogNewComponent } from './_components/dialog-new/dialog-new.component';
// import { DialogComponent } from './_components/dialog/dialog.component';
import { FormsModule } from '@angular/forms';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FileComponent } from './home/file/file.component';
// import { MaterialFileUploadComponent } from './_components/material-file-upload/material-file-upload.component';
// const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
import { StorageServiceModule } from 'angular-webstorage-service';

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    SnackBarComponent,
    MenuComponent,
    // MaterialFileUploadComponent,
    // ChipsComponent,
    // DialogEditComponent,
    // DialogNewComponent,
    // DialogComponent
    // ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    HomeModule,
    MatSidenavModule, MatListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    // IoModule.forRoot(config),
    BrowserModule,
    StorageServiceModule,
    InicioModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    SnackBarComponent,
    //DialogComponent
    // ConfirmDialogComponent
  ]
})
export class AppModule { }

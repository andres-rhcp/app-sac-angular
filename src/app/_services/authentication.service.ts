import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ConstantsService } from '../_services/constants.service'
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private dir = 'login';
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public usuario: string;
  public aplicacion: string;
  constructor(private http: HttpClient, private constantsService: ConstantsService) {
    this.currentUserSubject = new BehaviorSubject<any>((localStorage.getItem('usuario')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.usuario = (localStorage.getItem('usuario'));
    this.usuario = (localStorage.getItem('aplicacion'));
  }

  login(usuario, password) {
    let codigoApp = this.constantsService.codigoApp;

    return this.http.post<any>(`${this.constantsService.baseAppUrl}${this.dir}`, { usuario, password, codigoApp })
      .pipe(map(respuesta => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes

        localStorage.setItem('token', 'Aas213as-asda12');
        localStorage.setItem('permisos', 'ok');
        localStorage.setItem('cedula', '1002003001');
        localStorage.setItem('usuario', 'Test user');
        localStorage.setItem('aplicacion', 'ThisFish Inc. ');
        this.currentUserSubject.next(respuesta);

        return respuesta;
      }));
  }
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

}

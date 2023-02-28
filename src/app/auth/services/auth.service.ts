import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, of, map} from 'rxjs';
import { environment } from '../../../environments/environment';

import { Auth } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _auth: Auth | undefined;

  get auth(): Auth {
    return {...this._auth!}
  }

  constructor(
    private http: HttpClient,
  ){}

  verificaAutentificacion (): Observable<boolean>  {
    if ( !localStorage.getItem('token')) {
      return of(false);
      // return false;
    }

    return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`)
      .pipe(
        map(auth => {
          // console.log('map', auth)
          this._auth = auth;
          return true;
        })
      )
    // return of(true);
    // return true;
  }

  login(){
    return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`)
      .pipe(
        tap( auth => this._auth = auth),
        tap( auth => localStorage.setItem('token', auth.id))
      )
  }

  logout() {
    this._auth = undefined;
    localStorage.setItem('token', '')
  }

}

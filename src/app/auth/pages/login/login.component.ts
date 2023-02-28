import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    // ir al backend
    // un usuario

    this.authService.login()
      .subscribe( res => {
        console.log(res)
        if(res.id){
          this.router.navigate(['./heroes'])
        }
      })

  }

  ingresarSinLogin () {
    this.authService.logout();
    this.router.navigate(['./heroes']);
  }
}

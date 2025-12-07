import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthApi } from '../../services/auth-api';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../shared/services/alert-service';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html'
})
export class Login {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthApi);
  private readonly router = inject(Router);
  private readonly alertSrv = inject(AlertService);


  // formulario login
  public formLogin = this.fb.group({
    email: ['sofia@correo.com', [Validators.required, Validators.email]],
    password: ['Password123$', [Validators.required]]
  })


  // botón
  login() {
    console.log(this.formLogin.value);
    if (this.formLogin.invalid) {
      return
    }

    const email = this.formLogin.controls.email.value as string;
    const password = this.formLogin.controls.password.value as string;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log(res);

        localStorage.setItem('usuario', JSON.stringify(res))

        this.router.navigate(['/']);

      },
      error: (error) => {
        console.log(error);
        this.alertSrv.handlerAlerta('Advertencia', 'Correo y/o contraseña incorrectos. Inténtelo nuevamente', 'warning')

      }
    })

  }

}

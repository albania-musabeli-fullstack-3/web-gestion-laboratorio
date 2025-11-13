import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthApi } from '../../services/auth-api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private fb = inject(FormBuilder);
  private authService = inject(AuthApi);
  private router = inject(Router);


  // formulario login
  public formLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })


  // botón
  login() {
    console.log(this.formLogin.value);

    this.authService.login(this.formLogin.controls.email.value!, this.formLogin.controls.password.value!).subscribe({
      next: (res) => {
        console.log(res);

        localStorage.setItem('usuario', JSON.stringify(res))

        this.router.navigate(['/']);

      },
      error: (error) => {
        console.log(error);

      }
    })

  }

}

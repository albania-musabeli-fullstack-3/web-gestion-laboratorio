import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthApi } from '../../services/auth-api';
import { AlertService } from '../../../shared/services/alert-service';
import { passwordValidation } from '../../../shared/utils/validations/passwordValidation';

@Component({
  selector: 'app-create-account',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './create-account.html'
})
export default class CreateAccount {

  // inyección dependencias
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthApi);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);

  cargando = false;

  
  // formulario de registro
  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    correo: ['', [Validators.required, Validators.email]],
    password1: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/)]],
    password2: ['', [Validators.required]]
  }, { validators: [passwordValidation()] })



  crearUsuario(){
    const { nombre, correo, password1, password2 } = this.form.value;

    if (!nombre || this.form.controls.nombre.invalid) {
      this.alert.handlerAlerta('Advertencia', 'Ingrese un nombre válido (mínimo 3 letras)', 'warning');
      return;
    }

    if (!correo || this.form.controls.correo.invalid) {
      this.alert.handlerAlerta('Advertencia', 'Ingrese un correo válido', 'warning');
      return;
    }

    if (!password1 || this.form.controls.password1.invalid) {
      this.alert.handlerAlerta('Advertencia', 'La contraseña debe tener mayúsculas, minúsculas, número, símbolo y 8-20 caracteres', 'warning');
      return;
    }

    if (!password2 || this.form.controls.password2.invalid) {
      this.alert.handlerAlerta('Advertencia', 'Debe repetir la contraseña', 'warning');
      return;
    }

     // Validar que las contrasenas sean iguales
    if (password1 !== password2) {
      this.alert.handlerAlerta('Advertencia', 'Las contraseñas no coinciden', 'warning');
      return;
    }

    console.log(this.form.value);
    this.cargando = true;


    const request = {
      nombre: this.form.controls.nombre.value!,
      correo: this.form.controls.correo.value!,
      password: this.form.controls.password1.value!,
      roles: [1]
    }


    this.authService.register(request).subscribe({
      next: (res) => {
        this.alert.handlerAlerta('Éxito', 'Cuenta creada correctamente', 'success');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.cargando = false;
        const msg = error.error?.message || 'Error al crear la cuenta. Intente nuevamente.';
        this.alert.handlerAlerta('Error', msg, 'error');
      },
      complete: () => this.cargando = false
    });


  }
}

import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthApi } from '../../services/auth-api';
import { AlertService } from '../../../shared/services/alert-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-recovery-password',
  imports: [
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    RouterLink,
],
  templateUrl: './recovery-password.html'
})
export default class RecoveryPassword {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthApi);
  private readonly alertSrv = inject(AlertService);

  public formRecovery = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  })


  recoveryPassword(){
    const email = this.formRecovery.controls.email.value as string;

    this.authService.recoveryUserPassword(email).subscribe({
      next: (res) => {
        console.log(res);
        this.alertSrv.handlerAlerta('Datos recuperados', `Su contraseña es: ${ res.password }`, 'success')

        this.formRecovery.reset();
        
      },
      error: (error) => {
        console.log(error.error.message);
        this.alertSrv.handlerAlerta('Advertencia', error.error.message, 'warning');

        this.formRecovery.reset();
        
      }
    })
    
  }

}

import { Component, inject, OnInit } from '@angular/core';
import { AuthApi } from '../../../auth/services/auth-api';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { UserApi } from '../../services/api-user/user-api';
import { UserStorage } from '../../services/user-storage/user-storage';
import { AlertService } from '../../../shared/services/alert-service';


@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './profile.html'
})
export default class Profile implements OnInit {

  private readonly apiAuth = inject(AuthApi);
  private readonly apiUser = inject(UserApi);
  private readonly storageService = inject(UserStorage);
  private readonly alert = inject(AlertService);

  private readonly fb = inject(FormBuilder);



  public formProfile = this.fb.group({
    nombre: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    id: [null],
  })


  ngOnInit() {
    const userLogin = JSON.parse(localStorage.getItem('usuario')!) || null;

    if (userLogin) {
      console.log(userLogin);
      this.getUser(userLogin.correo)

    }

    this.formProfile.controls.correo.disable();
  }



  getUser(correo: string) {
    this.apiAuth.recoveryUserPassword(correo).subscribe({
      next: (res) => {
        console.log(res);
        this.formProfile.controls.nombre.setValue(res.nombre)
        this.formProfile.controls.correo.setValue(res.correo)
        this.formProfile.controls.password.setValue(res.password)
        this.formProfile.controls.id.setValue(res.id)
      },
      error: (error) => {
        console.log(error.error.message);
      }
    })
  }


  editarPerfil() {
    this.apiUser.updateUser(this.formProfile.value).subscribe({
      next: (res) => {
        console.log(res);
        this.getUser(res.correo)
        localStorage.setItem("usuario", JSON.stringify(res))
        this.storageService.loadUserFromLocalStorage();
        this.alert.handlerAlerta('Éxito', 'Datos actualizados', 'success')
      },
      error: (error) => {
        console.log(error.error.errors);
        if (Array.isArray(error.error.errors)) {

          this.alert.handlerAlerta('Advertencia', error.error.errors[0].message, 'warning')
          this.getUser(this.formProfile.controls.correo.value ?? '')

        }

      }
    })
  }

}

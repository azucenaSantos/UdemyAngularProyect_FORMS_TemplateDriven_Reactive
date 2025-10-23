import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

//Funcion que va actuar como validador de la contraseña
function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null; //control válido
  }
  //Si no es válido
  return { doesNotContainQuestionMark: true }; //devuelve error-objeto con propiedad true
}

//Funcion para asyncvalidatoris
function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'text@example.com') {
    return of(null);
    //of produce un observable que emite un valor
  }

  return of({ notUniqueEmail: true });
  //observable en caso de que sea igual
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  //FormGroup es un objeto
  form = new FormGroup({
    //registrar clave-valor que representan a cada control del formulario o FormGroup anidado
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [emailIsUnique],
      //los asyncs tiene la diferencia de los validators que siempre tienen que devolver un observable
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainQuestionMark,
      ],
    }),
  }); //hemos creado un FormGroup y ahora debemos enlazarlo a la template

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }

  get passwordIsValid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  ngOnInit() {
    const savedForm = window.localStorage.getItem('saved-loging-info');
    if (savedForm) {
      const loadedForm = JSON.parse(savedForm);
      //this.form.patchValue(loadedForm); //updated un form que sea reactive con esta funcion
      this.form.patchValue({
        email: loadedForm.email,
      }); //o podemos solo updatear una parte en concreto del form
    }

    const suscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-loging-info',
            JSON.stringify({ email: value.email })
          );
        },
      });
    this.destroyRef.onDestroy(() => suscription.unsubscribe());
  }

  onSubmit() {
    console.log(this.form);
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
    console.log(enteredEmail, enteredPassword);
  }
}

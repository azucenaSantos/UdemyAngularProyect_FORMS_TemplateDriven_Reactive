import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  //añadimos imports para poder usar ngModel -> necesitamos el FormsModule
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  //¿Cómo accedemos a los valores del formulario?

  private form = viewChild.required<NgForm>('form'); //obtenemos el objeto del dom con este nombre de variable
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const savedForm = window.localStorage.getItem('saved-loging-form');

      if (savedForm) {
        const loadedFormData = JSON.parse(savedForm);
        const savedEmail = loadedFormData.email;
        //Retraso de 1 segundo para evitar el error de acceder a email cuando no tenemos ese control aun en el componente
        setTimeout(() => {
          //this.form().setValue({ email: savedEmail, password: '' });
          this.form().controls['email'].setValue(savedEmail); //podemos asociar de 2 formas, directamente al control
          //o pasando al setValue un objeto con los valores de cada uno de los inputs del form
        }, 1);
      }

      //valueChanges es un observable de angular
      //que va a emitir nuevos valores cada vez que los valores introducidos en el usuario cambien
      const suscription = this.form()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) => {
            //guardar valores en el localstorage de mi pc
            window.localStorage.setItem(
              'saved-loging-form',
              JSON.stringify({ email: value.email })
            );
            //Guardamos como un objeto el email. tiene que estar en formato JSON y lo guardamos
            //en el localStorage con el key 'saved-login-form'
            //con el debounceTime-> guardamos datos cada 500 milisegundos
          },
        });
      this.destroyRef.onDestroy(() => suscription?.unsubscribe());
    });
  }
  onSubmit(formData: NgForm) {
    //NgForm-> tipo de dato que va a dar el formulario con el #form
    //console.log(formData); --> todo el contenido del objeto NgForm

    if (formData.form.invalid) {
      return; //si es inválido no se muestran los console.log
    }

    //Extraer valores de los inputs
    const enteredEmail = formData.form.value.email;
    const enteredPassword = formData.form.value.password;
    console.log(enteredEmail, enteredPassword);

    //Cuando "enviamos", reseteamos los valores de los inputs
    //y restablece toda la informacion interna del formulario (dirty, touched...)
    formData.form.reset();
  }
}

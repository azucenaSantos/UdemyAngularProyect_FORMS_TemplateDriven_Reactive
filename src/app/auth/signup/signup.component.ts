import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// function equalValues(control: AbstractControl) {
//   const password = control.get('password')?.value; //recogemos el control con este valor asociado
//   const confirmPassword = control.get('confirmPassword')?.value;

//   if (password === confirmPassword) {
//     return null;
//   }

//   return { passwordsNotEquals: true };
// }
//La funcion la podemos hacer mas reutilizable

function equalValues(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;
    if (val1 === val2) {
      return null;
    }
    return { valuesNotEquals: true };
  };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    //Vamos a unificar la contraseña y la verificacion en un único control
    //-> visualizaremos el contenido de todo el form de una forma más legible y unificada
    //ya que los formGroup anidados crearán un objeto con los controladores dentro de ellos
    passwords: new FormGroup(
      {
        //será un formGroup dentro de un formGroup principal
        password: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
        //de esta forma se estructura mejor los contenidos de un formulario
      },
      //El formGroup tiene un segundo parámetro que será la validacion conjunta de todos sus controladores
      //en este caso una validacion de que el valor de password y de confirmPassword sea igual :D
      {
        validators: [equalValues('password', 'confirmPassword')], //añadiomos la validacion conjunta que hemos creado
        //Cuando no son valores iguales angular asocia a los controles una clase de ng-invalid
        //aunque no mostremos un error podemos incluir estilos css para esa clase y hacer que el usuario
        //se entere que no son valores iguales
      }
    ),
    firstName: new FormControl('', {
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
    }),
    //Creamos tambien un formGroup anidado para los datos de direccion
    address: new FormGroup({
      street: new FormControl('', {
        validators: [Validators.required],
      }),
      number: new FormControl('', {
        validators: [Validators.required],
      }),
      postalCode: new FormControl('', {
        validators: [Validators.required],
      }),
      city: new FormControl('', {
        validators: [Validators.required],
      }),
    }), //ahora los controles están anidados dentro del address
    //El role tendrá un valor por defecto de los que ya tiene el select puesto en la template
    //Además le pasamos los unicos valores que podrá tener el control en los <...>
    role: new FormControl<
      'student' | 'teacher' | 'employee' | 'founder' | 'other'
    >('student', {
      validators: [Validators.required],
    }),
    //¿Cómo gestionamos los checkbox de una forma óptima? --> FormArray
    source: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
      //Estos 3 formControl representan los 3 checkboxs
      //Cuando se marque una de las opciones, se guardará true en la posicion del array source (false, true, true -> por ejemplo)
    ]),
    //El valor por defecto del ultimo check es false (no marcado)
    agree: new FormControl(false, {
      validators: [Validators.required],
      //Será required para aceptar si o si antes de enviar los datos
    }),
  });

  ngOnInit(): void {}

  onSubmit() {
    if (this.form.invalid) {
      console.log('Invalid form');
      return;
    }

    console.log(this.form);
  }
  onReset() {
    this.form.reset();
  }
}

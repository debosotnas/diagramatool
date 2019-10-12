import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  public text: string;

  ngOnInit(): void {
    // this.text =  'this is the first word of a common declaration. Here you can put some content to show in main screen.';
    // this.text += 'this is the first word of a common declaration. Here you can put some content to show in main screen';
    this.text = '1 Pero también digo: Entre tanto que el heredero es niño, en nada difiere del esclavo, aunque es señor de todo;';

    this.text += ' 2 sino que está bajo tutores y curadores hasta el tiempo señalado por el padre.';

    this.text += ' 3 Así también nosotros, cuando éramos niños, estábamos en esclavitud bajo los rudimentos del mundo.';

    this.text += ' 4 Pero cuando vino el cumplimiento del tiempo, Dios envió a su Hijo, nacido de mujer y nacido bajo la ley,';

    this.text += ' 5 para que redimiese a los que estaban bajo la ley, a fin de que recibiésemos la adopción de hijos.';

    this.text += ' 6 Y por cuanto sois hijos, Dios envió a vuestros corazones el Espíritu de su Hijo, el cual clama: !!Abba, Padre!';

    this.text += ' 7 Así que ya no eres esclavo, sino hijo; y si hijo, también heredero de Dios por medio de Cristo.';
  }

}

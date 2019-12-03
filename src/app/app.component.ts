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

    // tslint:disable-next-line:max-line-length
    this.text = `12 Doy gracias al que me fortaleció, a Cristo Jesús nuestro Señor, porque me tuvo por fiel, poniéndome en el ministerio, 13 habiendo yo sido antes blasfemo, perseguidor e injuriador; mas fui recibido a misericordia porque lo hice por ignorancia, en incredulidad. 14 Pero la gracia de nuestro Señor fue más abundante con la fe y el amor que es en Cristo Jesús. 15 Palabra fiel y digna de ser recibida por todos: que Cristo Jesús vino al mundo para salvar a los pecadores, de los cuales yo soy el primero. 16 Pero por esto fui recibido a misericordia, para que Jesucristo mostrase en mí el primero toda su clemencia, para ejemplo de los que habrían de creer en él para vida eterna. 17 Por tanto, al Rey de los siglos, inmortal, invisible, al único y sabio Dios, sea honor y gloria por los siglos de los siglos. Amén.`;

    /*
    this.text = '1 Pero también digo: Entre tanto que el heredero es niño, en nada difiere del esclavo, aunque es señor de todo;';

    this.text += ' 2 sino que está bajo tutores y curadores hasta el tiempo señalado por el padre.';

    this.text += ' 3 Así también nosotros, cuando éramos niños, estábamos en esclavitud bajo los rudimentos del mundo.';

    this.text += ' 4 Pero cuando vino el cumplimiento del tiempo, Dios envió a su Hijo, nacido de mujer y nacido bajo la ley,';

    this.text += ' 5 para que redimiese a los que estaban bajo la ley, a fin de que recibiésemos la adopción de hijos.';

    this.text += ' 6 Y por cuanto sois hijos, Dios envió a vuestros corazones el Espíritu de su Hijo, el cual clama: !!Abba, Padre!';

    this.text += ' 7 Así que ya no eres esclavo, sino hijo; y si hijo, también heredero de Dios por medio de Cristo.';
    */
  }

}

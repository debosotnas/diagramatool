# Diagramatool

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Extra API Info
Drag and Drop:
  - https://material.angular.io/cdk/drag-drop/api#CdkDrag

File-saver
  - https://www.npmjs.com/package/file-saver
    Installation: npm install file-saver --save

## Pendings / Improvements / Next steps
  - Check -> VIDEO #3 Observación de estructura literaria - 50:05 min
    - Leave 'isFirstLoad' as true by default for all new selections (similar to video)
    - Add SVG arrows, flow elements support
    - Add highlight support:
      - Add Enable/Disable click-and-break (help with selection without create new phrase by mistake)
      - Basic (select and add highlight color) and Advanced (like highlight tool)
    - Add SAVE feature - Completed!
    - Add share portion ::: Won't be implemented


## Known Issues:
  - Al arrastrar una porcion de más de una línea, el texto deja de ser un bloque y se transforma en una única línea.
      - Esperado: al mover un bloque, que se siga adaptando al superar el borde de la derecha

  - Al borrar una separación (click en el iconito al final de un bloque), el texto que se une, no se reacomoda 
    correctamente
      - Esperado: el texto que vuelve a ser parte de un bloque, debe recalcular la posición de cada palabra.


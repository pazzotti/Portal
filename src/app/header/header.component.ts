import { Component } from '@angular/core';
import { HeaderModule } from './header.module';
import * as feather from 'feather-icons';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponentes {
  selectedOption: string = "";
  alinharDireita = true;

  constructor() {
    // Importe o ícone desejado
    feather.replace();
  }


}

import { Component, Renderer2 } from '@angular/core';
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

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  constructor(private renderer: Renderer2) {
    // Importe o ícone desejado
    feather.replace();
  }

  ngOnInit() {
    this.changeCursorStyle(false);
  }

  changeCursorStyle(isMenuOpen: boolean) {
    const dropdownButton = document.getElementById('dropdownMenuButton');
    if (dropdownButton) {
      this.renderer.setStyle(dropdownButton, 'cursor', isMenuOpen ? 'default' : 'pointer');
    }
  }


}

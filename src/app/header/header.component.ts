import { HeaderModule } from './header.module';
import * as feather from 'feather-icons';
import { createPopper } from '@popperjs/core';
import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponentes {
  @ViewChild('interplantasButton', { static: true }) interplantasButton!: ElementRef;
  @ViewChild('interplantasMenu', { static: true }) interplantasMenu!: ElementRef;

  selectedOption: string = "";
  alinharDireita = true;

  isConfigMenuOpen: boolean = false;

  isInterplantasMenuOpen = false;
  dropdownMenuStyle: any;

  toggleInterplantasMenu() {
    this.isInterplantasMenuOpen = !this.isInterplantasMenuOpen;
    if (this.isInterplantasMenuOpen) {
      this.positionDropdownMenu();
    }
  }

  positionDropdownMenu() {
    const buttonElement = this.interplantasButton.nativeElement;
    const menuElement = this.interplantasMenu.nativeElement;
    this.dropdownMenuStyle = {
      position: 'absolute',
      top: `${buttonElement.offsetTop + buttonElement.offsetHeight}px`,
      left: `${buttonElement.offsetLeft}px`,
    };
    createPopper(buttonElement, menuElement, {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10], // Adjust the offset if needed
          },
        },
      ],
    });
  }


  toggleConfigMenu() {
    this.isConfigMenuOpen = !this.isConfigMenuOpen;
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

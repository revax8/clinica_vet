import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-veterinaria-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './veterinaria-navbar.component.html',
  styleUrl: './veterinaria-navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VeterinariaNavbarComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}

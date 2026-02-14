import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { VeterinariaNavbarComponent } from './Components/veterinaria-navbar/veterinaria-navbar.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, VeterinariaNavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'VetCare - Cuidado Veterinario';
}

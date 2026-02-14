import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-veterinaria-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './veterinaria-home.component.html',
  styleUrl: './veterinaria-home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VeterinariaHomeComponent {
  features: Feature[] = [
    {
      icon: 'fas fa-clock',
      title: 'Atención 24/7',
      description: 'Servicio de emergencias disponible las 24 horas del día'
    },
    {
      icon: 'fas fa-user-md',
      title: 'Veterinarios Expertos',
      description: 'Profesionales altamente calificados con años de experiencia'
    },
    {
      icon: 'fas fa-heart',
      title: 'Amor por los Animales',
      description: 'Tratamos a tu mascota como si fuera parte de nuestra familia'
    }
  ];
}

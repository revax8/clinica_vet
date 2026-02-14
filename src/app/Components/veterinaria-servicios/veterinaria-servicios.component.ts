import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-veterinaria-servicios',
  imports: [CommonModule, RouterLink],
  templateUrl: './veterinaria-servicios.component.html',
  styleUrl: './veterinaria-servicios.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VeterinariaServiciosComponent {
  services: Service[] = [
    {
      icon: 'fas fa-stethoscope',
      title: 'Consultas Veterinarias',
      description: 'Exámenes completos y diagnósticos precisos para tu mascota.',
      features: ['Revisión general', 'Diagnóstico especializado', 'Historial clínico', 'Recomendaciones de cuidado']
    },
    {
      icon: 'fas fa-syringe',
      title: 'Vacunación y Desparasitación',
      description: 'Programas de vacunación completos y tratamientos antiparasitarios.',
      features: ['Calendario de vacunas', 'Vacunas obligatorias', 'Desparasitación interna', 'Prevención de pulgas']
    },
    {
      icon: 'fas fa-user-md',
      title: 'Cirugías',
      description: 'Procedimientos quirúrgicos con tecnología de vanguardia.',
      features: ['Cirugía general', 'Esterilización', 'Cirugía de emergencia', 'Recuperación asistida']
    },
    {
      icon: 'fas fa-x-ray',
      title: 'Diagnóstico por Imagen',
      description: 'Radiografías, ecografías y estudios especializados.',
      features: ['Rayos X digitales', 'Ecografías', 'Análisis de laboratorio', 'Estudios especializados']
    },
    {
      icon: 'fas fa-cut',
      title: 'Estética y Peluquería',
      description: 'Servicios de belleza y cuidado estético para tu mascota.',
      features: ['Baño medicinal', 'Corte de pelo', 'Limpieza de oídos', 'Corte de uñas']
    },
    {
      icon: 'fas fa-hospital',
      title: 'Hospitalización',
      description: 'Cuidados intensivos y hospitalización para casos complejos.',
      features: ['Monitoreo 24/7', 'Cuidados intensivos', 'Medicación controlada', 'Recuperación supervisada']
    }
  ];

  getServiceKey(title: string): string {
    const serviceKeys: { [key: string]: string } = {
      'Consultas Veterinarias': 'consulta',
      'Vacunación y Desparasitación': 'vacunacion', 
      'Cirugías': 'cirugia',
      'Diagnóstico por Imagen': 'diagnostico',
      'Estética y Peluquería': 'estetica',
      'Hospitalización': 'hospitalizacion'
    };
    return serviceKeys[title] || 'consulta';
  }
}

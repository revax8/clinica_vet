import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-app-services',
  imports: [],
  templateUrl: './app-services.component.html',
  styleUrl: './app-services.component.css',
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppServicesComponent {
services: Service[] = [
{
icon: 'M25 10V40M10 25H40',
iconClass: 'service-icon-1',
title: 'Consulta General',
description: 'Revisión completa del estado de salud de tu mascota con nuestros veterinarios especializados.'  ,
features: [
'Examen físico completo',
'Diagnóstico preventivo',
'Plan de salud personalizado'
]
},
{
icon: 'M20 18L22 20L28 14',
iconClass: 'service-icon-2',
title: 'Vacunación',
description: 'Protege a tu mascota con nuestro programa completo de vacunación y desparasitación.',
features: [
'Vacunas obligatorias y opcionales',
'Control de parásitos',
'Cartilla de vacunación digital'
],
featured: true
},
{
icon: 'M25 5L35 15L30 20L40 30L30 40L20 30L15 35L5 25L15 15L20 20L25 5Z',
iconClass: 'service-icon-3',
title: 'Cirugía',
description: 'Quirófano equipado con tecnología moderna para cirugías y procedimientos especializados.',
features: [
'Cirugías de rutina',
'Procedimientos especializados',
'Monitoreo post-operatorio'
]
},
{
icon: 'M25 15V25L32 28',
iconClass: 'service-icon-4',
title: 'Emergencias 24/7',
description: 'Atención de urgencias las 24 horas del día, los 7 días de la semana para tu tranquilidad.',
features: [
'Disponibilidad inmediata',
'Equipo de guardia',
'Atención prioritaria'
]
},
{
icon: 'M15 10L20 15M35 10L30 15',
iconClass: 'service-icon-5',
title: 'Diagnóstico por Imagen',
description: 'Rayos X, ecografías y estudios especializados para un diagnóstico preciso.',
features: [
'Radiografías digitales',
'Ecografías',
'Resultados inmediatos'
]
},
{
icon: 'M20 25L23 28L30 21',
iconClass: 'service-icon-6',
title: 'Peluquería & Spa',
description: 'Servicios de estética y cuidado para que tu mascota luzca y se sienta mejor.',
features: [
'Baño y corte',
'Tratamientos especiales',
'Cuidado de uñas y dientes'
]
}
];
}

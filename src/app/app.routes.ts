import { Routes } from '@angular/router';
import { VeterinariaHomeComponent } from './Components/veterinaria-home/veterinaria-home.component';
import { VeterinariaServiciosComponent } from './Components/veterinaria-servicios/veterinaria-servicios.component';
import { VeterinariaContactoComponent } from './Components/veterinaria-contacto/veterinaria-contacto.component';

export const routes: Routes = [
  {
    path: '', 
    component: VeterinariaHomeComponent
  },
  {
    path: 'servicios', 
    component: VeterinariaServiciosComponent
  },
  {
    path: 'contacto', 
    component: VeterinariaContactoComponent
  },
  {
    path: '**', 
    redirectTo: ''
  }
];

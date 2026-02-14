import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './app-hero.component.html',
  styleUrl: './app-hero.component.css'
})
export class AppHeroComponent {
stats = [
{ number: '15+', label: 'Años de Experiencia' },
{ number: '5000+', label: 'Mascotas Atendidas' },
{ number: '24/7', label: 'Emergencias' }
];

floatingCards = [
{ icon: '💉', text: 'Vacunación', position: 'floating-card-1' },
{ icon: '🏥', text: 'Cirugía', position: 'floating-card-2' },
{ icon: '🔬', text: 'Diagnóstico', position: 'floating-card-3' }
];

scrollToSection(sectionId: string) {
const element = document.getElementById(sectionId);
if (element) {
const offsetTop = element.offsetTop - 80;
window.scrollTo({
top: offsetTop,
behavior: 'smooth'
});
}
}
}

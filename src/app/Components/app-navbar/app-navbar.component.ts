import { ChangeDetectionStrategy, Component , HostListener} from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './app-navbar.component.html',
  styleUrl: './app-navbar.component.css',
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppNavbarComponent {
isMenuOpen = false;
isScrolled = false;
activeSection = 'inicio';

@HostListener('window:scroll', [])
onWindowScroll() {
this.isScrolled = window.pageYOffset > 100;
this.updateActiveSection();
}

toggleMenu() {
this.isMenuOpen = !this.isMenuOpen;
}

closeMenu() {
this.isMenuOpen = false;
}

scrollToSection(sectionId: string, event: Event) {
event.preventDefault();
this.activeSection = sectionId;
this.closeMenu();


const element = document.getElementById(sectionId);
if (element) {
  const offsetTop = element.offsetTop - 80;
  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth'
  });
}


}

private updateActiveSection() {
const sections = [‘inicio’, ‘servicios’, ‘contacto’];
const scrollY = window.pageYOffset;


for (const sectionId of sections) {
  const section = document.getElementById(sectionId);
  if (section) {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      this.activeSection = sectionId;
      break;
    }
  }
}


}
}

import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-veterinaria-contacto',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './veterinaria-contacto.component.html',
  styleUrl: './veterinaria-contacto.component.css'
})
export class VeterinariaContactoComponent implements OnInit {
  contactForm: FormGroup;
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  // Configuración del WhatsApp (cambiar por el número real de la veterinaria)
  private readonly WHATSAPP_NUMBER = '524622430839'; // Formato: código país + número sin espacios ni símbolos

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      servicio: ['', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    // Verificar si hay un servicio preseleccionado en los query params
    this.route.queryParams.subscribe(params => {
      if (params['servicio']) {
        this.contactForm.patchValue({
          servicio: params['servicio']
        });
      }
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      this.enviarPorWhatsApp(formData);
    } else {
      this.showErrorNotification('Por favor, completa todos los campos correctamente.');
    }
  }

  private enviarPorWhatsApp(datos: any) {
    try {
      // Crear mensaje estructurado
      const mensaje = this.crearMensajeWhatsApp(datos);
      
      // Detectar si es móvil
      const esMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      console.log(esMobile ? '📱 Dispositivo móvil detectado' : '💻 Dispositivo desktop detectado');
      
      // Mostrar notificación de éxito
      this.showSuccessNotification('Te redirigiremos a WhatsApp para completar tu solicitud...');
      
      // Delay más corto para móviles
      const delay = esMobile ? 800 : 1500;
      
      setTimeout(() => {
        if (esMobile) {
          this.abrirWhatsAppMobile(mensaje);
        } else {
          this.abrirWhatsAppDesktop(mensaje);
        }
        
        // Resetear formulario
        this.contactForm.reset();
        this.cdr.detectChanges();
      }, delay);
      
    } catch (error) {
      console.error('❌ Error general al procesar WhatsApp:', error);
      this.showErrorNotification('Error al procesar el mensaje. Por favor, intenta de nuevo.');
    }
  }

  private abrirWhatsAppMobile(mensaje: string) {
    console.log('📱 Ejecutando método optimizado para móvil');
    
    try {
      // Método 1 para móviles: Usar el protocolo whatsapp:// directamente
      const whatsappProtocolURL = `whatsapp://send?phone=${this.WHATSAPP_NUMBER}&text=${encodeURIComponent(mensaje)}`;
      console.log('🔗 URL protocolo:', whatsappProtocolURL);
      
      // Crear enlace temporal y hacer clic
      const tempLink = document.createElement('a');
      tempLink.href = whatsappProtocolURL;
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      
      console.log('✅ Protocolo whatsapp:// ejecutado');
      
      // Método de respaldo después de 2 segundos si no se abre la app
      setTimeout(() => {
        const fallbackURL = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
        console.log('🔄 Ejecutando fallback wa.me:', fallbackURL);
        
        // Usar window.location para asegurar que se ejecute
        window.location.href = fallbackURL;
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error en método móvil:', error);
      // Método final de respaldo
      const finalFallbackURL = `https://api.whatsapp.com/send?phone=${this.WHATSAPP_NUMBER}&text=${encodeURIComponent(mensaje)}`;
      window.location.href = finalFallbackURL;
    }
  }

  private abrirWhatsAppDesktop(mensaje: string) {
    console.log('💻 Ejecutando método para desktop');
    
    try {
      const whatsappURL = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
      console.log('🔗 URL wa.me:', whatsappURL);
      
      // Para desktop usar window.open con configuración específica
      const opened = window.open(whatsappURL, '_blank', 'noopener,noreferrer,width=1024,height=768');
      
      if (!opened || opened.closed || typeof opened.closed == 'undefined') {
        console.log('🔄 window.open bloqueado, usando método alternativo');
        // Método alternativo para desktop
        window.location.href = whatsappURL;
      } else {
        console.log('✅ WhatsApp Web abierto correctamente');
      }
      
    } catch (error) {
      console.error('❌ Error en método desktop:', error);
      const whatsappURL = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
      window.location.href = whatsappURL;
    }
  }

  private crearMensajeWhatsApp(datos: any): string {
    const servicioTexto = this.obtenerTextoServicio(datos.servicio);
    
    return `🐾 *SOLICITUD DE CITA - CLINICANIMAL* 🐾

👤 *Cliente:* ${datos.nombre}
📧 *Email:* ${datos.email}
📱 *Teléfono:* ${datos.telefono}
🏥 *Servicio:* ${servicioTexto}

💬 *Mensaje:*
${datos.mensaje}

---
_Enviado desde la página web de Clinicanimal_`;
  }

  private obtenerTextoServicio(valor: string): string {
    const servicios: { [key: string]: string } = {
      'consulta': 'Consulta Veterinaria',
      'vacunacion': 'Vacunación',
      'cirugia': 'Cirugía',
      'diagnostico': 'Diagnóstico por Imagen',
      'estetica': 'Estética y Peluquería',
      'hospitalizacion': 'Hospitalización',
      'emergencia': '🚨 EMERGENCIA 🚨'
    };
    return servicios[valor] || valor;
  }

  private showSuccessNotification(message: string) {
    this.notificationMessage = message;
    this.notificationType = 'success';
    this.showNotification = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.showNotification = false;
      this.cdr.detectChanges();
    }, 5000);
  }

  private showErrorNotification(message: string) {
    this.notificationMessage = message;
    this.notificationType = 'error';
    this.showNotification = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.showNotification = false;
      this.cdr.detectChanges();
    }, 5000);
  }

  closeNotification() {
    this.showNotification = false;
    this.cdr.detectChanges();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} es requerido`;
      }
      if (field.errors['email']) {
        return 'Email no válido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['pattern']) {
        return 'Formato no válido';
      }
    }
    return '';
  }
}

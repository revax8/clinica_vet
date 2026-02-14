import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-veterinaria-contacto',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './veterinaria-contacto.component.html',
  styleUrl: './veterinaria-contacto.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VeterinariaContactoComponent implements OnInit {
  contactForm: FormGroup;
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  // Configuración del WhatsApp (cambiar por el número real de la veterinaria)
  private readonly WHATSAPP_NUMBER = '5215512345678'; // Formato: código país + número sin espacios ni símbolos

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
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

  enviarPorEmail() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      this.enviarEmailSimulado(formData);
    } else {
      this.showErrorNotification('Por favor, completa todos los campos correctamente.');
    }
  }

  private enviarPorWhatsApp(datos: any) {
    // Crear mensaje estructurado
    const mensaje = this.crearMensajeWhatsApp(datos);
    
    // URL de WhatsApp Business API
    const whatsappURL = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    
    // Mostrar notificación de éxito
    this.showSuccessNotification('Te redirigiremos a WhatsApp para completar tu solicitud...');
    
    // Pequeño delay para que el usuario vea la notificación
    setTimeout(() => {
      window.open(whatsappURL, '_blank');
      this.contactForm.reset();
    }, 2000);
  }

  private enviarEmailSimulado(datos: any) {
    // Simulación de envío por email
    // En producción, aquí integrarías con EmailJS, SendGrid, etc.
    
    const emailData = {
      to: 'veterinaria@vetcare.com',
      subject: `Nueva solicitud de ${datos.nombre} - ${this.obtenerTextoServicio(datos.servicio)}`,
      body: `
        Cliente: ${datos.nombre}
        Email: ${datos.email}
        Teléfono: ${datos.telefono}
        Servicio: ${this.obtenerTextoServicio(datos.servicio)}
        
        Mensaje:
        ${datos.mensaje}
      `
    };
    
    // Mostrar notificación de éxito
    this.showSuccessNotification('¡Solicitud enviada correctamente! Te contactaremos en las próximas 24 horas.');
    this.contactForm.reset();
    
    console.log('Email que se enviaría:', emailData);
  }

  private crearMensajeWhatsApp(datos: any): string {
    const servicioTexto = this.obtenerTextoServicio(datos.servicio);
    
    return `🐾 *SOLICITUD DE CITA VETERINARIA* 🐾

👤 *Cliente:* ${datos.nombre}
📧 *Email:* ${datos.email}
📱 *Teléfono:* ${datos.telefono}
🏥 *Servicio:* ${servicioTexto}

💬 *Mensaje:*
${datos.mensaje}

---
_Enviado desde la página web de VetCare_`;
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
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }

  private showErrorNotification(message: string) {
    this.notificationMessage = message;
    this.notificationType = 'error';
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }

  closeNotification() {
    this.showNotification = false;
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

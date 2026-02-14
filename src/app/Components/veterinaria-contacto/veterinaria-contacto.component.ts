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

  enviarPorEmail() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      this.enviarEmailSimulado(formData);
    } else {
      this.showErrorNotification('Por favor, completa todos los campos correctamente.');
    }
  }

  private enviarPorWhatsApp(datos: any) {
    try {
      // Crear mensaje estructurado
      const mensaje = this.crearMensajeWhatsApp(datos);
      
      // URL de WhatsApp Business API
      const whatsappURL = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
      
      console.log('📱 Intentando abrir WhatsApp con URL:', whatsappURL);
      
      // Mostrar notificación de éxito
      this.showSuccessNotification('Te redirigiremos a WhatsApp para completar tu solicitud...');
      
      // Pequeño delay para que el usuario vea la notificación
      setTimeout(() => {
        try {
          // Método 1: window.open con opciones específicas
          const opened = window.open(whatsappURL, '_blank', 'noopener,noreferrer');
          
          if (!opened || opened.closed || typeof opened.closed == 'undefined') {
            console.log('🔄 window.open falló, intentando método alternativo');
            // Método 2: crear enlace y hacer click
            const link = document.createElement('a');
            link.href = whatsappURL;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log('✅ Enlace directo ejecutado');
          } else {
            console.log('✅ WhatsApp abierto exitosamente');
          }
          
          // Resetear formulario solo si todo fue bien
          this.contactForm.reset();
          this.cdr.detectChanges();
          
        } catch (innerError) {
          console.error('❌ Error en métodos de apertura:', innerError);
          this.showErrorNotification('No se pudo abrir WhatsApp. Verifica que tengas WhatsApp instalado o intenta copiar el enlace manualmente.');
        }
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error general al procesar WhatsApp:', error);
      this.showErrorNotification('Error al procesar el mensaje. Por favor, intenta de nuevo.');
    }
  }

  private enviarEmailSimulado(datos: any) {
    // Simulación de envío por email
    // En producción, aquí integrarías con EmailJS, SendGrid, etc.
    
    const emailData = {
      to: 'info@clinicanimal.com',
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
    
    console.log('🐾 Clinicanimal - Página web cargada correctamente');
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
    this.cdr.detectChanges(); // Forzar detección de cambios
    setTimeout(() => {
      this.showNotification = false;
      this.cdr.detectChanges(); // Forzar detección de cambios
    }, 5000);
  }

  private showErrorNotification(message: string) {
    this.notificationMessage = message;
    this.notificationType = 'error';
    this.showNotification = true;
    this.cdr.detectChanges(); // Forzar detección de cambios
    setTimeout(() => {
      this.showNotification = false;
      this.cdr.detectChanges(); // Forzar detección de cambios
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

  // Método para probar WhatsApp directamente
  probarWhatsApp() {
    const mensajePrueba = `🐾 *PRUEBA DESDE CLINICANIMAL* 🐾

¡Hola! Esta es una prueba de conexión desde nuestra página web.

Si recibiste este mensaje, significa que la integración con WhatsApp está funcionando correctamente.

---
_Enviado desde la página web de Clinicanimal_`;

    const whatsappURL = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensajePrueba)}`;
    
    console.log('🧪 Prueba de WhatsApp');
    console.log('📱 Número:', this.WHATSAPP_NUMBER);
    console.log('🔗 URL completa:', whatsappURL);
    
    this.showSuccessNotification('Abriendo WhatsApp de prueba...');
    
    // Intentar abrir WhatsApp inmediatamente
    setTimeout(() => {
      try {
        // Método 1: window.open
        const opened = window.open(whatsappURL, '_blank', 'noopener,noreferrer');
        
        if (!opened || opened.closed || typeof opened.closed == 'undefined') {
          console.log('🔄 window.open falló, intentando método 2');
          // Método 2: crear un enlace y hacer click
          const link = document.createElement('a');
          link.href = whatsappURL;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          console.log('✅ Enlace directo ejecutado');
        } else {
          console.log('✅ window.open funcionó correctamente');
        }
      } catch (error) {
        console.error('❌ Error en ambos métodos:', error);
        // Método 3: cambiar la ubicación de la ventana
        window.location.href = whatsappURL;
      }
    }, 1000);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CatalogoService, Producto, ProductosPorCategoria } from '../../Services/catalogo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit, OnDestroy {
  categoria: string = '';
  productos: Producto[] = [];
  carrito: Producto[] = [];
  mostrarCarrito: boolean = false;
  numeroWhatsApp: string = '524623266568'; // Cambia este número por tu WhatsApp
  
  // Estados para carga de Excel
  cargandoProductos: boolean = true; // Iniciar en true porque la carga comienza automáticamente
  errorCarga: string | null = null;
  
  // Estado para mostrar bienvenida o productos
  mostrarBienvenida: boolean = true;
  
  private subscriptions: Subscription = new Subscription();
  
  // Para usar Object.keys en el template
  Object = Object;
  
  // Datos dinámicos desde Excel - se actualiza automáticamente
  productosData: ProductosPorCategoria = {};

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private catalogoService: CatalogoService
  ) {}

  // Sistema de zoom dinámico que sigue el mouse
  toggleImagenGrande(event: any): void {
    event.stopPropagation();
    event.preventDefault();
    
    const imagen = event.target as HTMLImageElement;
    
    // Si ya está ampliada, restaurar
    if (imagen.style.transform && imagen.style.transform.includes('scale')) {
      this.cerrarZoom(imagen);
    } else {
      this.activarZoom(imagen);
    }
  }

  private activarZoom(imagen: HTMLImageElement): void {
    // Configurar el zoom inicial
    imagen.style.position = 'relative';
    imagen.style.zIndex = '9999';
    imagen.style.cursor = 'zoom-out';
    imagen.style.transition = 'transform 0.3s ease';
    imagen.style.transformOrigin = 'center center';
    
    // Determinar el factor de zoom según el dispositivo
    const isMobile = window.innerWidth <= 768;
    const zoomFactor = isMobile ? 1.8 : 2.5;
    
    imagen.style.transform = `scale(${zoomFactor})`;
    
    // Bloquear scroll mientras está ampliada
    document.body.style.overflow = 'hidden';
    
    // Agregar event listener para el movimiento del mouse
    const mouseMoveHandler = (e: MouseEvent) => this.actualizarZoomPorMouse(e, imagen, zoomFactor);
    const touchMoveHandler = (e: TouchEvent) => this.actualizarZoomPorTouch(e, imagen, zoomFactor);
    
    imagen.addEventListener('mousemove', mouseMoveHandler);
    imagen.addEventListener('touchmove', touchMoveHandler, { passive: false });
    
    // Guardar los handlers para poder removerlos después
    (imagen as any)._mouseMoveHandler = mouseMoveHandler;
    (imagen as any)._touchMoveHandler = touchMoveHandler;
  }

  private actualizarZoomPorMouse(event: MouseEvent, imagen: HTMLImageElement, zoomFactor: number): void {
    const rect = imagen.getBoundingClientRect();
    
    // Calcular la posición del mouse relativa a la imagen (0-1)
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    
    // Convertir a porcentajes (0-100)
    const xPercent = Math.max(0, Math.min(100, x * 100));
    const yPercent = Math.max(0, Math.min(100, y * 100));
    
    // Aplicar el zoom con transform-origin dinámico
    imagen.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    imagen.style.transform = `scale(${zoomFactor})`;
    imagen.style.transition = 'transform-origin 0.1s ease';
  }

  private actualizarZoomPorTouch(event: TouchEvent, imagen: HTMLImageElement, zoomFactor: number): void {
    event.preventDefault();
    
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const rect = imagen.getBoundingClientRect();
      
      // Calcular la posición del toque relativa a la imagen (0-1)
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;
      
      // Convertir a porcentajes (0-100)
      const xPercent = Math.max(0, Math.min(100, x * 100));
      const yPercent = Math.max(0, Math.min(100, y * 100));
      
      // Aplicar el zoom con transform-origin dinámico
      imagen.style.transformOrigin = `${xPercent}% ${yPercent}%`;
      imagen.style.transform = `scale(${zoomFactor})`;
      imagen.style.transition = 'transform-origin 0.1s ease';
    }
  }

  private cerrarZoom(imagen: HTMLImageElement): void {
    // Restaurar estilos originales
    imagen.style.transform = '';
    imagen.style.position = '';
    imagen.style.zIndex = '';
    imagen.style.cursor = 'zoom-in';
    imagen.style.transition = 'transform 0.3s ease';
    imagen.style.transformOrigin = '';
    
    // Restaurar scroll
    document.body.style.overflow = '';
    
    // Remover event listeners
    if ((imagen as any)._mouseMoveHandler) {
      imagen.removeEventListener('mousemove', (imagen as any)._mouseMoveHandler);
      delete (imagen as any)._mouseMoveHandler;
    }
    
    if ((imagen as any)._touchMoveHandler) {
      imagen.removeEventListener('touchmove', (imagen as any)._touchMoveHandler);
      delete (imagen as any)._touchMoveHandler;
    }
  }

  ngOnInit(): void {
    console.log('🎯 Componente: ngOnInit iniciado');
    console.log('🎯 Estado inicial cargando:', this.cargandoProductos);
    
    // Suscribirse a cambios de ruta (solo actualiza categoría)
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        const categoriaParam = params['categoria'];
        
        if (categoriaParam && categoriaParam !== 'bienvenida') {
          // Hay una categoría específica seleccionada
          this.categoria = categoriaParam;
          this.mostrarBienvenida = false;
          console.log('🎯 Componente: Categoría seleccionada:', this.categoria);
          
          // Si ya hay datos disponibles, recargar productos para la nueva categoría
          if (Object.keys(this.productosData).length > 0) {
            console.log("🎯 Componente: Recargando productos para nueva categoría...");
            this.cargarProductos();
          } else {
            console.log("🎯 Componente: Categoría actualizada, esperando datos...");
          }
        } else {
          // No hay categoría o es 'bienvenida', mostrar pantalla de bienvenida
          this.categoria = '';
          this.mostrarBienvenida = true;
          this.productos = [];
          console.log('🎯 Componente: Mostrando pantalla de bienvenida');
        }
      })
    );

    // Suscribirse a los productos del servicio (único punto de carga inicial)
    this.subscriptions.add(
      this.catalogoService.productos$.subscribe(productos => {
        console.log('🎯 Componente: Productos recibidos del servicio:', Object.keys(productos));
        this.productosData = productos;
        // SIEMPRE cargar productos cuando lleguen datos (inicial + cambios de Excel)
        if (Object.keys(this.productosData).length > 0) {
          console.log("🎯 Componente: Datos disponibles, cargando productos para categoría:", this.categoria);
          this.cargarProductos();
        } else {
          console.log("🎯 Componente: Datos vacíos, esperando...");
        }
      })
    );

    // Suscribirse al estado de carga
    this.subscriptions.add(
      this.catalogoService.cargando$.subscribe(cargando => {
        console.log('🎯 Componente: Estado de carga recibido:', cargando);
        this.cargandoProductos = cargando;
      })
    );

    // Suscribirse a errores
    this.subscriptions.add(
      this.catalogoService.error$.subscribe(error => {
        console.log('🎯 Componente: Error recibido:', error);
        this.errorCarga = error;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  cargarProductos(): void {
    console.log('🎯 Componente: cargarProductos() - Categoría:', this.categoria);
    console.log('🎯 Componente: Datos disponibles:', Object.keys(this.productosData));
    
    // 🔍 LOG TEMPORAL: Mostrar todos los productos disponibles
    const totalProductos = Object.values(this.productosData).flat().length;
    console.log("📊 TOTAL PRODUCTOS EN EXCEL:", totalProductos);
    Object.keys(this.productosData).forEach(cat => {
      console.log(`📦 ${cat.toUpperCase()}: ${this.productosData[cat].length} productos`);
    });
    
    
    // Mostrar productos de la categoría específica
    this.productos = this.productosData[this.categoria as keyof typeof this.productosData] || [];
    console.log(`🎯 Componente: Cargando productos de ${this.categoria}:`, this.productos.length);
    
    // Mostrar imágenes de los primeros 3 productos para debug
    this.productos.slice(0, 3).forEach((producto, i) => {
      console.log(`🎯 Producto ${i+1}: "${producto.nombre}" → imagen: ${producto.imagen}`);
    });
  }

  /**
   * Método para recargar manualmente los productos desde Excel
   */

  obtenerTituloCategoria(): string {
    const titulos = {
      juguetes: 'Juguetes',
      ropa: 'Ropa y Moda',
      electronica: 'Electrónicos',
      hogar: 'Hogar y Decoración',
      deportes: 'Deportes y Fitness',
    };
    return titulos[this.categoria as keyof typeof titulos] || 'Catálogo';
  }

  obtenerIconoCategoria(): string {
    const iconos = {
      juguetes: '🧸',
      ropa: '👕',
      electronica: '📱',
      hogar: '🏡',
      deportes: '⚽',
    };
    return iconos[this.categoria as keyof typeof iconos] || '📦';
  }

  navegarACategoria(categoria: string): void {
    this.router.navigate(['/catalogo', categoria]);
  }

  trackByProducto(index: number, producto: any): number {
    return producto.id;
  }

  onImageError(event: any): void {
    console.warn('❌ Error cargando imagen:', event.target.src);
    
    // Ocultar imagen rota y mostrar un placeholder más sencillo
    event.target.style.display = 'none';
    
    // Crear un elemento de reemplazo más sencillo y menos confuso
    const parent = event.target.parentElement;
    if (parent && !parent.querySelector('.image-placeholder')) {
      const placeholder = document.createElement('div');
      placeholder.className = 'image-placeholder w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs flex-col rounded-lg min-h-[80px]';
      placeholder.innerHTML = '<span class="text-2xl">📷</span><span>Sin imagen</span>';
      parent.appendChild(placeholder);
    }
  }

  // Métodos del carrito
  agregarAlCarrito(producto: Producto): void {
    const productoExistente = this.carrito.find(item => item.id === producto.id);
    if (!productoExistente) {
      this.carrito.push(producto);
      this.mostrarNotificacion(`${producto.nombre} agregado al carrito`);
    } else {
      this.mostrarNotificacion(`${producto.nombre} ya está en el carrito`);
    }
  }

  eliminarDelCarrito(producto: Producto): void {
    this.carrito = this.carrito.filter(item => item.id !== producto.id);
  }

  toggleCarrito(): void {
    this.mostrarCarrito = !this.mostrarCarrito;
  }

  obtenerTotalCarrito(): number {
    return this.carrito.reduce((total, producto) => total + producto.precio, 0);
  }

  enviarPorWhatsApp(): void {
    if (this.carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    let mensaje = '🛍️ *VERABOX - Pedido*\n\n';
    mensaje += '📋 *Productos seleccionados:*\n\n';
    
    this.carrito.forEach((producto, index) => {
      mensaje += `${index + 1}. *${producto.nombre}*\n`;
      mensaje += `   💰 Precio: $${producto.precio}\n`;
      mensaje += `   📝 ${producto.descripcion}\n\n`;
    });

    mensaje += `💵 *Total: $${this.obtenerTotalCarrito().toFixed(2)}*\n\n`;
    mensaje += '📞 Por favor, confirma la disponibilidad y el proceso de compra.';

    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://wa.me/${this.numeroWhatsApp}?text=${mensajeCodificado}`;
    
    window.open(urlWhatsApp, '_blank');
  }

  vaciarCarrito(): void {
    this.carrito = [];
    this.mostrarCarrito = false;
  }

  estaEnCarrito(producto: Producto): boolean {
    return this.carrito.some(item => item.id === producto.id);
  }

  private mostrarNotificacion(mensaje: string): void {
    // Notificación mejorada con mejores estilos
    const notification = document.createElement('div');
    notification.className = 'notificacion-carrito fixed top-4 right-4 text-white px-6 py-4 rounded-lg z-50 transform translate-x-full transition-all duration-300 flex items-center';
    
    // Aplicar estilos directamente para sobrescribir Tailwind
    notification.style.background = "linear-gradient(135deg, #25d366, #128c7e)";
    notification.style.boxShadow = "0 4px 15px rgba(37, 211, 102, 0.3)";
    notification.style.color = "white";
    notification.style.fontWeight = "500";
    notification.innerHTML = `<span class="mr-2">✓</span><span>${mensaje}</span>`;
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animación de salida
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

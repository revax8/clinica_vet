import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExcelReaderService, ProductoExcel } from './excel-reader.service';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
  disponible: number; // 0 = no disponible, 1 = disponible
}

export interface ProductosPorCategoria {
  [key: string]: Producto[];
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  
  private productosSubject = new BehaviorSubject<ProductosPorCategoria>({});
  public productos$ = this.productosSubject.asObservable();
  
  private cargandoSubject = new BehaviorSubject<boolean>(false);
  public cargando$ = this.cargandoSubject.asObservable();
  
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private excelReaderService: ExcelReaderService) {
    console.log('🚀 CatalogoService: Inicializando...');
    // Iniciar carga inmediatamente - no necesitamos setTimeout
    this.cargarProductosDesdeExcel();
  }

  /**
   * Carga los productos desde el archivo Excel
   */
  async cargarProductosDesdeExcel(): Promise<void> {
    try {
      console.log('🎯 CatalogoService: INICIANDO carga de productos...');
      this.cargandoSubject.next(true);
      this.errorSubject.next(null);
      console.log('🎯 Estado carga actualizado a TRUE');
      
      console.log('🎯 CatalogoService: Llamando a ExcelReaderService...');
      
      // Timeout de 10 segundos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La carga tardó más de 10 segundos')), 10000);
      });
      
      const loadPromise = this.excelReaderService.leerProductosDesdeExcel();
      
      const productosExcel = await Promise.race([loadPromise, timeoutPromise]);
      console.log('✅ Productos obtenidos del Excel:', productosExcel.length);
      
      const productosOrganizados = this.excelReaderService.organizarProductosPorTipo(productosExcel);
      console.log('✅ Productos organizados:', productosOrganizados);
      
      // Convertir formato Excel a formato del componente
      const productosComponente: ProductosPorCategoria = {};
      
      Object.keys(productosOrganizados).forEach(categoria => {
        productosComponente[categoria] = productosOrganizados[categoria].map(p => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          imagen: p.imagen,
          descripcion: p.descripcion,
          disponible: p.disponible
        }));
      });
      
      this.productosSubject.next(productosComponente);
      
      const totalProductos = Object.values(productosComponente).reduce((total, cat) => total + cat.length, 0);
      console.log(`🎉 Catálogo actualizado automáticamente con ${totalProductos} productos desde Excel`);
      
    } catch (error) {
      console.error('💥 Error en CatalogoService:', error);
      const mensajeError = error instanceof Error ? error.message : 'Error desconocido';
      this.errorSubject.next(`${mensajeError}`);
      
      console.log("⚠️ NO se cargarán productos por defecto - Solo usando Excel");
      // Mantener catálogo vacío si hay error con Excel
      this.productosSubject.next({});
    } finally {
      console.log('🎯 CatalogoService: FINALIZANDO - Estado carga a FALSE');
      this.cargandoSubject.next(false);
      console.log('🎯 Estado carga actualizado a FALSE');
    }
  }

  /**
   * Recarga los productos (útil cuando el Excel cambia)
   */
  async recargarProductos(): Promise<void> {
    console.log('🔄 Recargando productos...');
    await this.cargarProductosDesdeExcel();
  }

  /**
   * Obtiene productos por categoría
   */
  obtenerProductosPorCategoria(categoria: string): Producto[] {
    const productos = this.productosSubject.value;
    if (categoria === 'todas') {
      return Object.values(productos).flat();
    }
    return productos[categoria] || [];
  }

  /**
   * Obtiene todos los productos
   */
  obtenerTodosLosProductos(): Producto[] {
    const productos = this.productosSubject.value;
    return Object.values(productos).flat();
  }

  /**
   * Busca productos por término
   */
  buscarProductos(termino: string): Producto[] {
    const todoProductos = this.obtenerTodosLosProductos();
    const terminoLimpio = termino.toLowerCase().trim();
    
    return todoProductos.filter(producto => 
      producto.nombre.toLowerCase().includes(terminoLimpio) ||
      producto.descripcion.toLowerCase().includes(terminoLimpio)
    );
  }

  /**
   * Productos por defecto como fallback
   */
}

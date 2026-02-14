import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

export interface ProductoExcel {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
  tipo: string;
  disponible: number; // 0 = no disponible, 1 = disponible
}

@Injectable({
  providedIn: 'root'
})
export class ExcelReaderService {

  constructor() { }

  async leerProductosDesdeExcel(): Promise<ProductoExcel[]> {
    try {
      console.log('🚀 INICIANDO LECTURA DE EXCEL...');
      
      // Usar Google Sheets como CSV
      const GOOGLE_SHEET_ID = '1S5NwTYzVhJFY72x-G1PJuYcGPFQTpJZ2LwIjwrVEZi4';
      const SHEET_NAME = 'Hoja3';
      const googleSheetsUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;
      
      console.log('📡 Descargando desde Google Sheets...');
      const response = await fetch(googleSheetsUrl);
      
      if (!response.ok) {
        console.error('❌ Error al descargar desde Google Sheets');
        console.log('⚠️ Intentando con archivo local como respaldo...');
        
        // Fallback al archivo local
        const localResponse = await fetch('/Descriptions.xlsx');
        if (!localResponse.ok) {
          throw new Error(`HTTP Error: ${localResponse.status} ${localResponse.statusText}`);
        }
        const arrayBuffer = await localResponse.arrayBuffer();
        return this.procesarArchivoExcel(arrayBuffer);
      }
      
      console.log('✅ Google Sheets descargado correctamente');
      
      const csvText = await response.text();
      return this.procesarGoogleSheetsCSV(csvText);
      
    } catch (error) {
      console.error('💥 ERROR en lectura de Excel:', error);
      throw error;
    }
  }

  private procesarGoogleSheetsCSV(csvText: string): ProductoExcel[] {
    console.log('📊 Procesando CSV de Google Sheets...');
    
    const lines = csvText.split('\n');
    if (lines.length < 2) {
      throw new Error('El CSV no tiene suficientes filas');
    }
    
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    console.log('📋 Columnas encontradas:', headers);
    
    const productos: ProductoExcel[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = this.parseCSVLine(line);
      if (values.length !== headers.length) continue;
      
      const row: Record<string, any> = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      
      const precioRaw = row['precio'] || row['Precio'] || row['price'] || row['Price'];
      const tienePrecio = precioRaw && 
                         precioRaw !== '' && 
                         precioRaw !== 0 && 
                         precioRaw !== '0' &&
                         !isNaN(parseFloat(precioRaw.toString().replace(/[,$]/g, '')));
      
      if (!tienePrecio) {
        console.log(`❌ FILA ${i + 1} IGNORADA - Sin precio válido:`, precioRaw);
        continue;
      }
      
      const imagenRaw = this.parseString(row["imagen"] || row["Imagen"] || row["image"] || row["Image"]);
      const producto: ProductoExcel = {
        id: this.parseNumber(row["id"] || row["Id"] || row["ID"]),
        nombre: this.parseString(row["nombre"] || row["Nombre"] || row["name"] || row["Name"]),
        precio: this.parseNumber(row["precio"] || row["Precio"] || row["price"] || row["Price"]),
        imagen: this.normalizarRutaImagen(imagenRaw),
        descripcion: this.parseString(row["descripcion"] || row["Descripcion"] || row["description"] || row["Description"]),
        tipo: this.parseString(row["tipo"] || row["Tipo"] || row["category"] || row["Category"]).toLowerCase(),
        disponible: this.parseNumber(row["disponible"] || row["Disponible"] || row["available"] || row["Available"])
      };
      
      if (producto.id >= 0 && producto.nombre && producto.precio > 0 && producto.imagen) {
        productos.push(producto);
        console.log(`✅ ${i}. "${producto.nombre}" → $${producto.precio}`);
      }
    }
    
    console.log(`✅ PROCESADOS ${productos.length} productos válidos`);
    
    if (productos.length === 0) {
      return [{
        id: 1,
        nombre: 'Producto de Ejemplo',
        precio: 99.99,
        imagen: '/23712_890.jpg',
        descripcion: 'Producto cargado desde Google Sheets',
        tipo: "juguetes",
        disponible: 1
      }];
    }
    
    return productos;
  }

  private parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i-1] === ',')) {
        inQuotes = true;
      } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i+1] === ',')) {
        inQuotes = false;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current.trim());
    return values;
  }

  private procesarArchivoExcel(arrayBuffer: ArrayBuffer): ProductoExcel[] {
    console.log(`📊 Tamaño del archivo: ${arrayBuffer.byteLength} bytes`);
    
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    console.log('📋 Hojas disponibles:', workbook.SheetNames);
    
    let worksheet = workbook.Sheets['Hoja3'] || workbook.Sheets['Hoja1'] || workbook.Sheets['Sheet1'];
    
    if (!worksheet) {
      throw new Error('No hay hojas válidas en el Excel');
    }
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(`📄 ${jsonData.length} filas encontradas`);
    
    if (jsonData.length === 0) {
      throw new Error('La hoja Excel no contiene datos');
    }
    
    const productos: ProductoExcel[] = [];
    
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i] as Record<string, any>;
      
      const precioRaw = row['precio'] || row['Precio'] || row['price'] || row['Price'];
      const tienePrecio = precioRaw && 
                         precioRaw !== '' && 
                         precioRaw !== 0 && 
                         precioRaw !== '0' &&
                         !isNaN(parseFloat(precioRaw.toString().replace(/[,$]/g, '')));
      
      if (!tienePrecio) {
        continue;
      }
      
      const imagenRaw = this.parseString(row["imagen"] || row["Imagen"] || row["image"] || row["Image"]);
      const producto: ProductoExcel = {
        id: this.parseNumber(row["id"] || row["Id"] || row["ID"]),
        nombre: this.parseString(row["nombre"] || row["Nombre"] || row["name"] || row["Name"]),
        precio: this.parseNumber(row["precio"] || row["Precio"] || row["price"] || row["Price"]),
        imagen: this.normalizarRutaImagen(imagenRaw),
        descripcion: this.parseString(row["descripcion"] || row["Descripcion"] || row["description"] || row["Description"]),
        tipo: this.parseString(row["tipo"] || row["Tipo"] || row["category"] || row["Category"]).toLowerCase(),
        disponible: this.parseNumber(row["disponible"] || row["Disponible"] || row["available"] || row["Available"])
      };
      
      if (producto.id >= 0 && producto.nombre && producto.precio > 0 && producto.imagen) {
        productos.push(producto);
      }
    }
    
    if (productos.length === 0) {
      return [{
        id: 1,
        nombre: 'Producto de Ejemplo',
        precio: 99.99,
        imagen: '/23712_890.jpg',
        descripcion: 'Producto cargado desde Excel',
        tipo: "juguetes",
        disponible: 1
      }];
    }
    
    return productos;
  }

  organizarProductosPorTipo(productos: ProductoExcel[]): { [key: string]: ProductoExcel[] } {
    const productosOrganizados: { [key: string]: ProductoExcel[] } = {
      juguetes: [],
      ropa: [],
      accesorios: [],
      perfumes: [],
      deportes: []
    };

    productos.forEach(producto => {
      const tipo = this.normalizarTipo(producto.tipo);
      productosOrganizados[tipo].push(producto);
    });

    return productosOrganizados;
  }

  private normalizarTipo(tipo: string): string {
    const tipoLimpio = tipo.toLowerCase().trim();
    
    if (tipoLimpio.includes('juguete')) return 'juguetes';
    if (tipoLimpio.includes('ropa')) return 'ropa';
    if (tipoLimpio.includes('accesorio')) return 'accesorios';
    if (tipoLimpio.includes('perfume')) return 'perfumes';
    if (tipoLimpio.includes('deporte') || tipoLimpio.includes('sport')) return 'deportes';
    
    return 'juguetes';
  }

  private parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(/[,$]/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  private parseString(value: any): string {
    if (typeof value === 'string') return value.trim();
    if (value !== null && value !== undefined) return String(value).trim();
    return '';
  }

  private normalizarRutaImagen(imagenRaw: string): string {
    if (!imagenRaw) return '';
    
    const archivosExistentes = [
      '0_190.JPG', '0_400.jpg', '16431_450.JPG', '17292_259.JPG', 
      '18452_150.JPG', '23712_890.jpg', '54535_110.JPG', '5913_249.JPG',
      '60498_185.JPG', '6118_249.JPG', '67764_250.JPG', '67887_560.JPG',
      '71590_185.JPG', '71613_180.JPG', '71613_185.JPG', '71774_150.JPG',
      '72702_149.JPG', '74511_370.JPG', '76133_260.JPG', '76355_298.JPG',
      '80367_150.JPG', '80812_180.JPG', '80898_160.JPG', '81261_180.JPG',
      '81963_350.JPG', '91989_485.JPG', '93541_296.JPG'
    ];
    
    let nombreLimpio = imagenRaw.startsWith('/') ? imagenRaw.substring(1) : imagenRaw;
    
    const archivoEncontrado = archivosExistentes.find(archivo => {
      const sinExtension = archivo.split('.')[0];
      const nombreSinExtension = nombreLimpio.split('.')[0];
      return sinExtension === nombreSinExtension;
    });
    
    if (archivoEncontrado) {
      return '/' + archivoEncontrado;
    }
    
    return '/' + nombreLimpio;
  }
}
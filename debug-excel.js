const XLSX = require('xlsx');
const fs = require('fs');

console.log('🔍 ANALIZANDO ARCHIVO EXCEL...\n');

try {
    // Leer el archivo Excel
    const workbook = XLSX.readFile('./public/Descriptions.xlsx');
    console.log('📋 Hojas disponibles:', workbook.SheetNames);
    
    // Usar la primera hoja disponible
    const sheetName = workbook.SheetNames.find(name => 
        name === 'Hoja3' || name === 'Hoja1' || name === 'Sheet1'
    ) || workbook.SheetNames[0];
    
    console.log(`✅ Usando hoja: "${sheetName}"`);
    
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`📄 Total de filas: ${jsonData.length}\n`);
    
    if (jsonData.length > 0) {
        // Mostrar columnas disponibles
        const primeraFila = jsonData[0];
        console.log('📋 COLUMNAS DISPONIBLES:');
        Object.keys(primeraFila).forEach((col, i) => {
            console.log(`   ${i + 1}. "${col}"`);
        });
        
        console.log('\n🔍 PRIMERAS 5 FILAS DE DATOS:');
        console.log('=' * 60);
        
        // Mostrar las primeras 5 filas para detectar problemas
        jsonData.slice(0, 5).forEach((row, i) => {
            console.log(`\n📦 FILA ${i + 1}:`);
            console.log(`   ID: ${row.id || row.Id || row.ID || 'NO_ENCONTRADO'}`);
            console.log(`   NOMBRE: ${row.nombre || row.Nombre || row.name || row.Name || 'NO_ENCONTRADO'}`);
            console.log(`   PRECIO: ${row.precio || row.Precio || row.price || row.Price || 'NO_ENCONTRADO'}`);
            console.log(`   IMAGEN: ${row.imagen || row.Imagen || row.image || row.Image || 'NO_ENCONTRADO'}`);
            console.log(`   TIPO: ${row.tipo || row.Tipo || row.category || row.Category || 'NO_ENCONTRADO'}`);
            
            // Verificar si tiene precio válido
            const precioRaw = row.precio || row.Precio || row.price || row.Price;
            const tienePrecio = precioRaw && precioRaw !== '' && precioRaw !== 0 && precioRaw !== '0';
            console.log(`   ✅ PRECIO VÁLIDO: ${tienePrecio ? 'SÍ' : 'NO'}`);
        });
        
        // Estadísticas de productos válidos vs inválidos
        console.log('\n📊 ESTADÍSTICAS:');
        console.log('=' * 40);
        
        let validos = 0;
        let sinPrecio = 0;
        let sinNombre = 0;
        let sinImagen = 0;
        
        jsonData.forEach((row) => {
            const precioRaw = row.precio || row.Precio || row.price || row.Price;
            const nombre = row.nombre || row.Nombre || row.name || row.Name;
            const imagen = row.imagen || row.Imagen || row.image || row.Image;
            
            const tienePrecio = precioRaw && precioRaw !== '' && precioRaw !== 0 && precioRaw !== '0';
            
            if (!tienePrecio) sinPrecio++;
            if (!nombre) sinNombre++;
            if (!imagen) sinImagen++;
            if (tienePrecio && nombre && imagen) validos++;
        });
        
        console.log(`   Total filas: ${jsonData.length}`);
        console.log(`   ✅ Productos válidos: ${validos}`);
        console.log(`   ❌ Sin precio: ${sinPrecio}`);
        console.log(`   ❌ Sin nombre: ${sinNombre}`);
        console.log(`   ❌ Sin imagen: ${sinImagen}`);
        
        // Buscar específicamente el problema que mencionaste
        console.log('\n🔍 BUSCANDO DISCREPANCIAS NOMBRE-IMAGEN:');
        console.log('=' * 50);
        
        jsonData.forEach((row, i) => {
            const nombre = row.nombre || row.Nombre || row.name || row.Name;
            const imagen = row.imagen || row.Imagen || row.image || row.Image;
            
            if (nombre && imagen) {
                if (nombre.toLowerCase().includes('mario') || imagen.includes('76355')) {
                    console.log(`\n🎯 FILA ${i + 1} (Mario/76355):`);
                    console.log(`   NOMBRE: "${nombre}"`);
                    console.log(`   IMAGEN: "${imagen}"`);
                }
            }
        });
    }
    
} catch (error) {
    console.error('💥 ERROR:', error.message);
}

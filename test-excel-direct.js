// Test directo del Excel Reader Service
const XLSX = require('xlsx');
const fs = require('fs');

async function testExcelReader() {
    try {
        console.log('🚀 Probando lectura directa del Excel...');
        
        // Leer el archivo Excel
        const workbook = XLSX.readFile('./public/Descriptions.xlsx');
        console.log('📋 Hojas disponibles:', workbook.SheetNames);
        
        // Usar la hoja correcta
        let worksheet = workbook.Sheets['Hoja3'] || workbook.Sheets['Hoja1'] || workbook.Sheets['Sheet1'];
        
        if (!worksheet) {
            throw new Error('No hay hojas válidas en el Excel');
        }
        
        const nombreHoja = workbook.SheetNames.find(name => workbook.Sheets[name] === worksheet) || 'desconocida';
        console.log(`✅ Usando hoja: "${nombreHoja}"`);
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log(`📄 ${jsonData.length} filas encontradas`);
        
        if (jsonData.length === 0) {
            console.log('❌ No hay datos en el Excel');
            return;
        }
        
        // Mostrar primeras 3 filas
        console.log('\n📋 ESTRUCTURA DE DATOS:');
        console.log('Columnas:', Object.keys(jsonData[0]));
        
        console.log('\n📋 PRIMERAS 3 FILAS:');
        
        console.log("\n🔍 PRODUCTOS CON ID = 0:");
        jsonData.forEach((row, i) => {
            if (row.id === 0 || row.id === "0") {
                console.log(`Fila ${i + 1} (ID=0):`, row);
            }
        });
        jsonData.slice(0, 3).forEach((row, i) => {
            console.log(`Fila ${i + 1}:`, row);
        });
        
        // Contar productos con precio válido
        let productosValidos = 0;
        let productosSinPrecio = 0;
        
        jsonData.forEach((row, i) => {
            const precioRaw = row['precio'] || row['Precio'] || row['price'] || row['Price'];
            const tienePrecio = precioRaw && 
                               precioRaw !== '' && 
                               precioRaw !== 0 && 
                               precioRaw !== '0' &&
                               !isNaN(parseFloat(precioRaw.toString().replace(/[,$]/g, '')));
            
            if (tienePrecio) {
                productosValidos++;
            } else {
                productosSinPrecio++;
                console.log(`❌ Fila ${i + 1} sin precio válido:`, precioRaw);
            }
        });
        
        console.log(`\n📊 RESUMEN:`);
        console.log(`✅ Productos válidos: ${productosValidos}`);
        console.log(`❌ Productos sin precio: ${productosSinPrecio}`);
        console.log(`📄 Total filas: ${jsonData.length}`);
        
    } catch (error) {
        console.error('💥 ERROR:', error.message);
    }
}

testExcelReader();

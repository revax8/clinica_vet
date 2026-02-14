const XLSX = require("xlsx");

async function testTotalProductos() {
    const workbook = XLSX.readFile("./public/Descriptions.xlsx");
    const worksheet = workbook.Sheets["Hoja3"];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log("🧮 CONTEO TOTAL DE PRODUCTOS VÁLIDOS:");
    
    let productosValidos = 0;
    let productosSinPrecio = 0;
    let productosConId0 = 0;
    
    jsonData.forEach((row, i) => {
        const precioRaw = row["precio"] || row["Precio"] || row["price"] || row["Price"];
        const tienePrecio = precioRaw && 
                           precioRaw !== "" && 
                           precioRaw !== 0 && 
                           precioRaw !== "0" &&
                           !isNaN(parseFloat(precioRaw.toString().replace(/[,$]/g, "")));
        
        // Simular la nueva validación: id >= 0
        const idValido = (row.id >= 0);
        const nombreValido = row.nombre && row.nombre.trim() !== "";
        const imagenValida = row.imagen && row.imagen.trim() !== "";
        
        if (idValido && nombreValido && tienePrecio && imagenValida) {
            productosValidos++;
            if (row.id === 0) {
                productosConId0++;
                console.log(`✅ ID=0: "${row.nombre}" - $${precioRaw}`);
            }
        } else {
            productosSinPrecio++;
        }
    });
    
    console.log(`\n📊 RESULTADO:`);
    console.log(`✅ Productos válidos TOTAL: ${productosValidos}`);
    console.log(`✅ Productos con ID=0 incluidos: ${productosConId0}`);
    console.log(`❌ Productos sin precio: ${productosSinPrecio}`);
    console.log(`📄 Total filas: ${jsonData.length}`);
    
    console.log(`\n🎯 ANTES: 27 productos (sin ID=0)`);
    console.log(`🎯 AHORA: ${productosValidos} productos (con ID=0)`);
}

testTotalProductos();

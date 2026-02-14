const archivosExistentes = [
  '0_190.JPG', '0_400.jpg', '16431_450.JPG', '17292_259.JPG', 
  '18452_150.JPG', '23712_890.jpg', '54535_110.JPG', '5913_249.JPG',
  '60498_185.JPG', '6118_249.JPG', '67764_250.JPG', '67887_560.JPG',
  '71590_185.JPG', '71613_180.JPG', '71613_185.JPG', '71774_150.JPG',
  '72702_149.JPG', '74511_370.JPG', '76133_260.JPG', '76355_298.JPG',
  '80367_150.JPG', '80812_180.JPG', '80898_160.JPG', '81261_180.JPG',
  '81963_350.JPG', '91989_485.JPG', '93541_296.JPG'
];

function normalizarRutaImagen(imagenRaw) {
  if (!imagenRaw) return '';
  
  // Limpiar la ruta
  let nombreLimpio = imagenRaw.startsWith('/') ? imagenRaw.substring(1) : imagenRaw;
  
  // Buscar el archivo que realmente existe (probando ambas extensiones)
  const archivoEncontrado = archivosExistentes.find(archivo => {
    // Comparar sin extensión
    const sinExtension = archivo.split('.')[0];
    const nombreSinExtension = nombreLimpio.split('.')[0];
    return sinExtension === nombreSinExtension;
  });
  
  if (archivoEncontrado) {
    const rutaNormalizada = '/' + archivoEncontrado;
    console.log(`🖼️ ${imagenRaw} → ${rutaNormalizada} ✅`);
    return rutaNormalizada;
  }
  
  // Si no se encuentra, usar la ruta original
  const rutaOriginal = '/' + nombreLimpio;
  console.log(`🖼️ ${imagenRaw} → ${rutaOriginal} ⚠️ (no encontrada)`);
  return rutaOriginal;
}

// Probar con ejemplos del Excel
console.log('🧪 PRUEBAS DE NORMALIZACIÓN:');
console.log('');

const ejemplosDelExcel = [
  '54535_110.jpg',  // Debería encontrar 54535_110.JPG
  '67887_560.jpg',  // Debería encontrar 67887_560.JPG
  '91989_485.jpg',  // Debería encontrar 91989_485.JPG
  '23712_890.jpg',  // Debería encontrar 23712_890.jpg (ya existe con minúscula)
  '0_400.jpg',      // Debería encontrar 0_400.jpg (ya existe con minúscula)
  'inexistente.jpg' // No debería encontrarlo
];

ejemplosDelExcel.forEach(ejemplo => {
  normalizarRutaImagen(ejemplo);
});

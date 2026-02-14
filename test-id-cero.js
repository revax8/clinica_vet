const XLSX = require("xlsx");

async function testId0() {
    const workbook = XLSX.readFile("./public/Descriptions.xlsx");
    const worksheet = workbook.Sheets["Hoja3"];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log("🔍 Productos con ID = 0:");
    let count = 0;
    jsonData.forEach((row, i) => {
        if (row.id === 0 || row.id === "0") {
            count++;
            console.log(`${count}. "${row.nombre}" - $${row.precio} - ${row.imagen}`);
        }
    });
    
    console.log(`\n📊 Total productos con ID=0: ${count}`);
}

testId0();

# 🚀 GUÍA RÁPIDA DE DEPLOYMENT - VERABOX

## ⚡ **COMANDOS ESENCIALES**

### 🔧 **Desarrollo**
```bash
# Iniciar servidor de desarrollo
npm run dev

# O en puerto específico
ng serve --port 4201
```

### 📦 **Build para Producción**
```bash
# Build optimizado
npm run build:prod

# Verificar output
ls -la dist/core/
```

### 🌐 **Deploy Opciones**

#### **1. Static Hosting (Recomendado)**
```bash
# 1. Build
npm run build:prod

# 2. Subir contenido de /dist/core/ a:
# - Netlify (drag & drop)
# - Vercel (connect GitHub)
# - GitHub Pages
```

#### **2. VPS con Node.js**
```bash
# 1. Build
npm run build:prod

# 2. Servidor SSR
npm run serve:ssr:core

# 3. Puerto por defecto: 4000
```

#### **3. GitHub Pages**
```bash
# Install gh-pages (ya incluido)
ng add angular-cli-ghpages

# Deploy automático
ng deploy --base-href=/tu-repo-name/
```

## 🔍 **Verificaciones Pre-Deploy**

### ✅ **Checklist**
- [ ] `npm run build:prod` ejecuta sin errores
- [ ] Todas las imágenes cargan correctamente
- [ ] Modal de zoom funciona
- [ ] Carrito agrega/elimina productos
- [ ] WhatsApp abre con mensaje correcto
- [ ] Navegación entre categorías funcional
- [ ] Responsive en móvil y desktop

### 🧪 **Testing Rápido**
```bash
# 1. Build local
npm run build:prod

# 2. Servir estático (opcional)
npx serve dist/core -p 8080

# 3. Probar en: http://localhost:8080
```

## 📱 **URLs Post-Deploy**

Después del deploy, estas rutas deben funcionar:
- `/` → Home
- `/catalogo/todas` → Catálogo completo
- `/catalogo/juguetes` → Juguetes
- `/catalogo/ropa` → Ropa
- `/catalogo/electronica` → Electrónicos
- `/catalogo/hogar` → Hogar
- `/catalogo/deportes` → Deportes
- `/contacto` → Contacto

## ⚙️ **Variables de Entorno**

### WhatsApp Number
```typescript
// En catalogo.component.ts línea 28
numeroWhatsApp: string = '4623266568';
```

Para cambiar número:
1. Editar `src/app/Components/catalogo/catalogo.component.ts`
2. Cambiar valor en `numeroWhatsApp`
3. Rebuild: `npm run build:prod`

## 🆘 **Troubleshooting**

### Error: "Cannot find module '@angular/platform-server'"
```bash
npm install @angular/platform-server@^19.2.0 --legacy-peer-deps
```

### Error: Images not loading
- Verificar que imágenes estén en `/public/`
- Usar nombres exactos (case-sensitive)
- Rebuild después de agregar imágenes

### Error: Routes not working
- Verificar server redirects para SPAs
- En Netlify: crear `_redirects` file
- En Apache: configurar `.htaccess`

## 🎯 **Hosting Recomendado**

### 🥇 **Mejor opción: Netlify**
1. Conectar GitHub repo
2. Build command: `npm run build:prod`
3. Publish directory: `dist/core`
4. Deploy automático en cada push

### 🥈 **Alternativa: Vercel**
1. Import GitHub repo
2. Framework preset: Angular
3. Deploy automático configurado

---

**¡VERABOX listo para el mundo! 🌟**

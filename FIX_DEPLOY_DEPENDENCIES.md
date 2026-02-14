# ⚠️ SOLUCIÓN - Error "Installing dependencies..." en Deploy

## 🐛 **Problema Común**
Durante el deploy a producción, muchas plataformas de hosting fallan con:
```
Installing dependencies...
Error: Conflicting peer dependencies
```

## 🔧 **Soluciones por Plataforma**

### 🚀 **1. Netlify**

#### Opción A: Configurar npm settings
Crear archivo `.npmrc` en la raíz del proyecto:

```
legacy-peer-deps=true
fund=false
audit=false
```

#### Opción B: Usar configuración específica
```toml
# netlify.toml
[build]
  command = "npm install --legacy-peer-deps && npm run build:prod"
  publish = "dist/core"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"
```

### ⚡ **2. Vercel**

#### Crear `vercel.json`:
```json
{
  "version": 2,
  "installCommand": "npm install --legacy-peer-deps",
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist/core",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 🌐 **3. GitHub Pages con Actions**

#### Crear `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install --legacy-peer-deps
      
    - name: Build
      run: npm run build:prod
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist/core
```

### 🔧 **4. Railway/Render/Heroku**

#### Crear `.buildpacks`:
```
heroku/nodejs
```

#### Variables de entorno:
```
NPM_CONFIG_LEGACY_PEER_DEPS=true
NODE_VERSION=18.x
```

## 🛠️ **Solución Universal**

### 1. **Limpiar dependencias conflictivas**
```bash
# En tu máquina local
cd /Users/adrianresendis/Documents/Dev/Angular/core

# Limpiar todo
rm -rf node_modules package-lock.json
rm -rf .angular

# Reinstalar limpiamente
npm install --legacy-peer-deps

# Generar nuevo lock file
npm update --legacy-peer-deps
```

### 2. **Verificar build local**
```bash
# Verificar que funciona localmente
npm run build:prod

# Si funciona, commit y push
git add .
git commit -m "fix: resolve dependency conflicts for deployment"
git push origin main
```

### 3. **Script de deployment robusto**
Agregar al `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm install --legacy-peer-deps",
    "deploy:netlify": "npm run predeploy && npm run build:prod",
    "deploy:vercel": "npm run predeploy && npm run build:prod",
    "deploy:github": "npm run predeploy && npm run build:prod"
  }
}
```

## 🎯 **Recomendación Específica para VERABOX**

### Usar Netlify (Más fácil):
1. **Crear cuenta en Netlify**
2. **Conectar GitHub repo**
3. **Configuración automática**:
   - Build command: `npm install --legacy-peer-deps && npm run build:prod`
   - Publish directory: `dist/core`
   - Node version: `18`

### Deploy manual rápido:
```bash
# 1. Build local
npm run build:prod

# 2. Instalar Netlify CLI
npm install -g netlify-cli

# 3. Deploy manual
netlify deploy --dir=dist/core --prod
```

## 📋 **Checklist Pre-Deploy**

- [ ] ✅ Crear archivo `.npmrc` con `legacy-peer-deps=true`
- [ ] ✅ `npm run build:prod` funciona localmente
- [ ] ✅ Todas las imágenes están en `/public/`
- [ ] ✅ Rutas configuradas correctamente
- [ ] ✅ WhatsApp number configurado
- [ ] ✅ Commit y push a GitHub

## 🆘 **Si Persiste el Error**

### Plan B - Deploy estático sin SSR:
```bash
# Crear build SPA simple
ng build --configuration production --output-hashing all

# Deploy solo archivos estáticos
# (Perderás SSR pero ganarás compatibilidad)
```

---

**Siguiente paso**: Elegir tu plataforma preferida y seguir las instrucciones específicas.

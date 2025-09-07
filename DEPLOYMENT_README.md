# 🚀 GPR Frontend - Deployment Guide

## Quick Deployment

### For Linux/Ubuntu Server:
```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### For Windows Server:
```powershell
# Run deployment script
.\deploy.ps1
```

### Manual Deployment:
```bash
# Install dependencies
npm install

# Optional: Install node types (if needed)
npm install --save-dev @types/node

# Build for production
npm run build

# The built files will be in ./dist/
```

---

## 🏗️ Server Configuration

### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/gpr/dist;
    index index.html;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy (if backend on same server)
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Apache Configuration (.htaccess):
```apache
RewriteEngine On
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

---

## 🔧 Environment Configuration

### Create `.env.production` file:
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_TITLE=GPR - Photography Equipment Rental
```

### Backend API Setup:
1. Copy Laravel backend files from documentation
2. Configure database connections
3. Run migrations: `php artisan migrate`
4. Set up cache: `php artisan cache:clear`

---

## 📱 Features Deployed

### ✅ Frontend Features:
- **Advanced Search**: Fuzzy matching, autocomplete, typo tolerance
- **Booking System**: Date picker, cart management, WhatsApp integration
- **Performance**: Code splitting, lazy loading, optimized bundles
- **Mobile First**: Responsive design for all devices
- **PWA Ready**: Service worker, caching strategies

### ✅ Backend Integration Ready:
- **Search API**: `/api/search/`, `/api/search/autocomplete`
- **Availability API**: `/api/availability/check`, `/api/availability/check-multiple`
- **Statistics**: `/api/search/stats`, `/api/availability/stats`

---

## 🔍 Testing Checklist

### After Deployment:
- [ ] Homepage loads correctly
- [ ] Navigation works (React Router)
- [ ] Search functionality works
- [ ] Product/bundling pages load
- [ ] Cart functionality works
- [ ] Mobile responsive design
- [ ] API endpoints respond correctly

### Performance Checks:
- [ ] Lighthouse score > 90
- [ ] Bundle size < 1.5MB
- [ ] First contentful paint < 2s
- [ ] Time to interactive < 3s

---

## 🚨 Troubleshooting

### Common Issues:

**1. "Cannot find type definition file for 'node'"**
```bash
# Solution: Node types are optional, build should work without them
npm run build
```

**2. "404 on page refresh"**
```bash
# Solution: Configure web server for SPA routing (see server config above)
```

**3. "API calls failing"**
```bash
# Check CORS configuration in Laravel
# Verify API endpoints are accessible
# Check network tab in browser dev tools
```

**4. "Build too slow"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Production Monitoring

### Recommended Tools:
- **Performance**: Google Analytics, Lighthouse CI
- **Error Tracking**: Sentry.io
- **Uptime**: UptimeRobot
- **API Monitoring**: Postman monitoring

### Key Metrics to Track:
- Page load times
- Search response times
- Booking conversion rates
- Cart abandonment rates
- Mobile usage patterns

---

## 🎯 Next Steps After Deployment

1. **Test All Features**: Complete user journey testing
2. **SEO Optimization**: Meta tags, sitemap, robots.txt
3. **Analytics Setup**: Google Analytics, conversion tracking
4. **Security**: SSL certificate, security headers
5. **Backup Strategy**: Database and file backups
6. **Monitoring**: Error tracking and performance monitoring

---

## 📞 Support

If you encounter issues during deployment:

1. Check the browser console for errors
2. Verify server logs for any backend issues
3. Test API endpoints with Postman
4. Review the `BACKEND_API_INTEGRATION.md` for API setup

---

**🎉 Your GPR application is now ready for production! 🚀**

*Built with React 18, TypeScript, Vite, and Laravel integration*

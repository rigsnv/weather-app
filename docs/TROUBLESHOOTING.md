# Troubleshooting Guide

This guide helps you resolve common issues when developing or deploying the Weather App.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Development Issues](#development-issues)
- [API Issues](#api-issues)
- [Build Issues](#build-issues)
- [Deployment Issues](#deployment-issues)
- [Runtime Issues](#runtime-issues)
- [Performance Issues](#performance-issues)

## Installation Issues

### Node.js Version Conflicts

**Problem**: Errors related to Node.js version compatibility
```bash
error @vitejs/plugin-react@4.6.0: The engine "node" is incompatible
```

**Solution**:
1. Check your Node.js version:
   ```bash
   node --version
   ```
2. Upgrade to Node.js 18+ if needed:
   ```bash
   # Using nvm
   nvm install 18
   nvm use 18
   ```

### NPM Package Installation Failures

**Problem**: Package installation fails
```bash
npm ERR! peer dep missing
```

**Solution**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```
2. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Development Issues

### Environment Variables Not Loading

**Problem**: App can't access environment variables
```javascript
console.log(import.meta.env.VITE_MET_OFFICE_API_KEY); // undefined
```

**Solution**:
1. Check `.env` file exists in project root
2. Ensure variables start with `VITE_`:
   ```bash
   VITE_MET_OFFICE_API_KEY=your_key_here
   ```
3. Restart development server:
   ```bash
   npm run dev
   ```

### Hot Module Replacement Not Working

**Problem**: Changes not reflected in browser

**Solution**:
1. Check if files are being watched:
   ```bash
   # Add to vite.config.js
   export default defineConfig({
     server: {
       watch: {
         usePolling: true
       }
     }
   })
   ```

### Import/Export Errors

**Problem**: Module import errors
```javascript
SyntaxError: The requested module does not provide an export named 'default'
```

**Solution**:
1. Check import syntax:
   ```javascript
   // Correct
   import WeatherIcon from './WeatherIcon.jsx';
   
   // Incorrect
   import { WeatherIcon } from './WeatherIcon.jsx';
   ```

## API Issues

### Met Office API Key Invalid

**Problem**: 401 Unauthorized errors
```
HTTP error! status: 401
```

**Solution**:
1. Verify API key in Met Office dashboard
2. Check key format (should be a JWT token)
3. Ensure key has proper permissions
4. Regenerate key if necessary

### API Rate Limiting

**Problem**: 429 Too Many Requests
```
HTTP error! status: 429
```

**Solution**:
1. Check your usage in Met Office dashboard
2. Implement request caching:
   ```javascript
   // Cache API responses for 10 minutes
   const CACHE_DURATION = 10 * 60 * 1000;
   ```
3. Add delays between requests

### CORS Issues

**Problem**: CORS policy blocks API requests
```
Access to fetch has been blocked by CORS policy
```

**Solution**:
1. Use backend proxy for production
2. For development, add CORS extension to browser
3. Configure API server to allow your domain

### Geolocation Denied

**Problem**: User denies location access
```
GeolocationPositionError: User denied the request for Geolocation
```

**Solution**:
1. Provide fallback location input:
   ```javascript
   // Add manual location input component
   const [manualLocation, setManualLocation] = useState('');
   ```
2. Use IP-based geolocation as fallback
3. Show helpful error message

## Build Issues

### Build Fails with TypeScript Errors

**Problem**: TypeScript compilation errors during build
```
error TS2304: Cannot find name 'process'
```

**Solution**:
1. Add type definitions:
   ```bash
   npm install --save-dev @types/node
   ```
2. Configure types in `vite.config.js`:
   ```javascript
   export default defineConfig({
     define: {
       global: 'globalThis',
     },
   })
   ```

### Missing Dependencies

**Problem**: Build fails due to missing packages
```
Module not found: Can't resolve 'dayjs'
```

**Solution**:
1. Install missing dependencies:
   ```bash
   npm install dayjs lucide-react
   ```
2. Check `package.json` for version conflicts

### Large Bundle Size

**Problem**: Built files are too large

**Solution**:
1. Analyze bundle size:
   ```bash
   npm run build -- --analyze
   ```
2. Implement code splitting:
   ```javascript
   const LazyComponent = lazy(() => import('./Component'));
   ```
3. Remove unused dependencies

## Deployment Issues

### Environment Variables Not Set

**Problem**: App works locally but fails in production
```
TypeError: Cannot read property of undefined
```

**Solution**:
1. Set environment variables in deployment platform:
   - Vercel: Project Settings > Environment Variables
   - Netlify: Site Settings > Environment Variables
   - Azure: Configuration > Application Settings

### 404 Errors on Refresh

**Problem**: Page refresh returns 404 error

**Solution**:
1. Configure redirects for SPA:
   ```javascript
   // netlify.toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Build Path Issues

**Problem**: Assets not loading correctly
```
Loading failed for the <script> with source "/assets/index.js"
```

**Solution**:
1. Configure base URL in `vite.config.js`:
   ```javascript
   export default defineConfig({
     base: '/your-app-path/',
   })
   ```

## Runtime Issues

### White Screen of Death

**Problem**: App loads but shows blank white screen

**Solution**:
1. Check browser console for errors
2. Verify all components are properly exported
3. Check for infinite loops in useEffect
4. Add error boundaries:
   ```javascript
   class ErrorBoundary extends Component {
     // Error boundary implementation
   }
   ```

### Weather Data Not Loading

**Problem**: App loads but no weather data appears

**Solution**:
1. Check network tab for failed requests
2. Verify API key is correct
3. Test API endpoint manually:
   ```bash
   curl -H "apikey: YOUR_KEY" "https://api.metoffice.gov.uk/..."
   ```
4. Check coordinates are valid

### Memory Leaks

**Problem**: App becomes slow over time

**Solution**:
1. Clean up event listeners:
   ```javascript
   useEffect(() => {
     const interval = setInterval(() => {}, 1000);
     return () => clearInterval(interval);
   }, []);
   ```
2. Use React.memo for expensive components
3. Avoid creating objects in render methods

## Performance Issues

### Slow Initial Load

**Problem**: App takes long time to load initially

**Solution**:
1. Implement lazy loading:
   ```javascript
   const Component = lazy(() => import('./Component'));
   ```
2. Optimize images and use WebP format
3. Enable compression on server
4. Use CDN for static assets

### Frequent API Calls

**Problem**: Too many API requests

**Solution**:
1. Implement caching:
   ```javascript
   const [weatherData, setWeatherData] = useState(null);
   const [lastFetch, setLastFetch] = useState(null);
   
   const shouldRefetch = !lastFetch || 
     Date.now() - lastFetch > 10 * 60 * 1000; // 10 minutes
   ```
2. Use debouncing for user input
3. Cache responses in localStorage

### Slow Rendering

**Problem**: UI updates are slow or janky

**Solution**:
1. Use React.memo for pure components:
   ```javascript
   const WeatherCard = React.memo(({ data }) => {
     // Component implementation
   });
   ```
2. Optimize re-renders with useMemo:
   ```javascript
   const processedData = useMemo(() => {
     return expensiveCalculation(data);
   }, [data]);
   ```

## Browser-Specific Issues

### Safari Geolocation Issues

**Problem**: Geolocation doesn't work in Safari

**Solution**:
1. Ensure HTTPS is used
2. Add user gesture requirement:
   ```javascript
   // Trigger geolocation on user interaction
   const handleGetLocation = () => {
     navigator.geolocation.getCurrentPosition(...);
   };
   ```

### Internet Explorer Compatibility

**Problem**: App doesn't work in older browsers

**Solution**:
1. Add polyfills for modern JavaScript features
2. Use Babel for broader browser support
3. Add browser compatibility warnings

## Debug Tools

### React Developer Tools

Install browser extension to debug React components:
- View component props and state
- Trace component renders
- Profile performance

### Network Monitoring

Use browser DevTools to monitor:
- API request/response times
- Failed network requests
- CORS issues

### Console Debugging

Add strategic console logs:
```javascript
console.log('API Response:', data);
console.log('User Location:', { latitude, longitude });
console.error('Error occurred:', error);
```

## Getting Help

If you're still experiencing issues:

1. **Search Issues**: Check existing [GitHub issues](https://github.com/rigsnv/weather-app/issues)
2. **Create New Issue**: Include:
   - Error messages
   - Browser/OS information
   - Steps to reproduce
   - Console logs
3. **Community Support**: Join discussions in GitHub Discussions
4. **Documentation**: Review API documentation for updates

## Useful Commands

```bash
# Clear all caches
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Debug build
npm run build -- --debug

# Check bundle size
npm run build && npx vite-bundle-analyzer dist

# Lint and fix issues
npm run lint -- --fix

# Test specific component
npm test -- --testNamePattern="WeatherCard"
```

Remember to always check the browser console first, as it often provides the most helpful error messages and debugging information.

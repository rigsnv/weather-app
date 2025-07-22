import { createRoot } from 'react-dom/client'
import WeatherApp from './WeatherApp.jsx'
import { StrictMode } from 'react'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <WeatherApp />
    </StrictMode>
)

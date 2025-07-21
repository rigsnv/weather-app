import { Sun, Moon, CloudSun, CloudFog, Cloud, CloudDrizzle, CloudRain, CloudRainWind, CloudSnow, CloudHail, CloudLightning, HelpCircle, CloudMoon } from 'lucide-react';

const weatherCodeMap = {
    0: { description: "Clear night", icon: Moon, color: "text-white" },
    1: { description: "Sunny day", icon: Sun, color: "text-yellow-300" },
    2: { description: "Partly cloudy", icon: CloudSun, color: "text-yellow-400"},
    '2n': { description: "Partly cloudy night", icon: CloudMoon, color: "text-white" },
    3: { description: "Partly cloudy", icon: CloudSun, color: "text-yellow-400"},
    '3n': { description: "Partly cloudy night", icon: CloudMoon, color: "text-white" },
    4: { description: "Not used", icon: HelpCircle, color: "text-white" },
    5: { description: "Mist", icon: CloudFog, color: "text-white" },
    6: { description: "Fog", icon: CloudFog, color: "white" },
    7: { description: "Cloudy", icon: Cloud, color: "text-gray-300" },
    8: { description: "Overcast", icon: Cloud, color: "text-gray-400" },
    9: { description: "Light rain shower", icon: CloudDrizzle, color: "text-blue-300" },
    10: { description: "Light rain shower", icon: CloudDrizzle, color: "text-blue-300" },
    11: { description: "Drizzle", icon: CloudDrizzle, color: "text-blue-300" },
    12: { description: "Light rain", icon: CloudRain, color: "text-blue-300" },
    13: { description: "Heavy rain shower", icon: CloudRainWind, color: "text-blue-300" },
    14: { description: "Heavy rain shower", icon: CloudRainWind, color: "text-blue-300" },
    15: { description: "Heavy rain", icon: CloudRainWind, color: "text-blue-300" },
    16: { description: "Sleet shower", icon: CloudSnow, color: "text-blue-200" },
    17: { description: "Sleet shower", icon: CloudSnow, color: "text-blue-200" },
    18: { description: "Sleet", icon: CloudSnow, color: "text-blue-200" },
    19: { description: "Hail shower", icon: CloudHail, color: "text-blue-100" },
    20: { description: "Hail shower", icon: CloudHail, color: "text-blue-100" },
    21: { description: "Hail", icon: CloudHail, color: "text-blue-100" },
    22: { description: "Light snow shower", icon: CloudSnow, color: "text-white" },
    23: { description: "Light snow shower", icon: CloudSnow, color: "text-white" },
    24: { description: "Light snow", icon: CloudSnow, color: "text-white" },
    25: { description: "Heavy snow shower", icon: CloudSnow, color: "text-white" },
    26: { description: "Heavy snow shower", icon: CloudSnow, color: "text-white" },
    27: { description: "Heavy snow", icon: CloudSnow, color: "text-white" },
    28: { description: "Thunder shower", icon: CloudLightning, color: "text-yellow-500" },
    29: { description: "Thunder shower", icon: CloudLightning, color: "text-yellow-500" },
    30: { description: "Thunder", icon: CloudLightning, color: "text-yellow-500" },
};

function uvIndexDescription(uvIndex) {
    return (
        uvIndex < 3 ? { "label": "Low", "advise": "Low exposure: No protection required. You can safely stay outside" } :
        uvIndex < 6 ? { "label": "Moderate", "advise": " Moderate exposure: Seek shade during midday hours, cover up and wear sunscreen" } :
        uvIndex < 8 ? { "label": "High", "advise": "High exposure: Seek shade during midday hours, cover up and wear sunscreen" } :
        uvIndex < 11 ? { "label": "Very High", "advise": "Very high exposure: Avoid being outside during midday hours. Shirt, sunscreen and hat are essential" } :
        { "label": "Extreme", "advise": "Extreme exposure: Avoid being outside during midday hours. Shirt, sunscreen and hat are essential" }
    );
};

function visibilityDescriptionMap(visibility) {
    return (
        visibility < 100 ? "Very Poor" :
        visibility < 4000 ? "Poor" :
        visibility < 10000 ? "Moderate":
        visibility < 20000 ? "Good":
        visibility < 40000 ?  "Very Good" :
        "Excellent"
    );
};

export { weatherCodeMap, uvIndexDescription, visibilityDescriptionMap };

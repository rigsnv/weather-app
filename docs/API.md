# API Documentation

This document provides detailed information about the APIs used in the Weather App.

## Met Office DataHub API

The app uses the Met Office DataHub Site-Specific Forecast API to retrieve weather data.

### Base URL

```
https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/
```

### Authentication

The API uses API key authentication passed in the headers:

```javascript
headers: {
  'accept': 'application/json',
  'apikey': 'your-api-key-here'
}
```

### Endpoints

#### Get Site-Specific Forecast

**GET** `/{timestep}?latitude={lat}&longitude={lon}&excludeParameterMetadata={bool}&includeLocationName={bool}`

**Parameters:**

| Parameter | Type | Required | Description | Options |
|-----------|------|----------|-------------|---------|
| `timestep` | string | Yes | Frequency of forecast data | `hourly`, `three-hourly`, `daily` |
| `latitude` | number | Yes | Latitude coordinate | -90 to 90 |
| `longitude` | number | Yes | Longitude coordinate | -180 to 180 |
| `excludeParameterMetadata` | boolean | No | Exclude parameter metadata | `TRUE`, `FALSE` (default) |
| `includeLocationName` | boolean | No | Include location name | `TRUE` (default), `FALSE` |

**Example Request:**

```bash
curl -X GET \
  "https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/hourly?latitude=51.5074&longitude=-0.1278&excludeParameterMetadata=FALSE&includeLocationName=TRUE" \
  -H "accept: application/json" \
  -H "apikey: your-api-key"
```

**Response Structure:**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "location": {
          "name": "London"
        },
        "requestPointDistance": 123.45,
        "modelRunDate": "2025-01-20T06:00:00Z",
        "timeSeries": [
          {
            "time": "2025-01-20T12:00:00Z",
            "screenTemperature": 15.2,
            "maxScreenAirTemp": 16.1,
            "minScreenAirTemp": 14.3,
            "screenDewPointTemperature": 8.7,
            "feelsLikeTemperature": 14.1,
            "windSpeed10m": 3.2,
            "windDirectionFrom10m": 225,
            "windGustSpeed10m": 5.8,
            "max10mWindGust": 7.2,
            "visibility": 15000,
            "screenRelativeHumidity": 65.3,
            "mslp": 101325,
            "uvIndex": 2,
            "significantWeatherCode": 1,
            "precipitationRate": 0.0,
            "totalPrecipAmount": 0.0,
            "totalSnowAmount": 0.0,
            "probOfPrecipitation": 5
          }
        ]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-0.1278, 51.5074]
      }
    }
  ]
}
```

### Weather Parameters

| Parameter | Unit | Description |
|-----------|------|-------------|
| `screenTemperature` | °C | Air temperature at 1.25m above ground |
| `maxScreenAirTemp` | °C | Maximum air temperature |
| `minScreenAirTemp` | °C | Minimum air temperature |
| `screenDewPointTemperature` | °C | Dew point temperature |
| `feelsLikeTemperature` | °C | Apparent temperature |
| `windSpeed10m` | m/s | Wind speed at 10m height |
| `windDirectionFrom10m` | degrees | Wind direction (0-360°) |
| `windGustSpeed10m` | m/s | Wind gust speed |
| `max10mWindGust` | m/s | Maximum wind gust |
| `visibility` | meters | Horizontal visibility |
| `screenRelativeHumidity` | % | Relative humidity |
| `mslp` | Pa | Mean sea level pressure |
| `uvIndex` | index | UV radiation index |
| `significantWeatherCode` | code | Weather condition code |
| `precipitationRate` | mm/h | Precipitation rate |
| `totalPrecipAmount` | mm | Total precipitation |
| `totalSnowAmount` | mm | Snow amount |
| `probOfPrecipitation` | % | Probability of precipitation |

### Weather Codes

The `significantWeatherCode` represents different weather conditions:

| Code | Description | Icon |
|------|-------------|------|
| 0 | Clear night | Moon |
| 1 | Sunny day | Sun |
| 2 | Partly cloudy | CloudSun |
| 3 | Partly cloudy | CloudSun |
| 5 | Mist | CloudFog |
| 6 | Fog | CloudFog |
| 7 | Cloudy | Cloud |
| 8 | Overcast | Cloud |
| 9-10 | Light rain shower | CloudDrizzle |
| 11 | Drizzle | CloudDrizzle |
| 12 | Light rain | CloudRain |
| 13-15 | Heavy rain | CloudRainWind |
| 16-18 | Sleet | CloudSnow |
| 19-21 | Hail | CloudHail |
| 22-27 | Snow | CloudSnow |
| 28-30 | Thunder | CloudLightning |

## Browser Geolocation API

The app uses the browser's native geolocation API to determine user location.

### Usage

```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    // Use coordinates
  },
  (error) => {
    // Handle error
  }
);
```

### Error Handling

| Error Code | Description |
|------------|-------------|
| 1 | Permission denied |
| 2 | Position unavailable |
| 3 | Timeout |

## WeatherServicesClient Class

The `WeatherServicesClient` class provides a convenient interface for the Met Office API.

### Constructor

```javascript
const client = new WeatherServicesClient();
```

### Methods

#### `setCoordinates(latitude, longitude)`

Set the coordinates for weather data retrieval.

**Parameters:**
- `latitude` (number): Latitude coordinate
- `longitude` (number): Longitude coordinate

#### `setTimesteps(timesteps)`

Set the forecast frequency.

**Parameters:**
- `timesteps` (string): `"hourly"`, `"three-hourly"`, or `"daily"`

#### `setApiKey(apikey)`

Set the Met Office API key.

**Parameters:**
- `apikey` (string): Your Met Office API key

#### `getLocation()`

Get user's current location using geolocation API.

**Returns:** Promise resolving to coordinates object

#### `fetchWeatherData()`

Fetch weather data for current location.

**Returns:** Promise resolving to weather data

#### `fetchManualForecast(latitude, longitude, timesteps)`

Fetch weather data for specific coordinates.

**Parameters:**
- `latitude` (number): Latitude coordinate
- `longitude` (number): Longitude coordinate
- `timesteps` (string): Optional forecast frequency

**Returns:** Promise resolving to weather data

### Error Handling

The client implements automatic retry logic with exponential backoff:

- 3 retry attempts
- Exponential delay: 1s, 2s, 4s
- Comprehensive error messages

### Usage Example

```javascript
import WeatherServicesClient from './services/WeatherServicesClient';

const client = new WeatherServicesClient();

try {
  const weatherData = await client.fetchWeatherData();
  console.log(weatherData);
} catch (error) {
  console.error('Failed to fetch weather data:', error.message);
}
```

## Rate Limits

The Met Office API has rate limits depending on your subscription:

- **Free Tier**: 360 requests per hour
- **Paid Tiers**: Higher limits available

## Error Codes

| HTTP Status | Description | Action |
|-------------|-------------|--------|
| 200 | Success | Process data |
| 400 | Bad Request | Check parameters |
| 401 | Unauthorized | Check API key |
| 403 | Forbidden | Check permissions |
| 429 | Rate Limited | Implement backoff |
| 500 | Server Error | Retry request |

## Testing

You can test the API endpoints using tools like:

- **Postman**: Import the API collection
- **curl**: Use command line requests
- **Browser DevTools**: Monitor network requests

## Support

For API issues:

1. Check [Met Office Documentation](https://www.metoffice.gov.uk/services/data/datapoint/api)
2. Contact Met Office support
3. Review API status page

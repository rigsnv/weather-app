import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import WeatherServicesClient from './services/WeatherServicesClient';

import { weatherCodeMap } from './utilities/weatherCodes';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherDetails from './components/WeatherDetails';

// --- SETUP DAYJS ---
dayjs.extend(utc);
dayjs.extend(timezone);
const userTimezone = dayjs.tz.guess();

// --- Main App Component ---
export default function App() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadWeatherData = async () => {
            const client = new WeatherServicesClient();
            try {
                const data = await client.fetchWeatherData();
                setWeatherData(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        loadWeatherData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <p className="text-xl">Loading weather data...</p>
        </div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">
            <p className="text-xl text-red-500">Error: {error}</p>
        </div>;
    }

    if (!weatherData || !weatherData.features || !weatherData.features[0]) {
        return <div className="flex justify-center items-center h-screen">
            <p className="text-xl">No weather data available</p>
        </div>;
    }

    const feature = weatherData.features[0];
    const currentTime = dayjs().startOf('hour').format('YYYY-MM-DDTHH:00') + 'Z'; // Get current time in UTC rounded to the hour
    const locationName = feature.properties.location.name;
    const allTimeSeries = feature.properties.timeSeries;
    const currentWeather = allTimeSeries.find(w => w.time == currentTime) || allTimeSeries[0];

    return (
        <div className="bg-gradient-to-b from-sky-700 to-sky-800 text-white antialiased sm:rounded-xl mx-auto md:max-w-5xl sm:max-w-xl min-w-[320px]">
            <p>
                
            </p>
            <div className="container mx-auto p-4">
                <div>
                    <div className="flex flex-col gap-4">
                        <CurrentWeather data={currentWeather} locationName={locationName} userTimezone={userTimezone} weatherCodeMap={weatherCodeMap}/>
                        <HourlyForecast timeSeries={allTimeSeries} userTimezone={userTimezone} weatherCodeMap={weatherCodeMap}/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4  ">
                            <WeatherDetails data={currentWeather} />
                            <DailyForecast timeSeries={allTimeSeries} userTimezone={userTimezone} weatherCodeMap={weatherCodeMap}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

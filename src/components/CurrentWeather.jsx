import { useState, useEffect } from 'react';
import Card from './ui/WeatherCard';
import WeatherIcon from './ui/WeatherIcon';
import dayjs from 'dayjs';

const CurrentWeather = ({ data, locationName, userTimezone, weatherCodeMap }) => {
    // Always call hooks at the top level
    const [time, setTime] = useState(dayjs().tz(userTimezone).format('h:mm A'));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(dayjs().tz(userTimezone).format('h:mm A'));
        }, 1000); // Update every minute
        return () => clearInterval(interval);
    }, [userTimezone]);

    // Early return after hooks
    if (!data) return null;
    
    const weather = weatherCodeMap[data.significantWeatherCode] || weatherCodeMap[4];

    return (
        <Card>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">

            <div className="flex-grow">
                <div className="flex items-center space-x-4">
                    <div className="size-20">
                        <WeatherIcon weatherCodeMap={weatherCodeMap} code={data.significantWeatherCode} className="w-full h-full" />
                    </div>
                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold">{Math.round(data.screenTemperature)}°C</h1>
                        <p className="text-lg text-gray-100">{weather.description}</p>
                    </div>
                </div>
            </div>
            <div className="mt-6 sm:mt-0 sm:text-right">
                <p className="text-2xl font-semibold mb-2">{locationName} </p>
                <p className="text-lg">{dayjs(data.time).tz(userTimezone).format('dddd, D MMMM')} - {time}</p>
            </div>
            </div>
            <div className="text-gray-200 mt-4 lg:justify-center lg:gap-9 md:flex md:gap-6 sm:grid sm:grid-cols-2 sm:gap-2">
                <div className='flex gap-1 md:flex-row md:items-start sm:flex-col sm:items-start'>
                    <p>Feels like: </p>
                    <p>{Math.round(data.feelsLikeTemperature)}° </p>
                </div>
                <div className='flex gap-1 md:flex-row md:items-start sm:flex-col sm:items-end'>
                    <p>Wind Speed: </p>
                    <p>{Math.round(data.windSpeed10m * 2.237)}mph </p>
                </div>
                <div className='flex gap-1 md:flex-row sm:flex-col items-end sm:items-start'>
                    <p>Preciputation </p>
                    <p>prob: {Math.round(data.probOfPrecipitation)}% </p>
                </div>
                <div className='flex gap-1 md:flex-row md:items-start sm:flex-col sm:items-end'>
                    <p>Precipitation</p>
                    <p>rate: {Math.round(data.precipitationRate)}mmh </p>
                </div>
            </div>
        </Card>
    );
};

export default CurrentWeather;
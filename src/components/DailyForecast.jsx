import { useMemo } from 'react';
import Card from './ui/WeatherCard';
import WeatherIcon from "./ui/WeatherIcon";
import dayjs from "dayjs";

const DailyForecast = ({ timeSeries, userTimezone, weatherCodeMap }) => {
    const dailyData = useMemo(() => {
        const dataByDay = timeSeries.reduce((acc, curr) => {
            const day = dayjs(curr.time).tz(userTimezone).format('YYYY-MM-DD');
            if (!acc[day]) {
                acc[day] = { temps: [], codes: [], dayName: dayjs(curr.time).tz(userTimezone).format('ddd') };
            }
            acc[day].temps.push(curr.screenTemperature);
            acc[day].codes.push(curr.significantWeatherCode);
            return acc;
        }, {});

        return Object.values(dataByDay).slice(0, 7).map(day => {
            const minTemp = Math.round(Math.min(...day.temps));
            const maxTemp = Math.round(Math.max(...day.temps));
            const dominantCode = day.codes.sort((a, b) =>
                day.codes.filter(v => v === a).length - day.codes.filter(v => v === b).length
            ).pop();
            return { ...day, minTemp, maxTemp, dominantCode };
        });
    }, [timeSeries, userTimezone]);

    return (
        <Card>
            <h2 className="text-lg font-semibold mb-4">3-Day Forecast</h2>
            <div className="space-y-3 mx-auto">
                {dailyData.map((day, index) => (
                    <div key={index} className="flex items-center justify-end">
                        <div className="flex justify-between text-right">
                            <p className="w-8 font-medium">{day.dayName}</p>
                            <div className="w-8 h-8 mx-2">
                                <WeatherIcon weatherCodeMap={weatherCodeMap} code={day.dominantCode} className="w-full h-full" />
                            </div>
                        </div>
                        <div className="flex grow items-center justify-end space-x-2">
                            <span className="font-medium tex-gray-400">{day.minTemp}°</span>
                            <div className="w-full h-1.5 bg-gray-600 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-cyan-400 to-yellow-400 h-full" style={{ width: '100%' }}></div>
                            </div>
                            <span className="font-medium">{day.maxTemp}°</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default DailyForecast;
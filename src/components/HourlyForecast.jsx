import Card from './ui/WeatherCard';
import WeatherIcon from "./ui/WeatherIcon";
import dayjs from "dayjs";

const HourlyForecast = ({weatherCodeMap, timeSeries, userTimezone }) => {
    return (
        <Card>
            <h2 className="text-lg font-semibold mb-4">Hourly Forecast</h2>
            <div className="overflow-x-auto custom-scrollbar pb-4">
                <div className="flex space-x-4">
                    {timeSeries.slice(1, 25).map((hour, index) => {
                        const time = dayjs(hour.time).tz(userTimezone).format('h A');
                        return (
                            <div key={index} className="flex flex-col items-center space-y-2 text-center flex-shrink-0 w-20">
                                <p className="text-sm font-medium">{time}</p>
                                <div className="w-8 h-8">
                                    <WeatherIcon weatherCodeMap={weatherCodeMap} code={hour.significantWeatherCode} className="w-full h-full" />
                                </div>
                                <p className="text-lg font-semibold">{Math.round(hour.screenTemperature)}°</p>
                                <p className="text-lg text-gray-100">{hour.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
};

export default HourlyForecast;
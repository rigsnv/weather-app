import Card from './ui/WeatherCard';
import { Wind, Eye, ThermometerSun, Droplets, Gauge, Sun } from 'lucide-react';
import { uvIndexDescription ,visibilityDescriptionMap } from '../utilities/weatherCodes';

const WeatherDetails = ({ data }) => {
    if (!data) return null;
    
    const details = [
        { icon: Sun, label: 'UV Index', value: `${uvIndexDescription(data.uvIndex).label}: ${data.uvIndex}` },
        { icon: Wind, label: 'Wind Gust', value: `${Math.round(data.max10mWindGust * 2.237)} mph` },
        { icon: Eye, label: 'Visibility', value: `${visibilityDescriptionMap(data.visibility)}: ${(data.visibility / 1609).toFixed(1)} mi`},
        { icon: ThermometerSun, label: 'Dew Point', value: `${Math.round(data.screenDewPointTemperature)}°` },
        { icon: Droplets, label: 'Humidity', value: `${Math.round(data.screenRelativeHumidity)}%` },
        { icon: Gauge, label: 'Pressure', value: `${Math.round(data.mslp / 100)} hPa` },
    ];

    return (
        <Card>
            <div className='overflow-x-auto custom-scrollbar pb-4 sm:pb-0'>
                <h2 className="text-lg font-semibold mb-4">Weather Details</h2>
                <div className='min-w-[448px] sm:min-w-0'>
                    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-2 text-sm">
                        {details.map(({ icon: Icon, label, value }, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <div className="w-6 h-6 text-gray-100">
                                    <Icon className="w-full h-full" />
                                </div>
                                <div>
                                    <p className="text-gray-100">{label}</p>
                                    <p className="font-semibold text-base">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default WeatherDetails;
import { HelpCircle } from 'lucide-react';

const WeatherIcon = ({ weatherCodeMap, code, className = '', ...props }) => {
    const { icon: IconComponent, color } = weatherCodeMap[code] || { icon: HelpCircle, color: 'text-gray-400' };
    return <IconComponent className={`${color} ${className}`} {...props} />
    ;
}

export default WeatherIcon;
const WeatherCard = ({ children, className = '' }) => (
    <div className={`bg-white/10 rounded-2xl p-8 weather-card ${className}`}>
        {children}
    </div>
);

export default WeatherCard;
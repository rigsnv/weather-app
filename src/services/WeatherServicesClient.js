/**
 * ======================
 * Author: Ricardo Garcia
 * Date: 2025-07-19
 * Version: 1.0
 * ======================
 * Met Office API Client
 * ======================
 * License: GNU GENERAL PUBLIC LICENSE
 * License Version: 3
 * ======================
 * Description:
 * This is a JavaScript module that provides a client for the Met Office API.
 * The base URL is set to retrieve site-specific forecast by default.
 * The base URL can be changed to retrieve other types of data, such as geospatial data.
 * Visit https://www.metoffice.gov.uk/services/data/datapoint/api for more information.
 * ======================
 * Notes:
 * The code is designed to be used as a module and can be imported into other JavaScript files.
 * To set up the API client, create an instance of the MetOfficeClient class and set the required parameters.
 * Call the retrieveForecast() method after setting the parameters to retrieve the forecast data.
 * ======================
 */

class MetOfficeClient {
    constructor() {
        /**
         * Initialize the Met Office API client with default parameters.
         */
        // Default base URL: Retrieve site-specific forecast for a single location
        this.baseUrl = "";
        
        // Frequency of the timesteps provided in the forecast.
        // The options are hourly, three-hourly or daily
        this.timesteps = "hourly"; // Default timestep: hourly
        
        // Boolean value for whether parameter metadata should be excluded
        this.excludeMetadata = "FALSE";
        
        // REQUIRED: Provide the latitude of the location you wish to retrieve the forecast for
        this.latitude = "";
        
        // REQUIRED: Provide the longitude of the location you wish to retrieve the forecast for
        this.longitude = "";
        
        // REQUIRED: Your WDH API Credentials
        this.apikey = "";
        
        // Boolean value for whether the location name should be included
        this.includeLocation = "TRUE";
        
        // Set up the request headers
        this.headers = {
            'accept': "application/json"
        };
    }
    
    /**
     * Set the coordinates for the forecast location
     * @param {number} latitude - The latitude of the location
     * @param {number} longitude - The longitude of the location
    */
   setCoordinates(latitude, longitude) {
       this.latitude = latitude;
       this.longitude = longitude;
    }
    
    /**
     * Set the timestep frequency for the forecast
     * @param {string} timesteps - The frequency: "hourly", "three-hourly", or "daily"
    */
   setTimesteps(timesteps) {
       const validTimesteps = ["hourly", "three-hourly", "daily"];
       if (!validTimesteps.includes(timesteps)) {
           throw new Error("ERROR: The available frequencies for timesteps are hourly, three-hourly or daily.");
        }
        this.timesteps = timesteps;
    }
    
    /**
     * Set the API key for authentication
     * @param {string} apikey - Your Met Office API key
    */
   setApiKey(apikey) {
       this.apikey = apikey;
    }
    
    /**
     * Retrieve the weather forecast from the Met Office API
     * @returns {Promise<Object>} The forecast data
    */

    async getLocation() {
        if ("geolocation" in navigator) {
            return new Promise(
                (resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const coordinates = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            };
                    resolve(coordinates);
                    },
                    (error) => {
                    reject(error);
                    }
                    );
                }
            );
        } else {
            throw new Error("Geolocation is not supported by this browser.");
        };
    };

   async callMetOffice() {

        console.log("Warning: using callMetOffice method. Calling an external API directly. Not safe for production. Using and exposing enviroment environment variables VITE_DEV_API_BASE_URL and VITE_MET_OFFICE_API_KEY are setup correctly.");
        this.baseUrl = import.meta.env.VITE_DEV_API_BASE_URL;
        this.apikey = import.meta.env.VITE_MET_OFFICE_API_KEY;
    
        if (!this.apikey) {
            throw new Error("ERROR: API key must be provided either via setApiKey() method or VITE_MET_OFFICE_API_KEY environment variable.");
        }

        // Validate latitude and longitude
        if (!this.latitude || !this.longitude) {
            throw new Error("ERROR: Latitude and longitude must be supplied");
        }

        // Validate timesteps
        const validTimesteps = ["hourly", "three-hourly", "daily"];
        if (!validTimesteps.includes(this.timesteps)) {
            throw new Error("ERROR: The available frequencies for timesteps are hourly, three-hourly or daily.");
        }

        // Build the request URL and parameters
        const url = this.baseUrl + this.timesteps;
        const headers = {
            ...this.headers,
            "apikey": this.apikey
        };

        const params = new URLSearchParams({
            'excludeParameterMetadata': this.excludeMetadata,
            'includeLocationName': this.includeLocation,
            'latitude': this.latitude,
            'longitude': this.longitude
        });

        const fullUrl = `${url}?${params.toString()}`;

        // Implement retry logic with exponential backoff
        const retries = 3;
        
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await fetch(fullUrl, {
                    method: 'GET',
                    headers: headers
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.error) {
                    throw new Error(`ERROR: ${data.error}`);
                }

                return data;

            } catch (error) {
                if (attempt < retries - 1) {
                    // Exponential backoff: wait 2^attempt seconds
                    const delay = Math.pow(2, attempt) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw new Error("ERROR: Failed to retrieve forecast after multiple attempts.");
                }
            }
        }
    }

    async callBackEnd() {
        
        this.baseUrl = import.meta.env.VITE_PROD_API_BASE_URL;
        let url = new URL("/weather", this.baseUrl);

        const retries = 3;
        
        for (let attempt = 0; attempt < retries; attempt++) {
            
            try {
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        longitude: this.longitude.toString(),
                        latitude: this.latitude.toString()
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.error) {
                    throw new Error(`ERROR: ${data.error}`);
                }

                return data;

            } catch (error) {
                if (attempt < retries - 1) {
                    // Exponential backoff: wait 2^attempt seconds
                    const delay = Math.pow(2, attempt) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw new Error("ERROR: Failed to retrieve forecast after multiple attempts.");
                }
            }
        }
    }
    /**
     * Convenience method to get forecast with coordinates in one call
     * @param {number} latitude - The latitude of the location
     * @param {number} longitude - The longitude of the location
     * @param {string} timesteps - Optional: The frequency ("hourly", "three-hourly", or "daily")
     * @returns {Promise<Object>} The forecast data
     */
    async fetchManualForecast(latitude, longitude, timesteps = "hourly") {

        this.setCoordinates(latitude, longitude);
        
        if (timesteps) {
            this.setTimesteps(timesteps);
        }    
        return await this.callMetOffice();
    }
    
    async fetchWeatherData() {
        
        try {
        const coordinates = await this.getLocation();
        this.setCoordinates(coordinates.latitude, coordinates.longitude);
        if (import.meta.env.MODE === 'development') {
            const data = await this.callMetOffice();
            return data;
        } else {
            const data = await this.callBackEnd();
            return data;
        }
        } catch (error) {
            console.error("Error fetching weather data: ", error.message);
            throw error;
        }
    }
};

export default MetOfficeClient;

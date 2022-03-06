
// Retrieve the metadata for your location from https://api.weather.gov/points/{lat},{lon}

// (in this case https: //api.weather.gov/points/34.5034,-82.6501)

// This provides the information below, "properties" has a key of forecast and another of forecaseHourly


{
    "@context": [
        "https://geojson.org/geojson-ld/geojson-context.jsonld",
        {
            "@version": "1.1",
            "wx": "https://api.weather.gov/ontology#",
            "s": "https://schema.org/",
            "geo": "http://www.opengis.net/ont/geosparql#",
            "unit": "http://codes.wmo.int/common/unit/",
            "@vocab": "https://api.weather.gov/ontology#",
            "geometry": {
                "@id": "s:GeoCoordinates",
                "@type": "geo:wktLiteral"
            },
            "city": "s:addressLocality",
            "state": "s:addressRegion",
            "distance": {
                "@id": "s:Distance",
                "@type": "s:QuantitativeValue"
            },
            "bearing": {
                "@type": "s:QuantitativeValue"
            },
            "value": {
                "@id": "s:value"
            },
            "unitCode": {
                "@id": "s:unitCode",
                "@type": "@id"
            },
            "forecastOffice": {
                "@type": "@id"
            },
            "forecastGridData": {
                "@type": "@id"
            },
            "publicZone": {
                "@type": "@id"
            },
            "county": {
                "@type": "@id"
            }
        }
    ],
    "id": "https://api.weather.gov/points/34.5034,-82.6501",
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [
            -82.650099999999995,
            34.503399999999999
        ]
    },
    "properties": {
        "@id": "https://api.weather.gov/points/34.5034,-82.6501",
        "@type": "wx:Point",
        "cwa": "GSP",
        "forecastOffice": "https://api.weather.gov/offices/GSP",
        "gridId": "GSP",
        "gridX": 55,
        "gridY": 25,
        "forecast": "https://api.weather.gov/gridpoints/GSP/55,25/forecast",
        "forecastHourly": "https://api.weather.gov/gridpoints/GSP/55,25/forecast/hourly",
        "forecastGridData": "https://api.weather.gov/gridpoints/GSP/55,25",
        "observationStations": "https://api.weather.gov/gridpoints/GSP/55,25/stations",
        "relativeLocation": {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -82.647326000000007,
                    34.521166000000001
                ]
            },
            "properties": {
                "city": "Anderson",
                "state": "SC",
                "distance": {
                    "unitCode": "wmoUnit:m",
                    "value": 1991.7755176324999
                },
                "bearing": {
                    "unitCode": "wmoUnit:degree_(angle)",
                    "value": 187
                }
            }
        },
        "forecastZone": "https://api.weather.gov/zones/forecast/SCZ010",
        "county": "https://api.weather.gov/zones/county/SCC007",
        "fireWeatherZone": "https://api.weather.gov/zones/fire/SCZ010",
        "timeZone": "America/New_York",
        "radarStation": "KGSP"
    }
}

// Daily forecast for Anderson, SC on March 5th, 2022
// found at https://api.weather.gov/gridpoints/GSP/55,25/forecast

{
    "@context": [
        "https://geojson.org/geojson-ld/geojson-context.jsonld",
        {
            "@version": "1.1",
            "wx": "https://api.weather.gov/ontology#",
            "geo": "http://www.opengis.net/ont/geosparql#",
            "unit": "http://codes.wmo.int/common/unit/",
            "@vocab": "https://api.weather.gov/ontology#"
        }
    ],
    "type": "Feature",
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [
                    -82.674976299999997,
                    34.504419300000002
                ],
                [
                    -82.674976299999997,
                    34.482000300000003
                ],
                [
                    -82.647762200000003,
                    34.482000300000003
                ],
                [
                    -82.647762200000003,
                    34.504419300000002
                ],
                [
                    -82.674976299999997,
                    34.504419300000002
                ]
            ]
        ]
    },
    "properties": {
        "updated": "2022-03-05T23:14:40+00:00",
        "units": "us",
        "forecastGenerator": "BaselineForecastGenerator",
        "generatedAt": "2022-03-06T01:57:13+00:00",
        "updateTime": "2022-03-05T23:14:40+00:00",
        "validTimes": "2022-03-05T17:00:00+00:00/P7DT19H",
        "elevation": {
            "unitCode": "wmoUnit:m",
            "value": 213.05520000000001
        },
        "periods": [
            {
                "number": 1,
                "name": "Tonight",
                "startTime": "2022-03-05T20:00:00-05:00",
                "endTime": "2022-03-06T06:00:00-05:00",
                "isDaytime": false,
                "temperature": 54,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "3 to 7 mph",
                "windDirection": "SE",
                "icon": "https://api.weather.gov/icons/land/night/bkn?size=medium",
                "shortForecast": "Mostly Cloudy",
                "detailedForecast": "Mostly cloudy, with a low around 54. Southeast wind 3 to 7 mph."
            },
            {
                "number": 2,
                "name": "Sunday",
                "startTime": "2022-03-06T06:00:00-05:00",
                "endTime": "2022-03-06T18:00:00-05:00",
                "isDaytime": true,
                "temperature": 78,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "6 to 12 mph",
                "windDirection": "SSW",
                "icon": "https://api.weather.gov/icons/land/day/bkn?size=medium",
                "shortForecast": "Partly Sunny",
                "detailedForecast": "Partly sunny, with a high near 78. South southwest wind 6 to 12 mph, with gusts as high as 20 mph."
            },
            {
                "number": 3,
                "name": "Sunday Night",
                "startTime": "2022-03-06T18:00:00-05:00",
                "endTime": "2022-03-07T06:00:00-05:00",
                "isDaytime": false,
                "temperature": 57,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "7 mph",
                "windDirection": "S",
                "icon": "https://api.weather.gov/icons/land/night/sct?size=medium",
                "shortForecast": "Partly Cloudy",
                "detailedForecast": "Partly cloudy, with a low around 57. South wind around 7 mph."
            },
            {
                "number": 4,
                "name": "Monday",
                "startTime": "2022-03-07T06:00:00-05:00",
                "endTime": "2022-03-07T18:00:00-05:00",
                "isDaytime": true,
                "temperature": 79,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "6 to 16 mph",
                "windDirection": "SW",
                "icon": "https://api.weather.gov/icons/land/day/rain_showers,20/rain_showers,40?size=medium",
                "shortForecast": "Chance Rain Showers",
                "detailedForecast": "A chance of rain showers after 11am. Partly sunny, with a high near 79. Southwest wind 6 to 16 mph, with gusts as high as 24 mph. Chance of precipitation is 40%. New rainfall amounts less than a tenth of an inch possible."
            },
            {
                "number": 5,
                "name": "Monday Night",
                "startTime": "2022-03-07T18:00:00-05:00",
                "endTime": "2022-03-08T06:00:00-05:00",
                "isDaytime": false,
                "temperature": 56,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "5 to 13 mph",
                "windDirection": "WSW",
                "icon": "https://api.weather.gov/icons/land/night/rain_showers,50/rain,40?size=medium",
                "shortForecast": "Chance Rain Showers then Chance Light Rain",
                "detailedForecast": "A chance of rain showers before 1am, then a chance of rain between 1am and 3am, then a chance of rain showers. Mostly cloudy, with a low around 56. West southwest wind 5 to 13 mph, with gusts as high as 18 mph. Chance of precipitation is 50%."
            },
            {
                "number": 6,
                "name": "Tuesday",
                "startTime": "2022-03-08T06:00:00-05:00",
                "endTime": "2022-03-08T18:00:00-05:00",
                "isDaytime": true,
                "temperature": 70,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "3 to 7 mph",
                "windDirection": "W",
                "icon": "https://api.weather.gov/icons/land/day/rain,30/rain,40?size=medium",
                "shortForecast": "Chance Light Rain",
                "detailedForecast": "A chance of rain showers before 7am, then a chance of rain. Mostly cloudy, with a high near 70. Chance of precipitation is 40%."
            },
            {
                "number": 7,
                "name": "Tuesday Night",
                "startTime": "2022-03-08T18:00:00-05:00",
                "endTime": "2022-03-09T06:00:00-05:00",
                "isDaytime": false,
                "temperature": 50,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "2 to 6 mph",
                "windDirection": "ENE",
                "icon": "https://api.weather.gov/icons/land/night/rain,70/rain,80?size=medium",
                "shortForecast": "Light Rain",
                "detailedForecast": "Rain. Mostly cloudy, with a low around 50. Chance of precipitation is 80%."
            },
            {
                "number": 8,
                "name": "Wednesday",
                "startTime": "2022-03-09T06:00:00-05:00",
                "endTime": "2022-03-09T18:00:00-05:00",
                "isDaytime": true,
                "temperature": 60,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "6 to 9 mph",
                "windDirection": "NE",
                "icon": "https://api.weather.gov/icons/land/day/rain,80?size=medium",
                "shortForecast": "Light Rain",
                "detailedForecast": "Rain before 7am, then rain showers between 7am and 1pm, then rain. Mostly cloudy, with a high near 60. Chance of precipitation is 80%."
            },
            {
                "number": 9,
                "name": "Wednesday Night",
                "startTime": "2022-03-09T18:00:00-05:00",
                "endTime": "2022-03-10T06:00:00-05:00",
                "isDaytime": false,
                "temperature": 46,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "7 mph",
                "windDirection": "NE",
                "icon": "https://api.weather.gov/icons/land/night/rain,70/rain,50?size=medium",
                "shortForecast": "Light Rain Likely",
                "detailedForecast": "Rain likely. Mostly cloudy, with a low around 46. Chance of precipitation is 70%."
            },
            {
                "number": 10,
                "name": "Thursday",
                "startTime": "2022-03-10T06:00:00-05:00",
                "endTime": "2022-03-10T18:00:00-05:00",
                "isDaytime": true,
                "temperature": 60,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "9 mph",
                "windDirection": "ENE",
                "icon": "https://api.weather.gov/icons/land/day/rain,40/rain_showers,40?size=medium",
                "shortForecast": "Chance Light Rain then Chance Rain Showers",
                "detailedForecast": "A chance of rain before 10am, then a chance of rain showers. Mostly cloudy, with a high near 60. Chance of precipitation is 40%."
            },
            {
                "number": 11,
                "name": "Thursday Night",
                "startTime": "2022-03-10T18:00:00-05:00",
                "endTime": "2022-03-11T06:00:00-05:00",
                "isDaytime": false,
                "temperature": 46,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "3 to 7 mph",
                "windDirection": "NE",
                "icon": "https://api.weather.gov/icons/land/night/rain,40?size=medium",
                "shortForecast": "Chance Light Rain",
                "detailedForecast": "A chance of rain showers before 9pm, then a chance of rain. Mostly cloudy, with a low around 46. Chance of precipitation is 40%."
            },
            {
                "number": 12,
                "name": "Friday",
                "startTime": "2022-03-11T06:00:00-05:00",
                "endTime": "2022-03-11T18:00:00-05:00",
                "isDaytime": true,
                "temperature": 68,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "3 to 9 mph",
                "windDirection": "SE",
                "icon": "https://api.weather.gov/icons/land/day/rain,50?size=medium",
                "shortForecast": "Chance Light Rain",
                "detailedForecast": "A chance of rain. Partly sunny, with a high near 68. Chance of precipitation is 50%."
            },
            {
                "number": 13,
                "name": "Friday Night",
                "startTime": "2022-03-11T18:00:00-05:00",
                "endTime": "2022-03-12T06:00:00-05:00",
                "isDaytime": false,
                "temperature": 44,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "7 mph",
                "windDirection": "W",
                "icon": "https://api.weather.gov/icons/land/night/rain,50?size=medium",
                "shortForecast": "Chance Light Rain",
                "detailedForecast": "A chance of rain. Partly cloudy, with a low around 44. Chance of precipitation is 50%."
            },
            {
                "number": 14,
                "name": "Saturday",
                "startTime": "2022-03-12T06:00:00-05:00",
                "endTime": "2022-03-12T18:00:00-05:00",
                "isDaytime": true,
                "temperature": 61,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "6 to 14 mph",
                "windDirection": "W",
                "icon": "https://api.weather.gov/icons/land/day/rain,40/rain,30?size=medium",
                "shortForecast": "Chance Light Rain",
                "detailedForecast": "A chance of rain. Mostly sunny, with a high near 61. Chance of precipitation is 40%."
            }
        ]
    }
}

Could also use the hourly forcast, in this case, found at:

https://api.weather.gov/gridpoints/GSP/55,25/forecast/hourly

{
    "@context": [
        "https://geojson.org/geojson-ld/geojson-context.jsonld",
        {
            "@version": "1.1",
            "wx": "https://api.weather.gov/ontology#",
            "geo": "http://www.opengis.net/ont/geosparql#",
            "unit": "http://codes.wmo.int/common/unit/",
            "@vocab": "https://api.weather.gov/ontology#"
        }
    ],
    "type": "Feature",
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [
                    -82.674976299999997,
                    34.504419300000002
                ],
                [
                    -82.674976299999997,
                    34.482000300000003
                ],
                [
                    -82.647762200000003,
                    34.482000300000003
                ],
                [
                    -82.647762200000003,
                    34.504419300000002
                ],
                [
                    -82.674976299999997,
                    34.504419300000002
                ]
            ]
        ]
    },
    "properties": {
        "updated": "2022-03-05T23:14:40+00:00",
        "units": "us",
        "forecastGenerator": "HourlyForecastGenerator",
        "generatedAt": "2022-03-06T01:54:02+00:00",
        "updateTime": "2022-03-05T23:14:40+00:00",
        "validTimes": "2022-03-05T17:00:00+00:00/P7DT19H",
        "elevation": {
            "unitCode": "wmoUnit:m",
            "value": 213.05520000000001
        },
        "periods": [
            {
                "number": 1,
                "name": "",
                "startTime": "2022-03-05T20:00:00-05:00",
                "endTime": "2022-03-05T21:00:00-05:00",
                "isDaytime": false,
                "temperature": 60,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "3 mph",
                "windDirection": "E",
                "icon": "https://api.weather.gov/icons/land/night/bkn?size=small",
                "shortForecast": "Mostly Cloudy",
                "detailedForecast": ""
            },
            {
                "number": 2,
                "name": "",
                "startTime": "2022-03-05T21:00:00-05:00",
                "endTime": "2022-03-05T22:00:00-05:00",
                "isDaytime": false,
                "temperature": 58,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "3 mph",
                "windDirection": "E",
                "icon": "https://api.weather.gov/icons/land/night/bkn?size=small",
                "shortForecast": "Mostly Cloudy",
                "detailedForecast": ""
            },
            {
                "number": 3,
                "name": "",
                "startTime": "2022-03-05T22:00:00-05:00",
                "endTime": "2022-03-05T23:00:00-05:00",
                "isDaytime": false,
                "temperature": 58,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "3 mph",
                "windDirection": "E",
                "icon": "https://api.weather.gov/icons/land/night/bkn?size=small",
                "shortForecast": "Mostly Cloudy",
                "detailedForecast": ""
            },
            {
                "number": 4,
                "name": "",
                "startTime": "2022-03-05T23:00:00-05:00",
                "endTime": "2022-03-06T00:00:00-05:00",
                "isDaytime": false,
                "temperature": 56,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "3 mph",
                "windDirection": "E",
                "icon": "https://api.weather.gov/icons/land/night/bkn?size=small",
                "shortForecast": "Mostly Cloudy",
                "detailedForecast": ""
            },
            {
                "number": 5,
                "name": "",
                "startTime": "2022-03-06T00:00:00-05:00",
                "endTime": "2022-03-06T01:00:00-05:00",
                "isDaytime": false,
                "temperature": 55,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "5 mph",
                "windDirection": "SE",
                "icon": "https://api.weather.gov/icons/land/night/bkn?size=small",
                "shortForecast": "Mostly Cloudy",
                "detailedForecast": ""
            },
            {
                "number": 6,
                "name": "",
                "startTime": "2022-03-06T01:00:00-05:00",
                "endTime": "2022-03-06T02:00:00-05:00",
                "isDaytime": false,
                "temperature": 56,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "6 mph",
                "windDirection": "SSE",
                "icon": "https://api.weather.gov/icons/land/night/bkn?size=small",
                "shortForecast": "Mostly Cloudy",
                "detailedForecast": ""
            },
            {
                "number": 7,
                "name": "",
                "startTime": "2022-03-06T02:00:00-05:00",
                "endTime": "2022-03-06T03:00:00-05:00",
                "isDaytime": false,
                "temperature": 56,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "6 mph",
                "windDirection": "S",
                "icon": "https://api.weather.gov/icons/land/night/bkn?size=small",
                "shortForecast": "Mostly Cloudy",
                "detailedForecast": ""
            },
            {
                "number": 8,
                "name": "",
                "startTime": "2022-03-06T03:00:00-05:00",
                "endTime": "2022-03-06T04:00:00-05:00",
                "isDaytime": false,
                "temperature": 55,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "6 mph",
                "windDirection": "S",
                "icon": "https://api.weather.gov/icons/land/night/bkn?size=small",
                "shortForecast": "Mostly Cloudy",
                "detailedForecast": ""
            },
            {
                "number": 9,
                "name": "",
                "startTime": "2022-03-06T04:00:00-05:00",
                "endTime": "2022-03-06T05:00:00-05:00",
                "isDaytime": false,
                "temperature": 55,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "7 mph",
                "windDirection": "S",
                "icon": "https://api.weather.gov/icons/land/night/bkn?size=small",
                "shortForecast": "Mostly Cloudy",
                "detailedForecast": ""
            },
            {
                "number": 10,
                "name": "",
                "startTime": "2022-03-06T05:00:00-05:00",
                "endTime": "2022-03-06T06:00:00-05:00",
                "isDaytime": false,
                "temperature": 54,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "7 mph",
                "windDirection": "S",
                "icon": "https://api.weather.gov/icons/land/night/bkn?size=small",
                "shortForecast": "Mostly Cloudy",
                "detailedForecast": ""
            },
            {
                "number": 11,
                "name": "",
                "startTime": "2022-03-06T06:00:00-05:00",
                "endTime": "2022-03-06T07:00:00-05:00",
                "isDaytime": true,
                "temperature": 54,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "6 mph",
                "windDirection": "S",
                "icon": "https://api.weather.gov/icons/land/day/bkn?size=small",
                "shortForecast": "Mostly Cloudy",
                "detailedForecast": ""
            },
            {
                "number": 12,
                "name": "",
                "startTime": "2022-03-06T07:00:00-05:00",
                "endTime": "2022-03-06T08:00:00-05:00",
                "isDaytime": true,
                "temperature": 54,
                "temperatureUnit": "F",
                "temperatureTrend": null,
                "windSpeed": "6 mph",
                "windDirection": "S",
                "icon": "https://api.weather.gov/icons/land/day/bkn?size=small",
                "shortForecast": "Mostly Cloudy",
                "detailedForecast": ""
            },


            
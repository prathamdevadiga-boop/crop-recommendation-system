import requests

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"


def get_coordinates(city):
    params = {
        "name": city,
        "count": 1,
        "language": "en",
        "format": "json"
    }

    try:
        response = requests.get(
            GEOCODING_URL,
            params=params,
            timeout=10
        )

        response.raise_for_status()

    except requests.exceptions.Timeout:
        raise RuntimeError(
            "Location service timed out. Please try again."
        )

    except requests.exceptions.RequestException as e:
        raise RuntimeError(
            f"Location service failed: {e}"
        )

    data = response.json()

    if not data.get("results"):
        raise ValueError(
            f"Location not found: {city}"
        )

    location = data["results"][0]

    return location["latitude"], location["longitude"]


def get_weather(latitude, longitude):
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,relative_humidity_2m,rain",
        "timezone": "auto"
    }

    try:
        response = requests.get(
            WEATHER_URL,
            params=params,
            timeout=10
        )

        response.raise_for_status()

    except requests.exceptions.Timeout:
        raise RuntimeError(
            "Weather service timed out. Please try again."
        )

    except requests.exceptions.RequestException as e:
        raise RuntimeError(
            f"Weather service failed: {e}"
        )

    data = response.json()
    current = data["current"]

    return {
        "temperature": current["temperature_2m"],
        "humidity": current["relative_humidity_2m"],
        "rainfall": current["rain"],
        "latitude": latitude,
        "longitude": longitude
    }


def get_weather_by_city(city):
    latitude, longitude = get_coordinates(city)

    return get_weather(latitude, longitude)


def get_weather_for_location(
    city=None,
    latitude=None,
    longitude=None
):
    if latitude is not None and longitude is not None:
        return get_weather(latitude, longitude)

    if city:
        return get_weather_by_city(city)

    raise ValueError(
        "Please provide either a city or latitude and longitude."
    )

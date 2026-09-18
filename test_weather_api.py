from weather_api import get_weather_for_location

city = input("Enter city or district: ")

weather = get_weather_for_location(city=city)

print("\nWeather details")
print("Temperature:", weather["temperature"], "°C")
print("Humidity:", weather["humidity"], "%")
print("Rainfall:", weather["rainfall"], "mm")
print("Latitude:", weather["latitude"])
print("Longitude:", weather["longitude"])
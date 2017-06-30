import json

cities = [];
with open("cities.txt") as f:
    lines = f.readlines()
    for line in lines:
        parts = line.split(",");
        city = parts[1] + ", " + parts[2];
        cities.append(city);
        
print(cities);
print(len(cities));

with open("cities.json", "w+") as f:
    f.write(json.dumps(cities))
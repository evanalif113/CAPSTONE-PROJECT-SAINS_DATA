# CAPSTONE PROJECT SISTEM INFORMASI BUDIDAYA JAMUR

This project is a comprehensive system for managing and monitoring mushroom cultivation using IoT devices, a back-end API, and a front-end interface.

## Project Structure

The repository is organized as follows:

### 1. IoT Firmware
#### SENSING_PART
- **Purpose**: Collect environmental data such as temperature, humidity, light intensity, and moisture.
- **Key Files**:
  - `src/main.cpp`: Main firmware for the sensing device.
  - `platformio.ini`: Configuration for PlatformIO.
- **Libraries Used**:
  - Adafruit SHT31 Library
  - ElegantOTA

#### ACTUATOR_PART
- **Purpose**: Control actuators like humidifiers based on data from the sensors.
- **Key Files**:
  - `src/main.cpp`: Main firmware for the actuator device.
  - `platformio.ini`: Configuration for PlatformIO.

### 2. Back-End
- **Purpose**: Provide APIs for data storage and retrieval.
- **Key Files**:
  - `index.js`: Express.js server for handling API requests.
  - `Database IoT Jamur.sql` and `DB_JAMUR.sql`: SQL scripts for database schema.
- **Technologies**:
  - Node.js
  - MySQL

### 3. Front-End
- **Purpose**: User interface for monitoring and managing the system.
- **Key Files**:
  - `index.html`: Placeholder for the front-end interface.

### 4. Skematik
- **Purpose**: Contains circuit diagrams for the IoT devices.
- **Key Files**:
  - `Skematik-Bagian-Sensing.fzz`: Fritzing file for the sensing circuit.

## Features
- **IoT Integration**: Real-time data collection and actuator control.
- **Database Management**: Store and retrieve sensor data and user information.
- **API Endpoints**:
  - Send data via GET/POST.
  - Retrieve all data or specific records.
- **OTA Updates**: ElegantOTA for firmware updates.

## How to Run
### IoT Firmware
1. Install [PlatformIO](https://platformio.org/).
2. Configure WiFi credentials in `src/main.cpp`.
3. Upload the firmware to the ESP32 devices.

### Back-End
1. Install Node.js and MySQL.
2. Run `npm install` in the `Back-End` directory.
3. Start the server with `npm run`.

### Front-End
1. Open `index.html` in a browser.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributors
- Widhyatma, et al.
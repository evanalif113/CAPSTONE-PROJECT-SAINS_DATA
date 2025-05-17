#include <Wire.h>
#include <Adafruit_SHT31.h>
#include <Adafruit_SSD1306.h>
#include <BH1750.h> // Include BH1750 library

// OLED display width and height
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

// Initialize SHT31 sensor
Adafruit_SHT31 sht31 = Adafruit_SHT31();

// Initialize OLED display
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// Initialize BH1750 light sensor
BH1750 lightMeter;

void setup() {
    Wire.begin();

    // Initialize serial communication
    Serial.begin(115200);

    // Initialize SHT31 sensor
    if (!sht31.begin(0x44)) { // Default I2C address for SHT31
        Serial.println("Could not find SHT31 sensor!");
        while (1);
    }

    // Initialize OLED display
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Default I2C address for OLED
        Serial.println("SSD1306 allocation failed!");
        while (1);
    }

    // Initialize BH1750 sensor
    if (!lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE)) {
        Serial.println("Could not find BH1750 sensor!");
        while (1);
    }

    // Clear the display
    display.clearDisplay();
    display.display();
}

void loop() {
    // Read temperature and humidity from SHT31
    float temperature = sht31.readTemperature();
    float humidity = sht31.readHumidity();

    // Check if readings are valid
    if (!isnan(temperature) && !isnan(humidity)) {
        // Print data to Serial Monitor
        Serial.print("Temperature: ");
        Serial.print(temperature);
        Serial.println(" °C");
        Serial.print("Humidity: ");
        Serial.print(humidity);
        Serial.println(" %");

        // Display data on OLED
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SSD1306_WHITE);
        display.setCursor(0, 0);
        display.println("Sensor Data");
        display.print("Temp: ");
        display.print(temperature);
        display.write(167); // Degree symbol
        display.println(" C");
        display.print("Humi: ");
        display.print(humidity);
        display.println(" %");
    } else {
        Serial.println("Failed to read from SHT31 sensor!");
    }

    // Read light intensity from BH1750
    float lux = lightMeter.readLightLevel();

    // Check if reading is valid
    if (lux >= 0) {
        // Print light intensity to Serial Monitor
        Serial.print("Light: ");
        Serial.print(lux);
        Serial.println(" lx");

        // Display light intensity on OLED
        display.print("Light: ");
        display.print(lux);
        display.println(" lx");
        display.display();
    } else {
        Serial.println("Failed to read from BH1750 sensor!");
    }

    // Wait for 2 seconds before next reading
    delay(2000);
}

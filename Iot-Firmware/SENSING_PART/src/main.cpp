#include <Wire.h>
#include <Adafruit_SHT31.h>
#include <Adafruit_SSD1306.h>

// OLED display width and height
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

// Initialize SHT31 sensor
Adafruit_SHT31 sht31 = Adafruit_SHT31();

// Initialize OLED display
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

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
        display.println("SHT31 Sensor Data:");
        display.print("Temp: ");
        display.print(temperature);
        display.write(167); // Degree symbol
        display.println(" C");
        display.print("Humi: ");
        display.print(humidity);
        display.println(" %");
        display.display();
    } else {
        Serial.println("Failed to read from SHT31 sensor!");
    }

    // Wait for 2 seconds before next reading
    delay(2000);
}

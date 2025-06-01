#include <Wire.h>
#include <Adafruit_SHT31.h>
#include <Adafruit_SSD1306.h>
#include <BH1750.h>
#include <Adafruit_NeoPixel.h>

// OLED display width and height
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

// Strip Pin Indicator
#define STRIP_PIN 5

// Initialize SHT31 sensor
Adafruit_SHT31 sht31 = Adafruit_SHT31();
// Initialize OLED display
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
// Initialize BH1750 light sensor
BH1750 light;
// Initialize Neopixel
Adafruit_NeoPixel strip(1, STRIP_PIN, NEO_GRB + NEO_KHZ800);

void initializeSensors() {
    strip.begin(); // Initialize Neopixel strip
    strip.setPixelColor(0, strip.Color(0, 255, 0)); // Set first pixel to red
    strip.setBrightness(100); // Set brightness of the strip
    strip.show(); // Update the strip to show the color

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
    if (!light.begin(BH1750::CONTINUOUS_HIGH_RES_MODE)) {
        Serial.println("Could not find BH1750 sensor!");
        while (1);
    }

    // Clear the display
    display.clearDisplay();
    display.display();
}

void updateSensor() {
    // Read temperature and humidity from SHT31
    float temperature = sht31.readTemperature();
    float humidity = sht31.readHumidity();
    sht31.heater(false); // Disable heater after reading
    float lux = light.readLightLevel();

    // Check if readings are valid
    if (!isnan(temperature) && !isnan(humidity) && !isnan(lux)) {
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
        display.print("Temp : ");
        display.print(temperature);
        display.write(167); // Degree symbol
        display.println(" C");
        display.print("Humi : ");
        display.print(humidity);
        display.println(" %");
        display.print("Light: ");
        display.print(lux);
        display.println(" lx");
        display.display();
    } else {
        Serial.println("Failed to read sensor!");
    }
}

void setup() {
    Wire.begin();
    // Initialize serial communication
    Serial.begin(115200);
    initializeSensors(); // Initialize sensors and display
}

static unsigned long previousMillis;
const unsigned long interval = 2000;

void loop() {
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    updateSensor();
    }
}

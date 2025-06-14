#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_SHT31.h>
#include <Adafruit_SSD1306.h>
#include <BH1750.h>
#include <Adafruit_NeoPixel.h>
#include <AViShaOTA.h>

#ifdef USE_SQL
    #include <HTTPClient.h>
#endif

#ifdef USE_FIREBASE
    #include 

const char* ssid = "server";
const char* password = "jeris6467";
// OLED display width and height
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

// Strip Pin Indicator
#define STRIP_PIN 5
#define MOISTURE_PIN 34  // Tambahkan definisi pin sensor kelembaban tanah

String deviceName = "ESP32_Sensor";
String ServerPath = "http://192.168.1.101:2518/api/data-sensor/send"; // Ganti dengan URL server Anda

// Initialize OLED display
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
// Initialize SHT31 sensor
Adafruit_SHT31 sht31 = Adafruit_SHT31();
// Initialize BH1750 light sensor
BH1750 light;
// Initialize Neopixel
Adafruit_NeoPixel strip(1, STRIP_PIN, NEO_GRB + NEO_KHZ800);

AViShaOTA ota("avisha-ota");

void initializeSensors() {
    strip.begin(); // Initialize Neopixel strip
    strip.setPixelColor(0, strip.Color(0, 255, 255));
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

    pinMode(MOISTURE_PIN, INPUT); // Inisialisasi pin sensor kelembaban tanah

    // Clear the display
    display.clearDisplay();
    display.display();
}

// Global variables to store latest sensor readings
float latestTemperature = 0;
float latestHumidity = 0;
int latestMoisture = 0;
float latestLux = 0;

void updateSensor() {
    // Read temperature and humidity from SHT31
    float temperature = sht31.readTemperature();
    float humidity = sht31.readHumidity();
    sht31.heater(false); // Disable heater after reading
    float lux = light.readLightLevel();

    // Baca nilai kelembaban tanah dari sensor analog
    int moistureValue = analogRead(MOISTURE_PIN);

    // Check if readings are valid
    if (!isnan(temperature) && !isnan(humidity) && !isnan(lux)) {
        // Store latest readings for sending
        latestTemperature = temperature;
        latestHumidity = humidity;
        latestMoisture = moistureValue;
        latestLux = lux;

        // Print data to Serial Monitor
        Serial.print("Temperature: ");
        Serial.print(temperature);
        Serial.println(" °C");
        Serial.print("Humidity: ");
        Serial.print(humidity); 
        Serial.println(" %");
        Serial.print("Light Level: ");
        Serial.print(lux);
        Serial.println(" lx");
        Serial.print("Soil Moisture: ");
        Serial.println(moistureValue);

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
        display.println(" Rh%");
        display.print("Light: ");
        display.print(lux);
        display.println(" lux");
        display.print("Moist: ");
        display.println(moistureValue);
        display.display();
    } else {
        Serial.println("Failed to read sensor!");
    }
}

void sendDataToServer() {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi not connected. Skipping data send.");
        return;
    }
    HTTPClient http;
    // Build the URL with query parameters using a local variable
    String url = ServerPath;
    url += "?id_sensor=1";
    url += "&temperature=" + String(latestTemperature, 2);
    url += "&humidity=" + String(latestHumidity, 2);
    url += "&moisture=" + String(latestMoisture);
    url += "&light=" + String(latestLux, 2);

    Serial.print("Request URL: ");
    Serial.println(url);

    http.begin(url);
    int httpResponseCode = http.GET();
    if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        if (httpResponseCode == 200) {
            strip.setPixelColor(0, strip.Color(0, 255, 0));
            strip.setBrightness(100);
            strip.show(); 
            Serial.println("Data berhasil dikirim ke server!");
        }
    } else {
        strip.setPixelColor(0, strip.Color(255, 0, 0));
        strip.setBrightness(100); 
        strip.show(); 
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
        Serial.println("Possible reasons: server not running, wrong URL, firewall, or network issues.");
    }
    http.end();
}

void connectWiFi() {
    Serial.print("Connecting to WiFi: ");
    ota.begin(ssid, password);
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    int retry = 0;
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
        retry++;
        if (retry > 40) { // timeout ~20 detik
            Serial.println("\nFailed to connect to WiFi!");
            return;
        }
    }
    Serial.println("\nWiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
}

void setup() {
    Wire.begin();
    // Initialize serial communication
    Serial.begin(115200);
    connectWiFi(); // Hubungkan ke WiFi sebelum inisialisasi sensor
    initializeSensors(); // Initialize sensors and display
    ota.setOTAPassword("admin123");
}

static unsigned long previousMillis;
const unsigned long interval = 5000;

void loop() {
    ota.handle();
    // Reconnect WiFi if disconnected
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi disconnected! Attempting to reconnect...");
        connectWiFi();
    }
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;
        updateSensor();
        sendDataToServer(); // Send data after updating sensor readings
    }
}

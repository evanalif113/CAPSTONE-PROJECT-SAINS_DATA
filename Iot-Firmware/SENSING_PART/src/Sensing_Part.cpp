#define USE_SQL
//#define USE_FIREBASE
#define USE_BH1750
#define USE_SHT31
#define USE_OLED
#define USE_NEOPIXEL

#include <WiFi.h>
#include <Wire.h>
#include <ESPAsyncWebServer.h>
#include <AsyncTCP.h>
#include "LittleFS.h"
#include <ElegantOTA.h>

#ifdef USE_SHT31
    #include <Adafruit_SHT31.h>
#endif

#ifdef USE_OLED
    #include <Adafruit_SSD1306.h>
#endif

#ifdef USE_BH1750
    #include <BH1750.h>
#endif

#ifdef USE_NEOPIXEL
    #include <Adafruit_NeoPixel.h>
#endif

#ifdef USE_SQL
    #include <HTTPClient.h>
    String deviceName = "ESP32_Sensor";
    String ServerPath = "http://192.168.1.104:2518/api/data-sensor/send";
#endif

#ifdef USE_FIREBASE
    #include <FirebaseClient.h>
    #define ENABLE_USER_AUTH
    #define ENABLE_DATABASE
#endif

uint8_t id_sensor = 2;

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define STRIP_PIN 5
#define MOISTURE_PIN 4

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);

// Search for parameter in HTTP POST request
const char* PARAM_INPUT_1 = "ssid";
const char* PARAM_INPUT_2 = "pass";
const char* PARAM_INPUT_3 = "ip";
const char* PARAM_INPUT_4 = "gateway";

//Variables to save values from HTML form
String ssid;
String pass;
String ip;
String gateway;

// File paths to save input values permanently
const char* ssidPath = "/ssid.txt";
const char* passPath = "/pass.txt";
const char* ipPath = "/ip.txt";
const char* gatewayPath = "/gateway.txt";

#ifdef USE_OLED
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
#endif

#ifdef USE_SHT31
Adafruit_SHT31 sht31 = Adafruit_SHT31();
#endif

#ifdef USE_BH1750
BH1750 light;
#endif

#ifdef USE_NEOPIXEL
Adafruit_NeoPixel strip(1, STRIP_PIN, NEO_GRB + NEO_KHZ800);
#endif

// Global variables to store latest sensor readings
float latestTemperature = 0;
float latestHumidity = 0;
float latestMoisture = 0;
float latestLux = 0;

void initializeSensors() {
#ifdef USE_NEOPIXEL
    strip.begin();
    strip.setPixelColor(0, strip.Color(0, 255, 255));
    strip.setBrightness(100);
    strip.show();
#endif

#ifdef USE_SHT31
    if (!sht31.begin(0x44)) {
        Serial.println("Could not find SHT31 sensor!");
        while (1);
    }
#endif

#ifdef USE_OLED
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
        Serial.println("SSD1306 allocation failed!");
        while (1);
    }
#endif

#ifdef USE_BH1750
    if (!light.begin(BH1750::CONTINUOUS_HIGH_RES_MODE)) {
        Serial.println("Could not find BH1750 sensor!");
        while (1);
    }
#endif

    pinMode(MOISTURE_PIN, INPUT);

#ifdef USE_OLED
    display.clearDisplay();
    display.display();
#endif
}

void updateSensor() {
#ifdef USE_SHT31
    float temperature = sht31.readTemperature();
    float humidity = sht31.readHumidity();
    sht31.heater(false);
#else
    float temperature = 0;
    float humidity = 0;
#endif

#ifdef USE_BH1750
    float lux = light.readLightLevel();
#else
    float lux = 0;
#endif

    int moistureValue = analogRead(MOISTURE_PIN);

    if (!isnan(temperature) && !isnan(humidity) && !isnan(lux)) {
        latestTemperature = temperature;
        latestHumidity = humidity;
        latestMoisture = moistureValue;
        latestLux = lux;

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

#ifdef USE_OLED
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SSD1306_WHITE);
        display.setCursor(0, 0);
        display.println("Sensor Data");
        display.print("Temp : ");
        display.print(temperature);
        display.write(167);
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
#endif
    } else {
        Serial.println("Failed to read sensor!");
    }
}

void sendDataToServer() {
#ifdef USE_SQL
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi not connected. Skipping data send.");
        return;
    }
    HTTPClient http;
    String url = ServerPath;
    url += "?id_sensor=" + String(id_sensor);
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
#ifdef USE_NEOPIXEL
            strip.setPixelColor(0, strip.Color(0, 255, 0));
            strip.setBrightness(100);
            strip.show();
#endif
            Serial.println("Data berhasil dikirim ke server!");
        }
    } else {
#ifdef USE_NEOPIXEL
        strip.setPixelColor(0, strip.Color(255, 0, 0));
        strip.setBrightness(100);
        strip.show();
#endif
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
        Serial.println("Possible reasons: server not running, wrong URL, firewall, or network issues.");
    }
    http.end();
#endif
}

void connectWiFi() {
    
}

void setup() {
    Wire.begin();
    Serial.begin(115200);
    connectWiFi();         // Gunakan WiFiManager
    initializeSensors();

   server.on("/", []() {
    server.send(200, "text/plain", "to update go to " + WiFi.localIP().toString() + "/update");
  });

    ElegantOTA.begin(&server);    // Inisialisasi ElegantOTA
    server.begin();
}

static unsigned long previousMillis;
const unsigned long interval = 5000;

void loop() {
    server.handleClient();
    ElegantOTA.loop();
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi disconnected! Attempting to reconnect...");
        connectWiFi();
    }
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis;
        updateSensor();
        sendDataToServer();
    }
}

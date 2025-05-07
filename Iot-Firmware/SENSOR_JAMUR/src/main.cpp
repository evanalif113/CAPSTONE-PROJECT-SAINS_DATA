// Libraries
#include <WiFi.h>
#include <SPI.h>
#include <Adafruit_SHT31.h>
#include <HTTPClient.h>
#include <WebServer.h>
#include <ElegantOTA.h>

//#define USE_RTC
//#define USE_NTP


#define LED_PIN 2

#ifdef USE_RTC
#include <RTClib.h>
#endif

#ifdef USE_NTP
#include <NTPClient.h>
#include <WiFiUdp.h>
#endif

// Replace with your network credentials
const char* ssid     = "Melon Kebakalan";
const char* password = "Melon1234#";

#ifdef USE_NTP
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 7 * 3600, 60000); // UTC+7 Jakarta
#endif

// Server details
const char* serverName = "http://192.168.100.92/sensor/store";
WebServer server(80);

// API Key and Sensor details
String apiKeyValue = "coba123";
String sensorName = "Sensor_2";
String sensorLocation = "Greenhouse";
String sensorID  = "2";

#ifdef USE_RTC
// Initialize RTC sensor
RTC_DS3231 rtc;
#endif

// Initialize I2C sensor
Adafruit_SHT31 sht31 = Adafruit_SHT31();

// Timing variables
unsigned long lastUpdateTime = 0;
const unsigned long updateInterval = 5000;

#ifdef USE_NTP
unsigned long lastNTPUpdateTime = 0;
const unsigned long ntpUpdateInterval = 3600000;
#endif

#ifdef USE_CUSTOM_IP
// Set your Static IP address
IPAddress local_IP(192, 168, 1, 103);
// Set your Gateway IP address
IPAddress gateway(192, 168, 1, 1);

IPAddress subnet(255, 255, 0, 0);
IPAddress primaryDNS(8, 8, 8, 8);   //optional
IPAddress secondaryDNS(8, 8, 4, 4); //optional
#endif

HTTPClient http;

void connect_WiFi() {
  unsigned long wifiStartTime = millis();
  const unsigned long wifiTimeout = 15000; // 15 detik
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED && millis() - wifiStartTime < wifiTimeout) {
    delay(500);
    Serial.print(".");
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected to WiFi network with IP Address: " + WiFi.localIP().toString());
    } else {
    Serial.println("\nWiFi not found, skipping WiFi connection.");
    }
}

void setup() {
  // Serial Baudrate
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  WiFi.mode(WIFI_STA);
  connect_WiFi();

#ifdef USE_RTC
  // Initialize RTC
  if (!rtc.begin()) {
    Serial.println("Tidak menemukan RTC");
    while (1);
  }
#endif

  // Initialize sensor SHT31
  if (!sht31.begin(0x44)) {   // Set to 0x45 if your sensor has that address
    Serial.println("Tidak menemukan sensor SHT31");
    while (1) delay(1);
  }
  #ifdef USE_CUSTOM_IP
   // Configures static IP address
  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    Serial.println("STA Failed to configure");
  }
  #endif
#ifdef USE_NTP
  // Initialize NTP Client
  timeClient.begin();
  timeClient.update();

#ifdef USE_RTC
  // Synchronize RTC with NTP
  rtc.adjust(DateTime(timeClient.getEpochTime()));
#endif

#endif

  server.on("/", []() {
    server.send(200, "text/plain", "SENSOR_OTA_UPDATER VERSION 18-09-2-24");
  });

  ElegantOTA.begin(&server);    // Start ElegantOTA
  server.begin();
  Serial.println("HTTP server started");
}

unsigned long WifiMillis = 0;
const long Wifiinterval = 1800000; // 30 menit dalam milidetik

void loop() {
  // Get the current millis
  unsigned long currentMillis = millis();
  
  // Check if update interval has passed
  if (currentMillis - lastUpdateTime >= updateInterval) {
    digitalWrite(LED_PIN, HIGH); // Turn on LED
    lastUpdateTime = currentMillis; // Save the last update time

    // Read temperature and humidity
    float humidity = sht31.readHumidity();
    float temperature = sht31.readTemperature();
    
    // Check if any reads failed and exit early (to try again).
    if (isnan(humidity) || isnan(temperature)) {
      Serial.println(F("Galat saat membaca sensor SHT31!"));
      return;
    }

    #ifdef USE_RTC
    // Get current time from RTC
    DateTime now = rtc.now();
    String timeStamp = String(now.hour()) + ":" + String(now.minute()) + ":" + String(now.second());
    String dayStamp = String(now.day()) + "-" + String(now.month()) + "-" + String(now.year());
    #endif

    // Check WiFi connection status
    if (WiFi.status() == WL_CONNECTED) {
      
      // Your Domain name with URL path or IP address with path
      http.begin(serverName);
      
      // Specify content-type header
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      
      // Prepare your HTTP POST request data
      String httpRequestData = 
      "apiKey=" + apiKeyValue + 
      "&nama_perangkat=" + sensorName + 
      "&identitas_perangkat=" + sensorLocation + 
      "&suhu=" + String(temperature) + 
      "&kelembaban=" + String(humidity) + 
      "&hst=" + "1";
      Serial.print("httpRequestData: ");
      Serial.println(httpRequestData);
      
      // Send HTTP POST request
      int httpResponseCode = http.POST(httpRequestData);
          
      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
      } else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      
      // Free resources
      http.end();
      digitalWrite(LED_PIN, LOW); // Turn off LED
    } else {
      Serial.println("Jaringan Terputus");
    }
  }

  if (WiFi.status() != WL_CONNECTED && (currentMillis - WifiMillis >= Wifiinterval)) {
    WifiMillis = currentMillis;
    ESP.restart();
  }

#ifdef USE_NTP
  // Periodically update NTP time
  if (currentMillis - lastNTPUpdateTime >= ntpUpdateInterval) {
    lastNTPUpdateTime = currentMillis;
    timeClient.update();
#ifdef USE_RTC
    rtc.adjust(DateTime(timeClient.getEpochTime()));
#endif
  }
#endif

  server.handleClient();
  ElegantOTA.loop();
}
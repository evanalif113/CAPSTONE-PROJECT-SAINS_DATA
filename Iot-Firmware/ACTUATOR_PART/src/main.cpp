#include <WiFi.h>
#include <HTTPClient.h>

// WiFi credentials
const char* ssid = "your-SSID";
const char* password = "your-PASSWORD";

// API endpoint
const char* apiUrl = "http://your-api-endpoint.com/status";

// Relay pin
const int relayPin = 5;

// Timing variables
unsigned long previousMillis = 0; // Store the last time the API was called
const unsigned long interval = 5000; // Interval for API calls (5 seconds)

void setup() {
    // Initialize serial communication
    Serial.begin(115200);

    // Initialize relay pin
    pinMode(relayPin, OUTPUT);
    digitalWrite(relayPin, LOW); // Ensure relay is off initially

    // Connect to WiFi
    Serial.print("Connecting to WiFi");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi connected");
}

void loop() {
    unsigned long currentMillis = millis();

    if (currentMillis - previousMillis >= interval) {
        previousMillis = currentMillis; // Update the last call time

        if (WiFi.status() == WL_CONNECTED) {
            HTTPClient http;

            // Make a GET request to the API
            http.begin(apiUrl);
            int httpResponseCode = http.GET();

            if (httpResponseCode == 200) { // HTTP OK
                String payload = http.getString();
                Serial.println("API Response: " + payload);

                // Control relay based on API response
                if (payload == "1") {
                    digitalWrite(relayPin, HIGH); // Turn relay ON
                    Serial.println("Relay ON");
                } else if (payload == "0") {
                    digitalWrite(relayPin, LOW); // Turn relay OFF
                    Serial.println("Relay OFF");
                } else {
                    Serial.println("Invalid API response");
                }
            } else {
                Serial.print("Error in HTTP request: ");
                Serial.println(httpResponseCode);
            }

            http.end();
        } else {
            Serial.println("WiFi not connected");
        }
    }

    // Other non-blocking tasks can be added here
}

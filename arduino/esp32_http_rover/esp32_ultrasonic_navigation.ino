/**
 * Smart Tunnel Inspection Rover - Ultrasonic Navigation
 * Civil Engineering Department - 2025
 * 
 * Features:
 * - Ultrasonic-based obstacle avoidance navigation
 * - HTTP POST to production backend (Render)
 * - DHT22, MQ-2 sensors (ultrasonic removed from data)
 * - L298N motor driver control
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// ==================== WiFi Configuration ====================
const char* WIFI_SSID[] = {"ZORO", "Santhosh SK", "Aadeesh"};
const char* WIFI_PASSWORD[] = {"zoro1111", "12345678", "12312312"};
const int WIFI_COUNT = 3;

// ==================== Server Configuration ====================
const char* SERVER_URL = "https://smart-tunnel-rover.onrender.com/api/sensor-data";

// ==================== Pin Definitions ====================
// L298N Motor Driver Pins
#define MOTOR_IN1 27    // Left motor forward
#define MOTOR_IN2 26    // Left motor backward
#define MOTOR_IN3 12    // Right motor forward
#define MOTOR_IN4 14    // Right motor backward

// HC-SR04 Ultrasonic Sensor
#define TRIG_PIN 13     // Ultrasonic trigger
#define ECHO_PIN 32     // Ultrasonic echo

// DHT22 Temperature/Humidity Sensor
#define DHT_PIN 33      // DHT22 data pin
#define DHT_TYPE DHT22

// MQ-2 Gas Sensor
#define MQ2_PIN 34      // Analog input (ADC)

// ==================== Navigation Constants ====================
#define OBSTACLE_DISTANCE 30   // Stop and turn if obstacle within 30cm
#define SAFE_DISTANCE 50       // Slow down if within 50cm
#define UPDATE_INTERVAL 2000   // Send data every 2 seconds

// ==================== Objects ====================
DHT dht(DHT_PIN, DHT_TYPE);

// ==================== Global Variables ====================
unsigned long lastUpdate = 0;
String deviceId = "rover_001";

// ==================== WiFi Connection ====================
void connectWiFi() {
  Serial.println("\n📡 Connecting to WiFi...");
  
  for (int i = 0; i < WIFI_COUNT; i++) {
    Serial.print("Trying: ");
    Serial.println(WIFI_SSID[i]);
    
    WiFi.begin(WIFI_SSID[i], WIFI_PASSWORD[i]);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
      delay(500);
      Serial.print(".");
      attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\n✅ WiFi connected!");
      Serial.print("📶 Network: ");
      Serial.println(WIFI_SSID[i]);
      Serial.print("📍 IP Address: ");
      Serial.println(WiFi.localIP());
      Serial.print("💪 Signal: ");
      Serial.print(WiFi.RSSI());
      Serial.println(" dBm");
      return;
    }
    
    Serial.println("\n❌ Failed, trying next...");
    WiFi.disconnect();
  }
  
  Serial.println("\n⚠️  All networks failed! Continuing offline...");
}

// ==================== Motor Control ====================
void setupMotors() {
  pinMode(MOTOR_IN1, OUTPUT);
  pinMode(MOTOR_IN2, OUTPUT);
  pinMode(MOTOR_IN3, OUTPUT);
  pinMode(MOTOR_IN4, OUTPUT);
  stopMotors();
  Serial.println("✅ Motor driver initialized");
}

void stopMotors() {
  digitalWrite(MOTOR_IN1, LOW);
  digitalWrite(MOTOR_IN2, LOW);
  digitalWrite(MOTOR_IN3, LOW);
  digitalWrite(MOTOR_IN4, LOW);
}

void moveForward() {
  digitalWrite(MOTOR_IN1, HIGH);  // Left forward
  digitalWrite(MOTOR_IN2, LOW);
  digitalWrite(MOTOR_IN3, HIGH);  // Right forward
  digitalWrite(MOTOR_IN4, LOW);
}

void moveBackward() {
  digitalWrite(MOTOR_IN1, LOW);
  digitalWrite(MOTOR_IN2, HIGH);  // Left backward
  digitalWrite(MOTOR_IN3, LOW);
  digitalWrite(MOTOR_IN4, HIGH);  // Right backward
}

void turnRight() {
  digitalWrite(MOTOR_IN1, HIGH);  // Left forward
  digitalWrite(MOTOR_IN2, LOW);
  digitalWrite(MOTOR_IN3, LOW);   // Right backward
  digitalWrite(MOTOR_IN4, HIGH);
}

void turnLeft() {
  digitalWrite(MOTOR_IN1, LOW);   // Left backward
  digitalWrite(MOTOR_IN2, HIGH);
  digitalWrite(MOTOR_IN3, HIGH);  // Right forward
  digitalWrite(MOTOR_IN4, LOW);
}

// ==================== Sensor Functions ====================
float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return 400.0;
  
  float distance = duration * 0.034 / 2;
  return (distance > 400.0) ? 400.0 : distance;
}

float readTemperature() {
  float temp = dht.readTemperature();
  return isnan(temp) ? 0.0 : temp;
}

float readHumidity() {
  float hum = dht.readHumidity();
  return isnan(hum) ? 0.0 : hum;
}

int readGasLevel() {
  int rawValue = analogRead(MQ2_PIN);
  return map(rawValue, 0, 4095, 0, 1000);
}

// ==================== HTTP Data Transmission ====================
void sendDataToServer() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️  No WiFi - skipping upload");
    return;
  }
  
  // Read sensors
  float temperature = readTemperature();
  float humidity = readHumidity();
  int gasLevel = readGasLevel();
  
  // Print readings
  Serial.println("\n📊 Sensor Data:");
  Serial.printf("🌡️  Temperature: %.1f°C\n", temperature);
  Serial.printf("💧 Humidity: %.1f%%\n", humidity);
  Serial.printf("💨 Gas Level: %d ppm\n", gasLevel);
  
  // Create JSON payload (no distance included)
  String jsonData = "{";
  jsonData += "\"temperature\":" + String(temperature, 1) + ",";
  jsonData += "\"humidity\":" + String(humidity, 1) + ",";
  jsonData += "\"gasLevel\":" + String(gasLevel) + ",";
  jsonData += "\"deviceId\":\"" + deviceId + "\",";
  jsonData += "\"timestamp\":" + String(millis() / 1000);
  jsonData += "}";
  
  // Send HTTP POST
  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.POST(jsonData);
  
  if (httpCode > 0) {
    if (httpCode == 200) {
      Serial.println("✅ Data sent to server");
    } else {
      Serial.printf("⚠️  Server response: %d\n", httpCode);
    }
  } else {
    Serial.printf("❌ HTTP error: %s\n", http.errorToString(httpCode).c_str());
  }
  
  http.end();
}

// ==================== Setup ====================
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n╔════════════════════════════════════════╗");
  Serial.println("║   Smart Tunnel Inspection Rover v4.0  ║");
  Serial.println("║   Civil Engineering Department - 2025  ║");
  Serial.println("║   Ultrasonic Navigation Mode           ║");
  Serial.println("╚════════════════════════════════════════╝\n");

  // Initialize hardware
  Serial.println("🔧 Initializing hardware...");
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  dht.begin();
  Serial.println("✅ Sensors initialized");
  
  setupMotors();
  connectWiFi();
  
  Serial.println("\n╔════════════════════════════════════════╗");
  Serial.println("║        🚀 ROVER READY - AUTO MODE      ║");
  Serial.println("╚════════════════════════════════════════╝\n");
  Serial.println("Navigation Logic:");
  Serial.println("  🚧 Distance < 30cm → TURN RIGHT");
  Serial.println("  ⚡ Distance 30-50cm → CAUTIOUS FORWARD");
  Serial.println("  ✅ Distance > 50cm → FULL FORWARD\n");
  
  delay(2000);
}

// ==================== Main Loop ====================
void loop() {
  unsigned long currentMillis = millis();
  
  // Send sensor data every 2 seconds
  if (currentMillis - lastUpdate >= UPDATE_INTERVAL) {
    sendDataToServer();
    lastUpdate = currentMillis;
  }
  
  // Read ultrasonic distance for navigation
  float distance = getDistance();
  
  Serial.printf("📏 Distance: %.1f cm → ", distance);
  
  // Motor control based on ultrasonic detection
  if (distance < OBSTACLE_DISTANCE) {
    // OBSTACLE DETECTED - Turn right
    Serial.println("🚧 OBSTACLE! Turning right...");
    stopMotors();
    delay(300);
    turnRight();
    delay(800);  // Turn 800ms
    stopMotors();
    delay(200);
  } 
  else if (distance < SAFE_DISTANCE) {
    // APPROACHING OBSTACLE - Slow forward with pauses
    Serial.println("⚡ Approaching - Cautious mode");
    moveForward();
    delay(500);
    stopMotors();
    delay(500);
  } 
  else {
    // CLEAR PATH - Full forward
    Serial.println("✅ Clear path - Full forward");
    moveForward();
  }
  
  delay(100);  // Stability delay
}

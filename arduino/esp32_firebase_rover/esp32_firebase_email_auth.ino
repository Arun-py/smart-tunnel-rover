/**
 * Smart Tunnel Inspection Rover - ESP32 Firebase Email Auth
 * Civil Engineering Department - 2025
 * 
 * Features:
 * - Autonomous circular movement (2s forward, 10s scan, 0.5s turn right)
 * - Firebase Email/Password authentication
 * - DHT22, MQ-2, HC-SR04 sensors
 * - L298N motor driver control
 * 
 * Authentication: 727723euee010@skcet.ac.in
 */

#include <WiFi.h>
#include <DHT.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// ==================== WiFi Configuration ====================
const char* ssid[] = {"ZORO", "Santhosh SK", "Aadeesh"};
const char* password[] = {"zoro1111", "12345678", "12312312"};
const int numNetworks = 3;

// ==================== Firebase Configuration ====================
#define API_KEY "AIzaSyAbsngu27x5C2Nv_wzoD2WeZmNF4eW84V0"
#define DATABASE_URL "https://rover-6126b-default-rtdb.asia-southeast1.firebasedatabase.app"

// Firebase Email Authentication
#define USER_EMAIL "727723euee010@skcet.ac.in"
#define USER_PASSWORD "Arun2786****"

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
unsigned long dataMillis = 0;
bool firebaseReady = false;

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

// ==================== Constants ====================
#define MOVE_DURATION 2000     // Move forward for 2 seconds
#define SCAN_DURATION 10000    // Scan for 10 seconds
#define TURN_DURATION 500      // Turn right for 0.5 seconds
#define UPDATE_INTERVAL 2000   // Send data every 2 seconds

// ==================== Objects ====================
DHT dht(DHT_PIN, DHT_TYPE);

// ==================== Global Variables ====================
unsigned long lastUpdate = 0;
unsigned long stateTimer = 0;
int currentState = 0;  // 0=move forward, 1=scan, 2=turn right
int scanCount = 0;
String deviceId = "rover_001";

// ==================== WiFi Connection ====================
void connectWiFi() {
  Serial.println("\n📡 Connecting to WiFi...");
  
  for (int i = 0; i < numNetworks; i++) {
    Serial.print("Trying: ");
    Serial.println(ssid[i]);
    
    WiFi.begin(ssid[i], password[i]);
    
    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
      delay(500);
      Serial.print(".");
      attempts++;
    }
    
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\n✅ WiFi connected!");
      Serial.print("📶 Network: ");
      Serial.println(ssid[i]);
      Serial.print("📍 IP Address: ");
      Serial.println(WiFi.localIP());
      Serial.print("💪 Signal Strength: ");
      Serial.print(WiFi.RSSI());
      Serial.println(" dBm");
      return;
    }
    
    Serial.println("\n❌ Connection failed, trying next network...");
    WiFi.disconnect();
  }
  
  Serial.println("\n❌ All WiFi networks failed!");
  Serial.println("⚠️ Continuing without network...");
}

// ==================== Firebase Setup ====================
void setupFirebase() {
  Serial.println("\n🔥 Initializing Firebase...");
  
  // Assign API key
  config.api_key = API_KEY;
  
  // Assign user credentials
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  
  // Assign database URL
  config.database_url = DATABASE_URL;
  
  // Assign token status callback
  config.token_status_callback = tokenStatusCallback;
  
  // Set buffer sizes for optimal performance
  fbdo.setBSSLBufferSize(4096, 1024);
  fbdo.setResponseSize(2048);
  
  // Initialize Firebase
  Firebase.begin(&config, &auth);
  
  // Enable auto-reconnect
  Firebase.reconnectWiFi(true);
  
  Serial.println("⏳ Waiting for authentication...");
  
  // Wait for token
  unsigned long authStart = millis();
  while (!Firebase.ready() && (millis() - authStart < 30000)) {
    delay(100);
  }
  
  if (Firebase.ready()) {
    firebaseReady = true;
    Serial.println("✅ Firebase authenticated successfully!");
    Serial.print("👤 User: ");
    Serial.println(USER_EMAIL);
    Serial.print("🔑 UID: ");
    Serial.println(auth.token.uid.c_str());
  } else {
    Serial.println("❌ Firebase authentication failed!");
    Serial.println("⚠️ Will retry on data send...");
  }
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

void turnRight() {
  digitalWrite(MOTOR_IN1, HIGH);  // Left forward
  digitalWrite(MOTOR_IN2, LOW);
  digitalWrite(MOTOR_IN3, LOW);   // Right backward
  digitalWrite(MOTOR_IN4, HIGH);
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

// ==================== Firebase Data Upload ====================
void sendDataToFirebase() {
  if (!firebaseReady && !Firebase.ready()) {
    Serial.println("⚠️ Firebase not ready, skipping upload");
    return;
  }
  
  // Read all sensors
  float temperature = readTemperature();
  float humidity = readHumidity();
  int gasLevel = readGasLevel();
  float distance = getDistance();
  
  // Print to Serial Monitor
  Serial.println("\n📊 Sensor Readings:");
  Serial.printf("🌡️  Temperature: %.1f°C\n", temperature);
  Serial.printf("💧 Humidity: %.1f%%\n", humidity);
  Serial.printf("💨 Gas Level: %d ppm\n", gasLevel);
  Serial.printf("📏 Distance: %.1f cm\n", distance);
  
  // Determine condition
  String condition = "Normal";
  if (gasLevel > 300) condition = "Gas Alert!";
  else if (distance < 30) condition = "Obstacle Near!";
  
  // Upload to Firebase
  Serial.println("\n🔄 Uploading to Firebase...");
  
  bool success = true;
  
  // Upload temperature
  if (Firebase.RTDB.setFloat(&fbdo, "/sensors/temperature", temperature)) {
    Serial.println("✅ Temperature uploaded");
  } else {
    Serial.println("❌ Temperature failed: " + fbdo.errorReason());
    success = false;
  }
  
  // Upload humidity
  if (Firebase.RTDB.setFloat(&fbdo, "/sensors/humidity", humidity)) {
    Serial.println("✅ Humidity uploaded");
  } else {
    Serial.println("❌ Humidity failed: " + fbdo.errorReason());
    success = false;
  }
  
  // Upload gas level
  if (Firebase.RTDB.setInt(&fbdo, "/sensors/gasLevel", gasLevel)) {
    Serial.println("✅ Gas level uploaded");
  } else {
    Serial.println("❌ Gas level failed: " + fbdo.errorReason());
    success = false;
  }
  
  // Upload distance
  if (Firebase.RTDB.setFloat(&fbdo, "/sensors/distance", distance)) {
    Serial.println("✅ Distance uploaded");
  } else {
    Serial.println("❌ Distance failed: " + fbdo.errorReason());
    success = false;
  }
  
  // Upload condition
  if (Firebase.RTDB.setString(&fbdo, "/sensors/condition", condition)) {
    Serial.println("✅ Condition uploaded");
  } else {
    Serial.println("❌ Condition failed: " + fbdo.errorReason());
    success = false;
  }
  
  // Upload timestamp
  if (Firebase.RTDB.setInt(&fbdo, "/sensors/timestamp", millis()/1000)) {
    Serial.println("✅ Timestamp uploaded");
  } else {
    Serial.println("❌ Timestamp failed: " + fbdo.errorReason());
    success = false;
  }
  
  // Upload device ID
  if (Firebase.RTDB.setString(&fbdo, "/sensors/deviceId", deviceId)) {
    Serial.println("✅ Device ID uploaded");
  } else {
    Serial.println("❌ Device ID failed: " + fbdo.errorReason());
    success = false;
  }
  
  if (success) {
    Serial.println("\n🎉 All data uploaded successfully!");
    firebaseReady = true;
  } else {
    Serial.println("\n⚠️ Some data failed to upload");
  }
}

// ==================== Main Setup ====================
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n╔════════════════════════════════════════╗");
  Serial.println("║  Smart Tunnel Inspection Rover v3.0   ║");
  Serial.println("║  Civil Engineering Department - 2025   ║");
  Serial.println("║  Firebase Email Authentication Mode    ║");
  Serial.println("╚════════════════════════════════════════╝\n");

  // Initialize sensors
  Serial.println("🔧 Initializing hardware...");
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  dht.begin();
  Serial.println("✅ Sensors initialized");
  
  // Initialize motors
  setupMotors();
  
  // Connect to WiFi
  connectWiFi();
  
  // Setup Firebase with email auth
  if (WiFi.status() == WL_CONNECTED) {
    setupFirebase();
  } else {
    Serial.println("⚠️ Skipping Firebase setup (no WiFi)");
  }
  
  Serial.println("\n╔════════════════════════════════════════╗");
  Serial.println("║     🚀 ROVER READY - AUTONOMOUS MODE   ║");
  Serial.println("╚════════════════════════════════════════╝\n");
  Serial.println("Movement Pattern:");
  Serial.println("  ➡️  2 seconds FORWARD");
  Serial.println("  🔍 10 seconds SCANNING (5 readings)");
  Serial.println("  ↩️  0.5 seconds TURN RIGHT");
  Serial.println("  🔁 REPEAT\n");
  
  stateTimer = millis();
}

// ==================== Main Loop ====================
void loop() {
  unsigned long currentMillis = millis();
  
  switch (currentState) {
    // ==================== STATE 0: MOVE FORWARD ====================
    case 0:
      if (currentMillis - stateTimer == 0) {
        Serial.println("\n🚗 STATE: MOVING FORWARD (2 seconds)");
        moveForward();
      }
      
      if (currentMillis - stateTimer >= MOVE_DURATION) {
        stopMotors();
        Serial.println("⏸️  Motors stopped");
        currentState = 1;
        stateTimer = currentMillis;
        scanCount = 0;
        lastUpdate = 0;  // Force immediate first reading
      }
      break;
    
    // ==================== STATE 1: SCANNING ====================
    case 1:
      if (currentMillis - stateTimer == 0) {
        Serial.println("\n🔍 STATE: SCANNING (10 seconds - 5 readings)");
      }
      
      // Take reading every 2 seconds (5 total readings)
      if (currentMillis - lastUpdate >= UPDATE_INTERVAL) {
        scanCount++;
        Serial.printf("\n📡 Reading %d/5:\n", scanCount);
        sendDataToFirebase();
        lastUpdate = currentMillis;
      }
      
      if (currentMillis - stateTimer >= SCAN_DURATION) {
        currentState = 2;
        stateTimer = currentMillis;
      }
      break;
    
    // ==================== STATE 2: TURN RIGHT ====================
    case 2:
      if (currentMillis - stateTimer == 0) {
        Serial.println("\n↩️  STATE: TURNING RIGHT (0.5 seconds)");
        turnRight();
      }
      
      if (currentMillis - stateTimer >= TURN_DURATION) {
        stopMotors();
        Serial.println("⏸️  Turn complete");
        currentState = 0;
        stateTimer = currentMillis;
        Serial.println("\n━━━━━━━━━━━━ CYCLE COMPLETE ━━━━━━━━━━━━\n");
      }
      break;
  }
  
  delay(10);  // Small delay for stability
}

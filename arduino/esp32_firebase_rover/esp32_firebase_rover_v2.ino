/**
 * Smart Tunnel Inspection Rover - ESP32 Firebase Mode
 * Civil Engineering Department - 2025
 * 
 * Features:
 * - Autonomous circular movement (2s forward, 10s scan, 0.5s turn right)
 * - Firebase Realtime Database integration
 * - DHT22, MQ-2, HC-SR04 sensors
 * - L298N motor driver control
 */

#include <WiFi.h>
#include <DHT.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// ==================== WiFi Configuration ====================
#define WIFI_SSID "ZORO"
#define WIFI_PASSWORD "zoro1111"

// ==================== Firebase Configuration ====================
#define API_KEY "AIzaSyAbsngu27x5C2Nv_wzoD2WeZmNF4eW84V0"
#define DATABASE_URL "https://rover-6126b-default-rtdb.asia-southeast1.firebasedatabase.app"

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
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

// ==================== Function Prototypes ====================
void connectWiFi();
void setupFirebase();
void setupMotors();
float getDistance();
float readTemperature();
float readHumidity();
int readGasLevel();
void stopMotors();
void moveForward();
void turnRight();
void sendDataToFirebase();

// ==================== Setup ====================
void setup() {
  Serial.begin(115200);
  Serial.println("\n=== Smart Tunnel Inspection Rover ===");
  Serial.println("Civil Engineering Department - 2025\n");

  // Initialize sensors
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  dht.begin();
  
  // Initialize motors
  setupMotors();
  
  // Connect to WiFi
  connectWiFi();
  
  // Setup Firebase
  setupFirebase();
  
  Serial.println("\n=== Rover Initialized ===");
  Serial.println("Starting autonomous navigation...\n");
  
  stateTimer = millis();
}

// ==================== Main Loop ====================
void loop() {
  unsigned long currentTime = millis();
  
  // State machine for autonomous movement
  switch (currentState) {
    case 0: // Move Forward State
      if (currentTime - stateTimer < MOVE_DURATION) {
        moveForward();
      } else {
        stopMotors();
        Serial.println("✓ Moved forward 2 seconds");
        currentState = 1;
        stateTimer = currentTime;
        scanCount = 0;
      }
      break;
      
    case 1: // Scan State (10 seconds)
      stopMotors();
      if (currentTime - stateTimer < SCAN_DURATION) {
        // Send data every 2 seconds during scan
        if (currentTime - lastUpdate >= UPDATE_INTERVAL) {
          Serial.println("\n📡 Scanning... (" + String(scanCount + 1) + "/5)");
          sendDataToFirebase();
          lastUpdate = currentTime;
          scanCount++;
        }
      } else {
        Serial.println("✓ Scan complete");
        currentState = 2;
        stateTimer = currentTime;
      }
      break;
      
    case 2: // Turn Right State
      if (currentTime - stateTimer < TURN_DURATION) {
        turnRight();
      } else {
        stopMotors();
        Serial.println("✓ Turned right\n");
        Serial.println("--- Next cycle ---");
        currentState = 0; // Back to move forward
        stateTimer = currentTime;
      }
      break;
  }
}

// ==================== WiFi Connection ====================
void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    Serial.print(".");
    delay(500);
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n⚠️ WiFi connection failed - Running offline");
  }
}

// ==================== Firebase Setup ====================
void setupFirebase() {
  Serial.println("Initializing Firebase...");
  
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  
  // Anonymous sign-in
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("✅ Firebase anonymous sign-in successful");
    firebaseReady = true;
  } else {
    Serial.printf("❌ Firebase sign-up failed: %s\n", config.signer.signupError.message.c_str());
    firebaseReady = false;
  }
  
  config.token_status_callback = tokenStatusCallback;
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  
  Serial.println("✓ Firebase initialized");
}

// ==================== Motor Setup ====================
void setupMotors() {
  pinMode(MOTOR_IN1, OUTPUT);
  pinMode(MOTOR_IN2, OUTPUT);
  pinMode(MOTOR_IN3, OUTPUT);
  pinMode(MOTOR_IN4, OUTPUT);
  
  stopMotors();
  Serial.println("✓ Motors initialized");
}

// ==================== Ultrasonic Distance ====================
float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  
  if (duration == 0) {
    return 999.0; // No obstacle detected
  }
  
  float distance = duration * 0.034 / 2.0;
  return distance;
}

// ==================== DHT22 Sensors ====================
float readTemperature() {
  float temp = dht.readTemperature();
  if (isnan(temp)) {
    Serial.println("⚠️ Failed to read temperature");
    return 25.0; // Default value
  }
  return temp;
}

float readHumidity() {
  float hum = dht.readHumidity();
  if (isnan(hum)) {
    Serial.println("⚠️ Failed to read humidity");
    return 60.0; // Default value
  }
  return hum;
}

// ==================== MQ-2 Gas Sensor ====================
int readGasLevel() {
  int rawValue = analogRead(MQ2_PIN);
  // Map 12-bit ADC (0-4095) to 0-1000 ppm
  int gasPPM = map(rawValue, 0, 4095, 0, 1000);
  return gasPPM;
}

// ==================== Motor Control ====================
void stopMotors() {
  digitalWrite(MOTOR_IN1, LOW);
  digitalWrite(MOTOR_IN2, LOW);
  digitalWrite(MOTOR_IN3, LOW);
  digitalWrite(MOTOR_IN4, LOW);
}

void moveForward() {
  digitalWrite(MOTOR_IN1, HIGH);
  digitalWrite(MOTOR_IN2, LOW);
  digitalWrite(MOTOR_IN3, HIGH);
  digitalWrite(MOTOR_IN4, LOW);
}

void turnRight() {
  // Left motor forward, right motor backward
  digitalWrite(MOTOR_IN1, HIGH);
  digitalWrite(MOTOR_IN2, LOW);
  digitalWrite(MOTOR_IN3, LOW);
  digitalWrite(MOTOR_IN4, HIGH);
}

// ==================== Firebase Data Upload ====================
void sendDataToFirebase() {
  if (!firebaseReady || WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️ Firebase/WiFi not ready - Data not sent");
    return;
  }
  
  // Read all sensors
  float temperature = readTemperature();
  float humidity = readHumidity();
  int gasLevel = readGasLevel();
  float distance = getDistance();
  
  // Display readings
  Serial.println("📊 Sensor Data:");
  Serial.printf("  🌡 Temp: %.1f°C\n", temperature);
  Serial.printf("  💧 Humidity: %.1f%%\n", humidity);
  Serial.printf("  🧪 Gas: %d ppm\n", gasLevel);
  Serial.printf("  📏 Distance: %.1f cm\n", distance);
  
  // Determine condition
  String condition = "Good";
  if (gasLevel > 300 || temperature > 35 || humidity < 20 || distance < 30) {
    condition = "Bad";
  } else if (gasLevel > 150 || temperature > 30 || humidity < 30 || distance < 50) {
    condition = "Warning";
  }
  
  Serial.printf("  🧠 Condition: %s\n", condition.c_str());
  
  // Upload to Firebase under /sensors path
  bool success = true;
  
  if (!Firebase.RTDB.setFloat(&fbdo, "/sensors/temperature", temperature)) {
    Serial.println("❌ Temp upload failed: " + fbdo.errorReason());
    success = false;
  }
  
  if (!Firebase.RTDB.setFloat(&fbdo, "/sensors/humidity", humidity)) {
    Serial.println("❌ Humidity upload failed: " + fbdo.errorReason());
    success = false;
  }
  
  if (!Firebase.RTDB.setInt(&fbdo, "/sensors/gasLevel", gasLevel)) {
    Serial.println("❌ Gas upload failed: " + fbdo.errorReason());
    success = false;
  }
  
  if (!Firebase.RTDB.setFloat(&fbdo, "/sensors/distance", distance)) {
    Serial.println("❌ Distance upload failed: " + fbdo.errorReason());
    success = false;
  }
  
  if (!Firebase.RTDB.setString(&fbdo, "/sensors/condition", condition)) {
    Serial.println("❌ Condition upload failed: " + fbdo.errorReason());
    success = false;
  }
  
  // Upload timestamp
  if (!Firebase.RTDB.setInt(&fbdo, "/sensors/timestamp", millis())) {
    Serial.println("❌ Timestamp upload failed: " + fbdo.errorReason());
    success = false;
  }
  
  // Upload device ID
  if (!Firebase.RTDB.setString(&fbdo, "/sensors/deviceId", "rover_001")) {
    Serial.println("❌ Device ID upload failed: " + fbdo.errorReason());
    success = false;
  }
  
  if (success) {
    Serial.println("✅ Data uploaded to Firebase successfully");
  }
  Serial.println();
}

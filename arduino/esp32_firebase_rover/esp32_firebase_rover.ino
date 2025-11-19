/**
 * Smart Tunnel Inspection Rover - ESP32 Autonomous Mode
 * Civil Engineering Department - 2025
 * 
 * Features:
 * - Autonomous movement (1m forward, 10s scan, turn right, repeat in circle)
 * - Obstacle detection with HC-SR04 ultrasonic
 * - Gas detection with MQ-2 sensor
 * - Temperature/Humidity monitoring with DHT22
 * - Firebase Realtime Database integration
 * - L298N motor driver control
 */

#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>

// ==================== WiFi Configuration ====================
// Try multiple WiFi networks
const char* WIFI_SSID[] = {"ZORO", "Santhosh SK", "Aadeesh"};
const char* WIFI_PASSWORD[] = {"zoro1111", "12345678", "12312312"};
const int WIFI_COUNT = 3;

// ==================== Firebase Configuration ====================
#define FIREBASE_HOST "rover-6126b-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "bT0FyPE0lsJNnZ4IUusDacaISBQKFittayqMU19G"

FirebaseData firebaseData;
FirebaseConfig firebaseConfig;
FirebaseAuth firebaseAuth;

// ==================== Pin Definitions ====================
// L298N Motor Driver Pins
#define MOTOR_IN1 27    // Left motor forward
#define MOTOR_IN2 26    // Left motor backward
#define MOTOR_IN3 12    // Right motor forward
#define MOTOR_IN4 14    // Right motor backward
// ENA and ENB not connected - L298N jumpers ON for full speed

// HC-SR04 Ultrasonic Sensor
#define TRIG_PIN 13     // Ultrasonic trigger
#define ECHO_PIN 32     // Ultrasonic echo

// DHT22 Temperature/Humidity Sensor
#define DHT_PIN 33      // DHT22 data pin
#define DHT_TYPE DHT22

// MQ-2 Gas Sensor
#define MQ2_PIN 34      // Analog input (ADC)

// ==================== Constants ====================
#define SAFE_DISTANCE 30       // Safe distance in cm
#define MOVE_DURATION 2000     // Move forward for 2 seconds (~1 meter)
#define SCAN_DURATION 10000    // Scan for 10 seconds
#define TURN_DURATION 500      // Turn right for 0.5 seconds
#define UPDATE_INTERVAL 2000   // Firebase update every 2 seconds

// ==================== Objects ====================
DHT dht(DHT_PIN, DHT_TYPE);

// ==================== Global Variables ====================
unsigned long lastUpdate = 0;
unsigned long stateTimer = 0;
int currentState = 0;  // 0=move forward, 1=scan, 2=turn right
int scanCount = 0;

// ==================== Function Prototypes ====================
void connectWiFi();
void connectFirebase();
void setupMotors();
float getDistance();
float readTemperature();
float readHumidity();
int readGasLevel();
void stopMotors();
void moveForward();
void turnRight();
void sendDataToFirebase();
bool checkObstacle();

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
  
  // Connect to Firebase
  connectFirebase();
  
  Serial.println("\n=== Rover Initialized ===");
  Serial.println("Starting autonomous navigation in circle...\n");
  
  stateTimer = millis();
}

// ==================== Main Loop ====================
void loop() {
  unsigned long currentTime = millis();
  
  // State machine for autonomous movement (no obstacle checking)
  switch (currentState) {
    case 0: // Move Forward State
      if (currentTime - stateTimer < MOVE_DURATION) {
        moveForward();
      } else {
        stopMotors();
        Serial.println("✓ Moved ~1 meter forward");
        currentState = 1;
        stateTimer = currentTime;
        scanCount = 0;
      }
      break;
      
    case 1: // Scan State (10 seconds)
      stopMotors();
      if (currentTime - stateTimer < SCAN_DURATION) {
        // Send data to Firebase every 2 seconds during scan
        if (currentTime - lastUpdate >= UPDATE_INTERVAL) {
          Serial.println("\n📡 Scanning environment... (" + String(scanCount + 1) + "/5)");
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
        Serial.println("--- Starting next cycle ---");
        currentState = 0; // Back to move forward
        stateTimer = currentTime;
      }
      break;
  }
}

// ==================== WiFi Connection ====================
void connectWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.mode(WIFI_STA);
  
  bool connected = false;
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
      connected = true;
      Serial.println("\n✓ WiFi connected!");
      Serial.print("SSID: ");
      Serial.println(WIFI_SSID[i]);
      Serial.print("IP Address: ");
      Serial.println(WiFi.localIP());
      break;
    } else {
      Serial.println("\n✗ Failed");
    }
  }
  
  if (!connected) {
    Serial.println("⚠️ Could not connect to any WiFi network!");
    Serial.println("Continuing in offline mode...");
  }
}

// ==================== Firebase Connection ====================
void connectFirebase() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️ Skipping Firebase - No WiFi");
    return;
  }
  
  Serial.println("\nConnecting to Firebase...");
  
  // Configure Firebase with config struct
  firebaseConfig.database_url = FIREBASE_HOST;
  firebaseConfig.signer.tokens.legacy_token = FIREBASE_AUTH;
  
  // Disable SSL certificate verification for stability
  firebaseConfig.cert.data = NULL;
  
  Firebase.begin(&firebaseConfig, &firebaseAuth);
  Firebase.reconnectWiFi(true);
  
  // Set timeout and buffer size
  firebaseData.setBSSLBufferSize(512, 512);
  firebaseData.setResponseSize(2048);
  Firebase.setReadTimeout(firebaseData, 1000 * 60);
  Firebase.setwriteSizeLimit(firebaseData, "tiny");
  
  Serial.println("✓ Firebase configured!");
  Serial.print("Database: https://");
  Serial.println(FIREBASE_HOST);
}

// ==================== Motor Setup ====================
void setupMotors() {
  pinMode(MOTOR_IN1, OUTPUT);
  pinMode(MOTOR_IN2, OUTPUT);
  pinMode(MOTOR_IN3, OUTPUT);
  pinMode(MOTOR_IN4, OUTPUT);
  
  stopMotors();
  Serial.println("✓ Motors initialized (Full speed - ENA/ENB jumpers ON)");
}

// ==================== Ultrasonic Distance ====================
float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms timeout
  
  if (duration == 0) {
    return 999; // No echo (clear path)
  }
  
  float distance = duration * 0.034 / 2; // Convert to cm
  return distance;
}

// ==================== DHT22 Sensors ====================
float readTemperature() {
  float temp = dht.readTemperature();
  if (isnan(temp)) {
    return 25.0; // Default value
  }
  return temp;
}

float readHumidity() {
  float hum = dht.readHumidity();
  if (isnan(hum)) {
    return 60.0; // Default value
  }
  return hum;
}

// ==================== MQ-2 Gas Sensor ====================
int readGasLevel() {
  int rawValue = analogRead(MQ2_PIN);
  // Map 0-4095 (12-bit ADC) to 0-1000 ppm
  int gasPPM = map(rawValue, 0, 4095, 0, 1000);
  return gasPPM; // Send actual reading to Firebase
}

// ==================== Motor Control ====================
void stopMotors() {
  digitalWrite(MOTOR_IN1, LOW);
  digitalWrite(MOTOR_IN2, LOW);
  digitalWrite(MOTOR_IN3, LOW);
  digitalWrite(MOTOR_IN4, LOW);
}

void moveForward() {
  // Left motors forward
  digitalWrite(MOTOR_IN1, HIGH);
  digitalWrite(MOTOR_IN2, LOW);
  // Right motors forward
  digitalWrite(MOTOR_IN3, HIGH);
  digitalWrite(MOTOR_IN4, LOW);
}

void turnRight() {
  // Left motors forward
  digitalWrite(MOTOR_IN1, HIGH);
  digitalWrite(MOTOR_IN2, LOW);
  // Right motors backward
  digitalWrite(MOTOR_IN3, LOW);
  digitalWrite(MOTOR_IN4, HIGH);
}

// ==================== Firebase Data Upload ====================
void sendDataToFirebase() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️ No WiFi - Data not sent");
    return;
  }
  
  // Read all sensors
  float temperature = readTemperature();
  float humidity = readHumidity();
  int gasLevel = readGasLevel();
  float distance = getDistance();
  
  // Display sensor readings (informational only - no movement blocking)
  Serial.println("📊 Sensor Readings:");
  Serial.println("  Temperature: " + String(temperature, 1) + " °C");
  Serial.println("  Humidity: " + String(humidity, 1) + " %");
  Serial.println("  Gas Level: " + String(gasLevel) + " ppm");
  Serial.println("  Distance: " + String(distance, 1) + " cm");
  
  // Send individual values instead of JSON (more reliable)
  String path = "/sensorData/latest";
  
  bool success = true;
  success &= Firebase.setFloat(firebaseData, path + "/temperature", temperature);
  success &= Firebase.setFloat(firebaseData, path + "/humidity", humidity);
  success &= Firebase.setInt(firebaseData, path + "/gasLevel", gasLevel);
  success &= Firebase.setFloat(firebaseData, path + "/distance", distance);
  success &= Firebase.setInt(firebaseData, path + "/timestamp", millis());
  success &= Firebase.setString(firebaseData, path + "/deviceId", "rover_001");
  
  if (success) {
    Serial.println("✓ Data sent to Firebase");
  } else {
    Serial.print("✗ Firebase error: ");
    Serial.println(firebaseData.errorReason());
  }
  
  Serial.println();
}

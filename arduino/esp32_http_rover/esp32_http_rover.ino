/**
 * Smart Tunnel Inspection Rover - ESP32 HTTP Mode
 * Civil Engineering Department - 2025
 * 
 * Features:
 * - Autonomous movement (2s forward, 10s scan, 0.5s turn right, repeat)
 * - HTTP POST to local server (no Firebase needed)
 * - DHT22, MQ-2, HC-SR04 sensors
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
// Change this to your computer's IP address (run 'ipconfig' to find it)
const char* SERVER_URL = "http://10.33.64.133:5000/api/sensor-data";
// Alternative: Use your actual IP like "http://10.33.64.133:5000/api/sensor-data"

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
void setupMotors();
float getDistance();
float readTemperature();
float readHumidity();
int readGasLevel();
void stopMotors();
void moveForward();
void turnRight();
void sendDataToServer();

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
          sendDataToServer();
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
      Serial.print("Server: ");
      Serial.println(SERVER_URL);
      break;
    } else {
      Serial.println("\n✗ Failed");
    }
  }
  
  if (!connected) {
    Serial.println("⚠️ No WiFi - Running offline");
  }
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
    return 999; // No obstacle
  }
  
  float distance = duration * 0.034 / 2;
  return distance;
}

// ==================== DHT22 Sensors ====================
float readTemperature() {
  float temp = dht.readTemperature();
  if (isnan(temp)) {
    return 25.0;
  }
  return temp;
}

float readHumidity() {
  float hum = dht.readHumidity();
  if (isnan(hum)) {
    return 60.0;
  }
  return hum;
}

// ==================== MQ-2 Gas Sensor ====================
int readGasLevel() {
  int rawValue = analogRead(MQ2_PIN);
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
  digitalWrite(MOTOR_IN1, HIGH);
  digitalWrite(MOTOR_IN2, LOW);
  digitalWrite(MOTOR_IN3, LOW);
  digitalWrite(MOTOR_IN4, HIGH);
}

// ==================== HTTP Data Upload ====================
void sendDataToServer() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️ No WiFi - Data not sent");
    return;
  }
  
  // Read all sensors
  float temperature = readTemperature();
  float humidity = readHumidity();
  int gasLevel = readGasLevel();
  float distance = getDistance();
  
  // Display readings
  Serial.println("📊 Sensor Data:");
  Serial.println("  Temp: " + String(temperature, 1) + "°C");
  Serial.println("  Humidity: " + String(humidity, 1) + "%");
  Serial.println("  Gas: " + String(gasLevel) + " ppm");
  Serial.println("  Distance: " + String(distance, 1) + " cm");
  
  // Create HTTP client
  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  
  // Create JSON payload
  String jsonData = "{";
  jsonData += "\"temperature\":" + String(temperature, 1) + ",";
  jsonData += "\"humidity\":" + String(humidity, 1) + ",";
  jsonData += "\"gasLevel\":" + String(gasLevel) + ",";
  jsonData += "\"distance\":" + String(distance, 1) + ",";
  jsonData += "\"deviceId\":\"rover_001\",";
  jsonData += "\"timestamp\":" + String(millis());
  jsonData += "}";
  
  // Send POST request
  int httpCode = http.POST(jsonData);
  
  if (httpCode > 0) {
    if (httpCode == 200 || httpCode == 201) {
      Serial.println("✓ Data sent to server");
    } else {
      Serial.println("⚠️ Server responded: " + String(httpCode));
    }
  } else {
    Serial.println("✗ Connection failed: " + http.errorToString(httpCode));
  }
  
  http.end();
  Serial.println();
}

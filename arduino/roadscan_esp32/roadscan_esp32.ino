/**

 * RoadScan ESP32 - Autonomous Circular Movement#include <WiFi.h>

 * Hardware: ESP32, DHT22, HC-SR04 Ultrasonic, L298N Motor Driver#include <HTTPClient.h>

 * Movement: Autonomous circular pattern (1m radius)#include <ArduinoJson.h>

 */#include <DHT.h>

#include <ESP32Servo.h>

#include <WiFi.h>

#include <HTTPClient.h>// ==================== WiFi Configuration ====================

#include <ArduinoJson.h>const char* ssid = "YOUR_WIFI_SSID";           // Replace with your WiFi SSID

#include <DHT.h>const char* password = "YOUR_WIFI_PASSWORD";   // Replace with your WiFi password

const char* serverUrl = "http://YOUR_SERVER_IP:5000/api/sensor-data"; // Replace with your backend URL

// ==================== WiFi Configuration ====================

const char* ssid = "YOUR_WIFI_SSID";           // Change this// ==================== Pin Definitions ====================

const char* password = "YOUR_WIFI_PASSWORD";   // Change this// Motor Control Pins (L298N)

const char* serverUrl = "http://192.168.1.100:5000/api/sensor-data"; // Change to your computer's IP#define MOTOR_LEFT_IN1    18

#define MOTOR_LEFT_IN2    5

// ==================== Pin Definitions ====================#define MOTOR_RIGHT_IN3   17

// DHT22 Sensor#define MOTOR_RIGHT_IN4   16

#define DHT_PIN 4#define MOTOR_ENA         21  // Left motor speed (PWM)

#define DHT_TYPE DHT22#define MOTOR_ENB         19  // Right motor speed (PWM)



// Ultrasonic Sensor (HC-SR04)// Sensor Pins

#define TRIG_PIN 5#define DHT_PIN           4   // DHT22 data pin

#define ECHO_PIN 18#define ULTRASONIC_TRIG   26  // HC-SR04 trigger

#define ULTRASONIC_ECHO   25  // HC-SR04 echo

// L298N Motor Driver#define SERVO_PIN         27  // SG90 servo

#define MOTOR_LEFT_FWD 19#define IR_SENSOR_PIN     32  // IR pothole sensor (Digital Out)

#define MOTOR_LEFT_BWD 21

#define MOTOR_RIGHT_FWD 22// ==================== Sensor Objects ====================

#define MOTOR_RIGHT_BWD 23#define DHT_TYPE DHT22

DHT dht(DHT_PIN, DHT_TYPE);

// PWM Channels (ESP32 uses PWM channels instead of analogWrite)Servo scannerServo;

#define PWM_FREQ 1000

#define PWM_RESOLUTION 8// ==================== Global Variables ====================

#define PWM_CHANNEL_LEFT 0// Motor speed (0-255)

#define PWM_CHANNEL_RIGHT 1const int NORMAL_SPEED = 180;

const int TURN_SPEED = 150;

// ==================== Movement Parameters ====================

const int NORMAL_SPEED = 180;        // Normal driving speed (0-255)// Obstacle detection threshold (cm)

const int TURN_SPEED = 150;          // Speed while turningconst int OBSTACLE_THRESHOLD = 20;

const int CIRCLE_RADIUS = 100;       // 100cm = 1 meter radius

const int SAFE_DISTANCE = 30;        // Stop if obstacle within 30cm// Timing variables

unsigned long lastDataSend = 0;

// Timing for circular movement (adjust based on your car)const unsigned long SEND_INTERVAL = 2000;  // Send data every 2 seconds

const unsigned long FORWARD_TIME = 2000;   // Move forward for 2 seconds

const unsigned long TURN_TIME = 500;       // Turn for 0.5 seconds (adjust for circle)unsigned long lastSensorRead = 0;

const unsigned long SENSOR_INTERVAL = 500; // Read sensors every 500ms

// ==================== Global Variables ====================

DHT dht(DHT_PIN, DHT_TYPE);// Vehicle state

unsigned long lastSendTime = 0;enum VehicleState {

unsigned long lastMoveTime = 0;  PATROL,

const unsigned long SEND_INTERVAL = 2000;  // Send data every 2 seconds  AVOIDING,

  STOPPED

enum MovementState {};

  MOVING_FORWARD,VehicleState currentState = PATROL;

  TURNING_RIGHT,

  STOPPED// Sensor data

};float temperature = 0;

float humidity = 0;

MovementState currentState = STOPPED;int distanceCM = 0;

bool potholeDetected = false;

// ==================== Setup ====================String vehicleStatus = "Initializing";

void setup() {

  Serial.begin(115200);// Hazard counters for unique IDs

  delay(1000);int potholeCount = 0;

  int obstacleCount = 0;

  Serial.println("\n=================================");

  Serial.println("RoadScan ESP32 Initializing...");// ==================== Setup Function ====================

  Serial.println("=================================");void setup() {

    Serial.begin(115200);

  // Initialize DHT22  Serial.println("\n\n=== RoadScan ESP32 Starting ===");

  dht.begin();  

  Serial.println("✓ DHT22 initialized");  // Initialize motor pins

    pinMode(MOTOR_LEFT_IN1, OUTPUT);

  // Initialize Ultrasonic pins  pinMode(MOTOR_LEFT_IN2, OUTPUT);

  pinMode(TRIG_PIN, OUTPUT);  pinMode(MOTOR_RIGHT_IN3, OUTPUT);

  pinMode(ECHO_PIN, INPUT);  pinMode(MOTOR_RIGHT_IN4, OUTPUT);

  Serial.println("✓ Ultrasonic sensor initialized");  pinMode(MOTOR_ENA, OUTPUT);

    pinMode(MOTOR_ENB, OUTPUT);

  // Initialize Motor pins  

  pinMode(MOTOR_LEFT_FWD, OUTPUT);  // Initialize sensor pins

  pinMode(MOTOR_LEFT_BWD, OUTPUT);  pinMode(ULTRASONIC_TRIG, OUTPUT);

  pinMode(MOTOR_RIGHT_FWD, OUTPUT);  pinMode(ULTRASONIC_ECHO, INPUT);

  pinMode(MOTOR_RIGHT_BWD, OUTPUT);  pinMode(IR_SENSOR_PIN, INPUT);

    

  // Setup PWM channels for motor speed control  // Initialize DHT sensor

  ledcSetup(PWM_CHANNEL_LEFT, PWM_FREQ, PWM_RESOLUTION);  dht.begin();

  ledcSetup(PWM_CHANNEL_RIGHT, PWM_FREQ, PWM_RESOLUTION);  

  ledcAttachPin(MOTOR_LEFT_FWD, PWM_CHANNEL_LEFT);  // Initialize servo

  ledcAttachPin(MOTOR_RIGHT_FWD, PWM_CHANNEL_RIGHT);  scannerServo.attach(SERVO_PIN);

    scannerServo.write(90); // Center position

  Serial.println("✓ Motors initialized");  delay(500);

    

  // Stop motors initially  // Stop motors initially

  stopMotors();  stopMotors();

    

  // Connect to WiFi  // Connect to WiFi

  connectWiFi();  connectToWiFi();

    

  Serial.println("=================================");  Serial.println("=== Setup Complete ===\n");

  Serial.println("Setup complete! Starting loop...");  vehicleStatus = "Ready";

  Serial.println("=================================\n");  delay(1000);

  }

  delay(2000);

  currentState = MOVING_FORWARD;// ==================== Main Loop ====================

  lastMoveTime = millis();void loop() {

}  // Check WiFi connection

  if (WiFi.status() != WL_CONNECTED) {

// ==================== Main Loop ====================    vehicleStatus = "WiFi Disconnected";

void loop() {    stopMotors();

  // Read sensors    connectToWiFi();

  float temperature = dht.readTemperature();    return;

  float humidity = dht.readHumidity();  }

  int distance = readUltrasonic();  

    // Read sensors periodically

  // Check for obstacles  if (millis() - lastSensorRead >= SENSOR_INTERVAL) {

  if (distance > 0 && distance < SAFE_DISTANCE) {    readSensors();

    stopMotors();    lastSensorRead = millis();

    currentState = STOPPED;  }

    Serial.println("⚠️ OBSTACLE DETECTED! Stopping...");  

    delay(1000);  // Autonomous navigation logic

      autonomousNavigation();

    // Back up a bit  

    moveBackward(NORMAL_SPEED);  // Send data to server periodically

    delay(500);  if (millis() - lastDataSend >= SEND_INTERVAL) {

    stopMotors();    sendDataToServer();

        lastDataSend = millis();

    // Turn to avoid  }

    turnRight(TURN_SPEED);  

    delay(1000);  delay(50); // Small delay for stability

    stopMotors();}

    

    // Resume circular movement// ==================== WiFi Functions ====================

    currentState = MOVING_FORWARD;void connectToWiFi() {

    lastMoveTime = millis();  Serial.print("Connecting to WiFi: ");

  } else {  Serial.println(ssid);

    // Execute autonomous circular movement pattern  

    autonomousCircularMovement();  WiFi.begin(ssid, password);

  }  

    int attempts = 0;

  // Send data to server periodically  while (WiFi.status() != WL_CONNECTED && attempts < 20) {

  if (millis() - lastSendTime >= SEND_INTERVAL) {    delay(500);

    sendDataToServer(temperature, humidity, distance);    Serial.print(".");

    lastSendTime = millis();    attempts++;

  }  }

    

  delay(100);  if (WiFi.status() == WL_CONNECTED) {

}    Serial.println("\n✓ WiFi Connected!");

    Serial.print("IP Address: ");

// ==================== Autonomous Circular Movement ====================    Serial.println(WiFi.localIP());

void autonomousCircularMovement() {  } else {

  unsigned long currentTime = millis();    Serial.println("\n✗ WiFi Connection Failed!");

  unsigned long elapsed = currentTime - lastMoveTime;  }

  }

  switch (currentState) {

    case MOVING_FORWARD:// ==================== Sensor Functions ====================

      moveForward(NORMAL_SPEED);void readSensors() {

      if (elapsed >= FORWARD_TIME) {  // Read DHT22 (temperature & humidity)

        currentState = TURNING_RIGHT;  float h = dht.readHumidity();

        lastMoveTime = currentTime;  float t = dht.readTemperature();

      }  

      break;  if (!isnan(h) && !isnan(t)) {

          humidity = h;

    case TURNING_RIGHT:    temperature = t;

      // Gradual turn to create circular path  }

      turnRightGradual(NORMAL_SPEED, TURN_SPEED);  

      if (elapsed >= TURN_TIME) {  // Read ultrasonic sensor

        currentState = MOVING_FORWARD;  distanceCM = getDistance();

        lastMoveTime = currentTime;  

      }  // Read IR sensor (pothole detection)

      break;  // LOW = pothole detected (black surface/hole absorbs IR)

        // HIGH = normal road surface

    case STOPPED:  int irReading = digitalRead(IR_SENSOR_PIN);

      stopMotors();  

      break;  if (irReading == LOW && !potholeDetected) {

  }    potholeDetected = true;

}    potholeCount++;

    Serial.println("🕳️  POTHOLE DETECTED!");

// ==================== Motor Control Functions ====================  } else if (irReading == HIGH) {

void moveForward(int speed) {    potholeDetected = false;

  ledcWrite(PWM_CHANNEL_LEFT, speed);  }

  ledcWrite(PWM_CHANNEL_RIGHT, speed);}

  digitalWrite(MOTOR_LEFT_BWD, LOW);

  digitalWrite(MOTOR_RIGHT_BWD, LOW);int getDistance() {

}  // Send ultrasonic pulse

  digitalWrite(ULTRASONIC_TRIG, LOW);

void moveBackward(int speed) {  delayMicroseconds(2);

  digitalWrite(MOTOR_LEFT_FWD, LOW);  digitalWrite(ULTRASONIC_TRIG, HIGH);

  digitalWrite(MOTOR_RIGHT_FWD, LOW);  delayMicroseconds(10);

  ledcWrite(PWM_CHANNEL_LEFT, 0);  digitalWrite(ULTRASONIC_TRIG, LOW);

  ledcWrite(PWM_CHANNEL_RIGHT, 0);  

  digitalWrite(MOTOR_LEFT_BWD, HIGH);  // Read echo

  digitalWrite(MOTOR_RIGHT_BWD, HIGH);  long duration = pulseIn(ULTRASONIC_ECHO, HIGH, 30000); // 30ms timeout

}  

  // Calculate distance (cm)

void turnRight(int speed) {  int distance = duration * 0.034 / 2;

  // Right motor backward, left motor forward  

  ledcWrite(PWM_CHANNEL_LEFT, speed);  // Validate reading

  digitalWrite(MOTOR_LEFT_BWD, LOW);  if (distance == 0 || distance > 400) {

  digitalWrite(MOTOR_RIGHT_FWD, LOW);    return 400; // Max range

  ledcWrite(PWM_CHANNEL_RIGHT, speed);  }

  digitalWrite(MOTOR_RIGHT_BWD, HIGH);  

}  return distance;

}

void turnRightGradual(int leftSpeed, int rightSpeed) {

  // Left motor faster, right motor slower for gradual turn// ==================== Autonomous Navigation ====================

  ledcWrite(PWM_CHANNEL_LEFT, leftSpeed);void autonomousNavigation() {

  ledcWrite(PWM_CHANNEL_RIGHT, rightSpeed);  switch (currentState) {

  digitalWrite(MOTOR_LEFT_BWD, LOW);    case PATROL:

  digitalWrite(MOTOR_RIGHT_BWD, LOW);      // Normal forward movement

}      if (distanceCM < OBSTACLE_THRESHOLD) {

        // Obstacle detected!

void stopMotors() {        currentState = AVOIDING;

  ledcWrite(PWM_CHANNEL_LEFT, 0);        vehicleStatus = "Obstacle Detected";

  ledcWrite(PWM_CHANNEL_RIGHT, 0);        obstacleCount++;

  digitalWrite(MOTOR_LEFT_FWD, LOW);        Serial.println("🚧 OBSTACLE AHEAD!");

  digitalWrite(MOTOR_LEFT_BWD, LOW);      } else {

  digitalWrite(MOTOR_RIGHT_FWD, LOW);        vehicleStatus = "Patrolling";

  digitalWrite(MOTOR_RIGHT_BWD, LOW);        moveForward(NORMAL_SPEED);

}      }

      break;

// ==================== Ultrasonic Sensor ====================      

int readUltrasonic() {    case AVOIDING:

  digitalWrite(TRIG_PIN, LOW);      // Stop and scan for clear path

  delayMicroseconds(2);      stopMotors();

  digitalWrite(TRIG_PIN, HIGH);      delay(300);

  delayMicroseconds(10);      

  digitalWrite(TRIG_PIN, LOW);      // Scan left and right

        int leftDistance = scanDirection(45);   // Look left

  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // Timeout after 30ms      delay(300);

        int rightDistance = scanDirection(135); // Look right

  if (duration == 0) {      delay(300);

    return -1; // No echo received      scannerServo.write(90); // Return to center

  }      

        Serial.print("Left: ");

  int distance = duration * 0.034 / 2; // Convert to cm      Serial.print(leftDistance);

  return distance;      Serial.print(" cm | Right: ");

}      Serial.print(rightDistance);

      Serial.println(" cm");

// ==================== WiFi Connection ====================      

void connectWiFi() {      // Choose direction

  Serial.print("Connecting to WiFi");      if (leftDistance > rightDistance && leftDistance > OBSTACLE_THRESHOLD) {

  WiFi.begin(ssid, password);        Serial.println("↶ Turning LEFT");

          turnLeft(TURN_SPEED);

  int attempts = 0;        delay(600);

  while (WiFi.status() != WL_CONNECTED && attempts < 20) {      } else if (rightDistance > OBSTACLE_THRESHOLD) {

    delay(500);        Serial.println("↷ Turning RIGHT");

    Serial.print(".");        turnRight(TURN_SPEED);

    attempts++;        delay(600);

  }      } else {

          // Both blocked - reverse

  if (WiFi.status() == WL_CONNECTED) {        Serial.println("↓ REVERSING");

    Serial.println("\n✓ WiFi connected!");        moveBackward(TURN_SPEED);

    Serial.print("IP Address: ");        delay(500);

    Serial.println(WiFi.localIP());        turnRight(TURN_SPEED);

  } else {        delay(800);

    Serial.println("\n✗ WiFi connection failed!");      }

    Serial.println("Continuing without WiFi...");      

  }      stopMotors();

}      currentState = PATROL;

      break;

// ==================== Send Data to Server ====================      

void sendDataToServer(float temp, float hum, int dist) {    case STOPPED:

  if (WiFi.status() != WL_CONNECTED) {      stopMotors();

    Serial.println("✗ WiFi not connected, skipping send");      vehicleStatus = "Stopped";

    return;      break;

  }  }

  }

  if (isnan(temp) || isnan(hum)) {

    Serial.println("✗ Invalid sensor readings");int scanDirection(int angle) {

    return;  scannerServo.write(angle);

  }  delay(400); // Wait for servo to move

    int dist = getDistance();

  HTTPClient http;  return dist;

  http.begin(serverUrl);}

  http.addHeader("Content-Type", "application/json");

  // ==================== Motor Control Functions ====================

  // Create JSON payloadvoid moveForward(int speed) {

  StaticJsonDocument<256> doc;  analogWrite(MOTOR_ENA, speed);

  doc["temperature"] = temp;  analogWrite(MOTOR_ENB, speed);

  doc["humidity"] = hum;  

  doc["distance"] = dist;  digitalWrite(MOTOR_LEFT_IN1, HIGH);

  doc["timestamp"] = millis();  digitalWrite(MOTOR_LEFT_IN2, LOW);

    digitalWrite(MOTOR_RIGHT_IN3, HIGH);

  String jsonString;  digitalWrite(MOTOR_RIGHT_IN4, LOW);

  serializeJson(doc, jsonString);}

  

  // Send POST requestvoid moveBackward(int speed) {

  int httpResponseCode = http.POST(jsonString);  analogWrite(MOTOR_ENA, speed);

    analogWrite(MOTOR_ENB, speed);

  if (httpResponseCode > 0) {  

    Serial.printf("✓ Data sent | Temp: %.1f°C | Hum: %.1f%% | Dist: %dcm | Response: %d\n",   digitalWrite(MOTOR_LEFT_IN1, LOW);

                  temp, hum, dist, httpResponseCode);  digitalWrite(MOTOR_LEFT_IN2, HIGH);

  } else {  digitalWrite(MOTOR_RIGHT_IN3, LOW);

    Serial.printf("✗ Send failed: %s\n", http.errorToString(httpResponseCode).c_str());  digitalWrite(MOTOR_RIGHT_IN4, HIGH);

  }}

  

  http.end();void turnLeft(int speed) {

}  analogWrite(MOTOR_ENA, speed);

  analogWrite(MOTOR_ENB, speed);
  
  // Left motors backward, right motors forward
  digitalWrite(MOTOR_LEFT_IN1, LOW);
  digitalWrite(MOTOR_LEFT_IN2, HIGH);
  digitalWrite(MOTOR_RIGHT_IN3, HIGH);
  digitalWrite(MOTOR_RIGHT_IN4, LOW);
}

void turnRight(int speed) {
  analogWrite(MOTOR_ENA, speed);
  analogWrite(MOTOR_ENB, speed);
  
  // Left motors forward, right motors backward
  digitalWrite(MOTOR_LEFT_IN1, HIGH);
  digitalWrite(MOTOR_LEFT_IN2, LOW);
  digitalWrite(MOTOR_RIGHT_IN3, LOW);
  digitalWrite(MOTOR_RIGHT_IN4, HIGH);
}

void stopMotors() {
  analogWrite(MOTOR_ENA, 0);
  analogWrite(MOTOR_ENB, 0);
  
  digitalWrite(MOTOR_LEFT_IN1, LOW);
  digitalWrite(MOTOR_LEFT_IN2, LOW);
  digitalWrite(MOTOR_RIGHT_IN3, LOW);
  digitalWrite(MOTOR_RIGHT_IN4, LOW);
}

// ==================== Data Transmission ====================
void sendDataToServer() {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }
  
  HTTPClient http;
  
  // Create JSON payload
  StaticJsonDocument<512> doc;
  doc["deviceId"] = "ESP32_RoadScan_001";
  doc["timestamp"] = millis();
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["distance"] = distanceCM;
  doc["potholeDetected"] = potholeDetected;
  doc["vehicleStatus"] = vehicleStatus;
  
  // Add hazard data
  JsonObject hazards = doc.createNestedObject("hazards");
  hazards["potholeCount"] = potholeCount;
  hazards["obstacleCount"] = obstacleCount;
  
  // Serialize JSON
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  // Send HTTP POST request
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.POST(jsonPayload);
  
  if (httpResponseCode > 0) {
    Serial.print("✓ Data sent | Response: ");
    Serial.println(httpResponseCode);
    
    if (httpResponseCode == 200 || httpResponseCode == 201) {
      String response = http.getString();
      Serial.println("Server response: " + response);
    }
  } else {
    Serial.print("✗ Error sending data: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
  
  // Print sensor data to serial
  Serial.println("--- Sensor Data ---");
  Serial.print("Temp: "); Serial.print(temperature); Serial.println(" °C");
  Serial.print("Humidity: "); Serial.print(humidity); Serial.println(" %");
  Serial.print("Distance: "); Serial.print(distanceCM); Serial.println(" cm");
  Serial.print("Pothole: "); Serial.println(potholeDetected ? "YES" : "NO");
  Serial.print("Status: "); Serial.println(vehicleStatus);
  Serial.println("-------------------\n");
}

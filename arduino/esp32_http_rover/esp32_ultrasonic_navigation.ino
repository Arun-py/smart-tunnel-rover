/**
 * Smart Tunnel Inspection Rover - Ultrasonic Navigation Only
 * Civil Engineering Department - 2025
 * 
 * Features:
 * - Pure ultrasonic-based navigation (NO WiFi, NO data transmission)
 * - L298N motor driver control
 * - 1 meter forward, then turn right logic
 */

#include <Arduino.h>

// ==================== Pin Definitions ====================
// L298N Motor Driver Pins
#define MOTOR_IN1 27    // Left motor forward
#define MOTOR_IN2 26    // Left motor backward
#define MOTOR_IN3 12    // Right motor forward
#define MOTOR_IN4 14    // Right motor backward

// HC-SR04 Ultrasonic Sensor
#define TRIG_PIN 13     // Ultrasonic trigger
#define ECHO_PIN 32     // Ultrasonic echo

// ==================== Navigation Constants ====================
#define OBSTACLE_DISTANCE 30   // Stop and turn if obstacle within 30cm
#define FORWARD_TIME 5000      // Move forward for 5 seconds (~1 meter)
#define TURN_TIME 800          // Turn right for 800ms

// ==================== Global Variables ====================
unsigned long forwardStartTime = 0;
bool isMovingForward = false;

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

// ==================== Setup ====================
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n╔════════════════════════════════════════╗");
  Serial.println("║   Smart Tunnel Inspection Rover v5.0  ║");
  Serial.println("║   Civil Engineering Department - 2025  ║");
  Serial.println("║   OFFLINE Navigation Mode (No WiFi)    ║");
  Serial.println("╚════════════════════════════════════════╝\n");

  // Initialize hardware
  Serial.println("🔧 Initializing hardware...");
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.println("✅ Ultrasonic sensor initialized");
  
  setupMotors();
  
  Serial.println("\n╔════════════════════════════════════════╗");
  Serial.println("║        🚀 ROVER READY - AUTO MODE      ║");
  Serial.println("╚════════════════════════════════════════╝\n");
  Serial.println("Navigation Logic:");
  Serial.println("  ➡️  Move forward ~1 meter (5 seconds)");
  Serial.println("  🚧 If obstacle < 30cm → TURN RIGHT");
  Serial.println("  ↩️  After 1m forward → TURN RIGHT");
  Serial.println("  🔁 REPEAT\n");
  
  delay(2000);
  
  // Start first forward movement
  isMovingForward = true;
  forwardStartTime = millis();
  moveForward();
  Serial.println("🚗 Starting forward movement...");
}

// ==================== Main Loop ====================
void loop() {
  unsigned long currentMillis = millis();
  
  // Check for obstacles
  float distance = getDistance();
  
  if (isMovingForward) {
    // Check if obstacle detected (ignore 0.0 readings - sensor error)
    if (distance > 0 && distance < OBSTACLE_DISTANCE) {
      Serial.printf("🚧 OBSTACLE at %.1f cm! Turning right...\n", distance);
      stopMotors();
      delay(300);
      turnRight();
      delay(TURN_TIME);
      stopMotors();
      delay(500);
      
      // Start new forward cycle
      isMovingForward = true;
      forwardStartTime = millis();
      moveForward();
      Serial.println("🚗 Continuing forward...");
    }
    // Check if 1 meter (~5 seconds) reached
    else if (currentMillis - forwardStartTime >= FORWARD_TIME) {
      Serial.println("✅ 1 meter completed! Turning right...");
      stopMotors();
      delay(300);
      turnRight();
      delay(TURN_TIME);
      stopMotors();
      delay(500);
      
      // Start new forward cycle
      isMovingForward = true;
      forwardStartTime = millis();
      moveForward();
      Serial.println("🚗 New cycle - moving forward...");
    }
    else {
      // Continue forward, print distance (only if valid reading)
      if (distance > 0 && distance < 400) {
        Serial.printf("📏 Distance: %.1f cm | ⏱️  Time: %lu ms\r", 
                      distance, currentMillis - forwardStartTime);
      }
    }
  }
  
  delay(100);  // Stability delay
}

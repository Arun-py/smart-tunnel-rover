/**
 * Arduino UNO - RC Rover Motor Control & Ultrasonic Sensor
 * Smart Tunnel and Parking Safety Inspection Rover
 * 
 * Hardware:
 * - Arduino UNO
 * - L298N Motor Driver
 * - HC-SR04 Ultrasonic Sensor
 * - 4 DC Motors
 * - RC Receiver (6 channel)
 * 
 * Connections:
 * L298N Motor Driver:
 *   - ENA -> Pin 5 (PWM)
 *   - IN1 -> Pin 2
 *   - IN2 -> Pin 3
 *   - ENB -> Pin 6 (PWM)
 *   - IN3 -> Pin 4
 *   - IN4 -> Pin 7
 * 
 * HC-SR04 Ultrasonic:
 *   - TRIG -> Pin 9
 *   - ECHO -> Pin 10
 * 
 * RC Receiver:
 *   - CH1 (Steering) -> Pin 11
 *   - CH2 (Throttle) -> Pin 12
 */

// Motor Driver Pins
#define ENA 5
#define IN1 2
#define IN2 3
#define ENB 6
#define IN3 4
#define IN4 7

// Ultrasonic Sensor Pins
#define TRIG_PIN 9
#define ECHO_PIN 10

// RC Receiver Pins
#define RC_CH1 11  // Steering
#define RC_CH2 12  // Throttle

// Motor Speed
int motorSpeed = 0;
int turnSpeed = 0;

// Ultrasonic Distance
long duration;
int distance = 0;

// RC Values
int ch1Value = 0;  // Steering
int ch2Value = 0;  // Throttle

void setup() {
  Serial.begin(9600);
  
  // Motor Driver Setup
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  
  // Ultrasonic Setup
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  // RC Receiver Setup
  pinMode(RC_CH1, INPUT);
  pinMode(RC_CH2, INPUT);
  
  // Stop motors initially
  stopMotors();
  
  Serial.println("RC Rover Initialized");
  Serial.println("Waiting for RC signal...");
}

void loop() {
  // Read RC channels
  ch1Value = pulseIn(RC_CH1, HIGH, 25000);  // Steering
  ch2Value = pulseIn(RC_CH2, HIGH, 25000);  // Throttle
  
  // Read ultrasonic distance
  distance = getDistance();
  
  // Control motors based on RC input
  if (ch1Value > 0 && ch2Value > 0) {
    // Map RC values to motor speed (-255 to 255)
    motorSpeed = map(ch2Value, 1000, 2000, -255, 255);
    turnSpeed = map(ch1Value, 1000, 2000, -255, 255);
    
    // Apply deadzone
    if (abs(motorSpeed) < 20) motorSpeed = 0;
    if (abs(turnSpeed) < 20) turnSpeed = 0;
    
    // Obstacle detection - stop if too close
    if (distance < 20 && motorSpeed > 0) {
      stopMotors();
      Serial.println("OBSTACLE DETECTED! Stopped.");
    } else {
      controlMotors(motorSpeed, turnSpeed);
    }
  } else {
    stopMotors();
  }
  
  // Send data to ESP32 via Serial
  sendDataToESP32();
  
  delay(100);
}

// Get distance from ultrasonic sensor
int getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  duration = pulseIn(ECHO_PIN, HIGH);
  int dist = duration * 0.034 / 2;  // Convert to cm
  
  return (dist > 0 && dist < 400) ? dist : 400;  // Max 400cm
}

// Control motors based on speed and turn
void controlMotors(int speed, int turn) {
  int leftSpeed = constrain(speed + turn, -255, 255);
  int rightSpeed = constrain(speed - turn, -255, 255);
  
  // Left Motors
  if (leftSpeed > 0) {
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    analogWrite(ENA, abs(leftSpeed));
  } else if (leftSpeed < 0) {
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    analogWrite(ENA, abs(leftSpeed));
  } else {
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
    analogWrite(ENA, 0);
  }
  
  // Right Motors
  if (rightSpeed > 0) {
    digitalWrite(IN3, HIGH);
    digitalWrite(IN4, LOW);
    analogWrite(ENB, abs(rightSpeed));
  } else if (rightSpeed < 0) {
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, HIGH);
    analogWrite(ENB, abs(rightSpeed));
  } else {
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, LOW);
    analogWrite(ENB, 0);
  }
}

// Stop all motors
void stopMotors() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, 0);
  analogWrite(ENB, 0);
}

// Send data to ESP32 via Serial
void sendDataToESP32() {
  // Format: DISTANCE:xxx
  Serial.print("DISTANCE:");
  Serial.println(distance);
}

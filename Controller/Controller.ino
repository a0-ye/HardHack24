#include <Adafruit_MPU6050.h>

Adafruit_MPU6050 mpu;
Adafruit_Sensor *mpu_accel;

enum sensorCodesEnum { 
  JOY1,
  JOY2,
  KNOB1,
  KNOB2,
  KNOB3,
  KNOB4,
  TEMP,
  PEDAL,
  IMU,
  SENSORS_SIZE 
};

enum pinCode { 
  PIN_J1X = A0,
  PIN_J1Y = A1,
  PIN_J2X = A2,
  PIN_J2Y = A3 ,
  PIN_K1CLK = 2,
  PIN_K1DT = 3,
  PIN_K2CLK = 4,
  PIN_K2DT = 5,
  PIN_K3CLK = 6,
  PIN_K3DT = 7,
  PIN_K4CLK = 8,
  PIN_K4DT = 9,
  PIN_TEMP = A4,
  PIN_PEDAL = A5
};

enum commandsEnum {
  KNOB,
  COMMANDS_SIZE
};

struct KnobDat{
  int counter = 0;
  int direction = 0;
  int CLK_state;
  int prev_CLK_state;

  int CLK_pin;
  int DT_pin;

  KnobDat(int CLK_pin_, int DT_pin_) : CLK_pin{CLK_pin_}, DT_pin{DT_pin_}{

  }

  void hanldeKnob(){
    this->CLK_state = digitalRead(this->CLK_pin);

    if(this->CLK_state != this->prev_CLK_state && this->CLK_state == HIGH){
      if(digitalRead(this->DT_pin) == HIGH){
        counter--;
        direction = 1;

      } else{
        counter++;
        direction = 0;
      }
    }
    this->prev_CLK_state = this->CLK_state;

    Serial.print(counter);
    Serial.print(',');
  }
};

bool active[SENSORS_SIZE] = {true};

KnobDat knob1(PIN_K1CLK, PIN_K1DT);
KnobDat knob2(PIN_K2CLK, PIN_K2DT);
KnobDat knob3(PIN_K3CLK, PIN_K3DT);
KnobDat knob4(PIN_K4CLK, PIN_K4DT);

void setup() {
  Serial.begin(115200);
  while (!Serial)
  delay(10); // will pause Zero, Leonardo, etc until serial console opens


  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");

    while (1) {
      delay(10);
    }
  }
  mpu_accel = mpu.getAccelerometerSensor();
}

void loop() {
  loadSensorData();
  Serial.println();
}

void loadSensorData() {
  for (short i = 0; i < SENSORS_SIZE; i++){
    //CHANGE FOR SENSOR TOGGLE
    active[i] = true;
    if (active[i]){
      handleSensor(i);
    }
  }
}

void handleSensor(short code) {
  switch (code) {
    case JOY1:
      handleJoystick1();
      break;

    case JOY2:
      handleJoystick2();
      break;

    case KNOB1:
      knob1.hanldeKnob();
      break;

    case KNOB2:
      knob2.hanldeKnob();
      break;

    case KNOB3:
      knob3.hanldeKnob();
      break;

    case KNOB4:
      knob4.hanldeKnob();
      break;

    case TEMP:
      handleTemp();
      break;

    case PEDAL:
      handlePedal();
      break;

    case IMU:
      handleIMU();
      break;

  }
}

void handleJoystick1() {
  
  Serial.print(analogRead(PIN_J1X));
  Serial.print(',');
  Serial.print(analogRead(PIN_J1Y));
  Serial.print(',');
}

void handleJoystick2() {
  Serial.print(analogRead(PIN_J2X));
  Serial.print(',');
  Serial.print(analogRead(PIN_J2Y));
  Serial.print(',');
}

void handleTemp(){
  int currTemp = analogRead(PIN_TEMP);

  double r2 = (currTemp * 100000) / (1024 - currTemp);
  r2 /= 1000;
  double temp = 0.0018 * pow(r2, 2) + -0.6001 * r2 + 66.5213;

  Serial.print(temp);
  Serial.print(',');
}

void handlePedal(){
  Serial.print(analogRead(PIN_PEDAL));
  Serial.print(',');
}

void handleIMU(){
  sensors_event_t accel;
  mpu_accel->getEvent(&accel);

  Serial.print(accel.acceleration.x);
  Serial.print(',');
  Serial.print(accel.acceleration.y);
  Serial.print(',');
}


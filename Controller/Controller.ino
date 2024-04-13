enum sensorCodesEnum { JOY1,
                       JOY2,
                       KNOB1,
                       KNOB2,
                       KNOB3,
                       KNOB4,
                       SENSORS_SIZE };

// I KNOW I COULD DO NO '=' BUT I DONT CARE 
enum pinCode { PIN_J1X = A0,
               PIN_J1Y = A1,
               PIN_J2X = A2,
               PIN_J2Y = A3 ,
               PIN_K1CLK = A4,
               PIN_K1DT = A5,
               PIN_K2CLK = A6,
               PIN_K2DT = A7,
               PIN_K3CLK = A8,
               PIN_K3DT = A9,
               PIN_K4CLK = A10,
               PIN_K4DT = A11,
               };
enum commandsEnum { KNOB,
                    COMMANDS_SIZE };

const char *commands[] = { "KNOB" };
bool active[SENSORS_SIZE] = { true };

void setup() {
  Serial.begin(115200);
}

void loop() {
  // put your main code here, to run repeatedly:

  // Serial.print("YO WHATS UP");
  // Serial.print(analogRead(PIN_J1Y)+",");
  // handleJoystick1();
  loadSensorData();

  //send all our data!
  Serial.println();
}

void loadSensorData() {
  for (short i = 0; i < SENSORS_SIZE; i++)
    if (active[i])
      handleSensor(i);
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
      handleKnob1();
      break;

    case KNOB2:
      handleKnob2();
      break;

    case KNOB3:
      handleKnob3();
      break;

    case KNOB4:
      handleKnob4();
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
  Serial.print(analogRead(PIN_J2X)+",");
  Serial.print(',');
  Serial.print(analogRead(PIN_J2Y)+",");
  Serial.print(',');
}


void handleKnob1(){
  Serial.print(analogRead(PIN_K1CLK)+",");
  Serial.print(',');
  Serial.print(analogRead(PIN_K1DT)+",");
  Serial.print(',');
}

void handleKnob2(){
  Serial.print(analogRead(PIN_K2CLK)+",");
  Serial.print(',');
  Serial.print(analogRead(PIN_K2DT)+",");
  Serial.print(',');
}

void handleKnob3(){
  Serial.print(analogRead(PIN_K3CLK)+",");
  Serial.print(',');
  Serial.print(analogRead(PIN_K3DT)+",");
  Serial.print(',');
}

void handleKnob4(){
  Serial.print(analogRead(PIN_K4CLK) +",");
  Serial.print(',');
  Serial.print(analogRead(PIN_K4DT) +",");
  Serial.print(',');
}

enum sensorCodesEnum { JOY1,
  JOY2,
  KNOB1,
  KNOB2,
  KNOB3,
  KNOB4,
  SENSORS_SIZE 
};

enum pinCode { 
  PIN_J1X = A0,
  PIN_J1Y = A1,
  PIN_J2X = A2,
  PIN_J2Y = A3 ,
  PIN_K1CLK = 2,
  PIN_K1DT = 3,
  PIN_K2CLK = A6,
  PIN_K2DT = A7,
  PIN_K3CLK = A8,
  PIN_K3DT = A9,
  PIN_K4CLK = A10,
  PIN_K4DT = A11,
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

  void hanldeKnob(int CLK_pin, int DT_pin){
    CLK_state = digitalRead(CLK_pin);

    if(CLK_state != prev_CLK_state && CLK_state == HIGH){
      if(digitalRead(DT_pin) == HIGH){
        counter--;
        direction = 1;

      } else{
        counter++;
        direction = 0;
      }
    }
    prev_CLK_state = CLK_state;

    Serial.print(counter);
    Serial.print(',');
  }
};

struct KnobDat KnobDatList[4];

const char *commands[] = { "KNOB" };
bool active[SENSORS_SIZE] = {true};

void setup() {
  Serial.begin(115200);
}

void loop() {
  loadSensorData();

  //send all our data!
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
      KnobDatList[code - KNOB1].hanldeKnob(PIN_K1CLK, PIN_K1DT);
      break;

    case KNOB2:
      KnobDatList[code - KNOB1].hanldeKnob(PIN_K2CLK, PIN_K2DT);
      break;

    case KNOB3:
      KnobDatList[code - KNOB1].hanldeKnob(PIN_K3CLK, PIN_K3DT);
      break;

    case KNOB4:
      KnobDatList[code - KNOB1].hanldeKnob(PIN_K4CLK, PIN_K4DT);
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


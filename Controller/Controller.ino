enum sensorCodesEnum  {JOY1, JOY2, SENSORS_SIZE};
enum commandsEnum     {KNOB, COMMANDS_SIZE};

const char *commands[] =    {"KNOB"};
bool active[SENSORS_SIZE] = {false};

void setup() {
  Serial.begin(115200);
}

void loop() {
  // put your main code here, to run repeatedly:

}

void sendSerial(){
  for(short i = 0; i < SENSORS_SIZE; i++)
    if(active[i])
      handleSensor(i);
}

void handleSensor(short code){
  switch(code){
    case JOY1:
      handleJoystick1();
      break;

    case JOY2:
      handleJoystick2();
      break;

  }
}

void handleJoystick1(){

}

void handleJoystick2(){

}

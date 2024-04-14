void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
}

void loop() {
  // put your main code here, to run repeatedly:

  int currTemp = analogRead(A6);

  double r2 = (currTemp * 100000) / (1024 - currTemp);
  r2 /= 1000;
  double temp = 0.0018 * pow(r2, 2) + -0.6001 * r2 + 66.5213;

  Serial.print("0,0,0,0,0,0,0,0,");

  Serial.print(temp);
  Serial.print(',');

  Serial.println(analogRead(A7));

}

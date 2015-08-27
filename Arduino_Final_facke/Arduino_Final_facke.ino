// OBD
#include <SoftwareSerial.h>
String csv[3];

void setup(){
    
}
 
void loop(){

  get_obd();
  get_gyro();
  get_gps();  
  
  Serial.print(csv[0]);
  Serial.print(csv[1]);
  
  csv[2].trim();
  Serial.print(csv[2]);
  
  delay(1000);
  Serial.println("");
  
}

/*
 * OBD II
 */
  void get_obd(){
    csv[0] = "";
    send_OBD_cmd("");
    
  }    
  
/*
 * Send ODB command for initialization
 */
  void send_OBD_cmd(char *obd_cmd){
    csv[0] = "410C1D02;410575;410D34;410472;41313E71;";

  }
    
/*
 * GYROSCOPE
 */  
  void get_gyro(){
  csv[1] = "5039,5039,5039;";
 
  }
  
/*
 * GPS
 */
  void get_gps(){
   csv[2] = "$GPVTG,236.03,T,,M,26.100,N,48.337,K,A*37$GPGGA,203647.00,2947.80630,S,0$GPRMC,203656.00,A,2947.81774,S,05109.12092,W,27.364,267.22,2608,35*48$GPGLL,2947.83314,S,05109.18909,W,203704.00,A,A*65;";
  
  }

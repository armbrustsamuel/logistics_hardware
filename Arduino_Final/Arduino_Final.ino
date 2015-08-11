// OBD
#include <SoftwareSerial.h>
#define RxD 2                //Arduino pin connected to Tx of HC-05
#define TxD 3                //Arduino pin connected to Rx of HC-05

#define RPM  1
#define RPM_CODE "010C"
#define TEMP 2
#define TEMP_CODE "0105"
#define SPD  3
#define SPD_CODE "010D"
#define LOAD 4
#define LOAD_CODE "0104"

SoftwareSerial blueToothSerial(RxD,TxD); 
boolean prompt = false;
boolean record;

// GPS  
  char temp = 0;
  String dataString = "";
  int count;
  int rounds = 150;

  String csv[3];

// GYRO
//  const int roundTime=1000;
  int GyX,GyY,GyZ; //Variaveis para armazenar valores dos sensores
  
void setup(){
  Serial.begin(38400);
  
  blueToothSerial.begin(38400);
  pinMode(RxD, INPUT);
  pinMode(TxD, OUTPUT);

  record = false;
  send_OBD_cmd("ATZ");              // send to OBD ATZ, reset
  send_OBD_cmd("ATE0");             // ECHO OFF (Para o OBDII não devolver os mesmos comandos enviados)
    
}
 
void loop(){

  get_obd();
  get_gyro();
  
  get_gps();  
  csv[2].trim();
  while (csv[2].length() == 0){
    get_gps();
  }

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

    record = true;
    csv[0] = "";
    send_OBD_cmd(RPM_CODE);
    send_OBD_cmd(TEMP_CODE);
    send_OBD_cmd(SPD_CODE);
    send_OBD_cmd(LOAD_CODE);
  }    
  
/*
 * Send ODB command for initialization
 */
  void send_OBD_cmd(char *obd_cmd){
    
    char recvChar;
    int retries;
    int RETRY;
   
    retries= 0;
    RETRY = 10;
    prompt = false;
    while((!prompt) && (retries < RETRY)){                        // while no prompt and not reached OBD cmd retries
      blueToothSerial.print(obd_cmd);                             // send OBD cmd
      blueToothSerial.print("\r");                                // send cariage return

      delay(500);
      while (blueToothSerial.available() <= 0);                   // wait while no data from ELM
        
      while ((blueToothSerial.available()>0) && (!prompt)){       // while there is data and not prompt
        recvChar = blueToothSerial.read();                        // read from elm 
        if (recvChar==62){
          prompt=true;                                            // if received char is '>' then prompt is true
        }else{
          if (recvChar == 32 || recvChar == 10 | recvChar == 13){
            
          }else{
            if(record){ csv[0] += recvChar; };
          }
        }
       
      }
      retries += 1;
      delay(1000);
    }
    csv[0] += ";";
    if (retries>=RETRY) {                                         // if OBD cmd retries reached
      Serial.println("@ Error connecting OBD");
    }
  }
    
/*
 * GYROSCOPE
 */  
  void get_gyro(){
  String line;
  GyX = analogRead(A0);
  GyY = analogRead(A1);
  GyZ = analogRead(A2);
  
  gyro_clibration();

  line += String(GyX)+","+String(GyX)+","+String(GyX)+";";
  csv[1] = String(line);
  
  //Aguarda e reinicia o processo
//  delay(roundTime);
  }
    void gyro_clibration(){
    float offsetx, offsety, offsetz;
    float gainx, gainy, gainz;
    
    // Calibration Off-set for the three axes
    offsetx = -21.16; 
    offsety = -10.95;
    offsetz = -18.82;
    
    // Calibration Gain for the three axes
    gainx   = 0.0679;
    gainy   = 0.0971;
    gainz   = 0.0680;
    
    // Calibration compensation
    GyX = (GyX-offsetx) / gainx;
    GyY = (GyY-offsety) / gainy;
    GyZ = (GyZ-offsetz) / gainz;
  }
  
/*
 * GPS
 */
  void get_gps(){
    while(Serial.available())
    {
      
      temp = Serial.read();
    
      if(count >= rounds && temp == '$'){
          
        dataString.trim();
        csv[2] = dataString;
        dataString = "";      
        count = 0;
      }
         
         if (temp == 10 || temp == 13 || temp == 32){
          
         }else{
            count ++;
            dataString += String(temp);
         }
    }    
  }

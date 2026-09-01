01-09-2026

\#include \<Wire.h\>  
\#include \<Adafruit\_GFX.h\>  
\#include \<Adafruit\_SSD1306.h\>

\#define SCREEN\_WIDTH 128  
\#define SCREEN\_HEIGHT 64  
\#define OLED\_SDA 17  
\#define OLED\_SCL 18  
\#define OLED\_RST 21

Adafruit\_SSD1306 display(SCREEN\_WIDTH, SCREEN\_HEIGHT, \&Wire, \-1);

const int sensorPin \= 2;  
\#define FPGA\_TX\_PIN 4    
\#define FPGA\_RX\_PIN 5  

int highestRaw \= 0;  
unsigned long lastUpdate \= 0;

// Phenora Experiment States  
enum State {  
  MONITORING,  
  GROWTH\_DETECTED,  
  TESTING\_ANTIBIOTICS,  
  RESULT\_SUSCEPTIBLE,  
  RESULT\_RESISTIVE  
};

State currentState \= MONITORING;  
unsigned long stateTimer \= 0;  
int growthCounter \= 0;   
const float THRESHOLD \= 1.30;

void setup() {  
  Serial.begin(115200);  
  Serial1.begin(9600, SERIAL\_8N1, FPGA\_RX\_PIN, FPGA\_TX\_PIN);

  pinMode(OLED\_RST, OUTPUT);  
  digitalWrite(OLED\_RST, LOW);  
  delay(50);  
  digitalWrite(OLED\_RST, HIGH);

  Wire.begin(OLED\_SDA, OLED\_SCL);  
  if(\!display.begin(SSD1306\_SWITCHCAPVCC, 0x3C)) { while(1); }

  display.clearDisplay();  
  display.setTextColor(SSD1306\_WHITE);  
  display.setTextSize(1);  
  display.setCursor(0, 20);  
  display.println(" Phenora AFE Active");  
  display.display();  
  delay(1000);  
}

void loop() {  
  int currentRaw \= analogRead(sensorPin);  
  if (currentRaw \> highestRaw) { highestRaw \= currentRaw; }

  if (millis() \- lastUpdate \> 200\) { // 5 updates per second  
    float peakVoltage \= (highestRaw / 4095.0) \* 3.3;

    // Scale raw ADC down to a single byte for FPGA processing  
    uint8\_t dataByte \= map(highestRaw, 0, 4095, 0, 255);  
    Serial1.write(dataByte); 

    // \--- BACTERIA EXPERIMENT LOGIC \---  
    switch(currentState) {  
      case MONITORING:  
        // Wait for voltage to drop to/below 1.3V consistently  
        if (peakVoltage \<= THRESHOLD) {  
          growthCounter++;  
          if (growthCounter \>= 10\) { // 2 seconds of sustained growth evidence  
            currentState \= GROWTH\_DETECTED;  
            stateTimer \= millis();  
          }  
        } else {  
          growthCounter \= 0; // Reset if it was just noise  
        }  
        break;

      case GROWTH\_DETECTED:  
        // Give the user 5 seconds to add the antibiotics  
        if (millis() \- stateTimer \> 5000\) {  
          currentState \= TESTING\_ANTIBIOTICS;  
          stateTimer \= millis();  
        }  
        break;

      case TESTING\_ANTIBIOTICS:  
        // Wait 15 seconds for antibiotics to react with bacteria  
        if (millis() \- stateTimer \> 15000\) {  
          if (peakVoltage \> THRESHOLD) {  
            // Voltage bounced back above 1.3 \- Bacteria died  
            currentState \= RESULT\_SUSCEPTIBLE;  
          } else {  
            // Voltage stayed at/below 1.3 \- Bacteria survived  
            currentState \= RESULT\_RESISTIVE;  
          }  
        }  
        break;

      case RESULT\_SUSCEPTIBLE:  
      case RESULT\_RESISTIVE:  
        // Final state, requires physical reset for new experiment  
        break;  
    }

    // \--- OLED DISPLAY UPDATE \---  
    display.clearDisplay();  
      
    // 1\. BIG TITLE  
    display.setTextSize(2);  
    display.setCursor(0, 0);  
    display.println("PHENORA");  
      
    // 2\. DETAILS (Voltage data)  
    display.setTextSize(1);  
    display.setCursor(0, 18);  
    display.print("Raw: "); display.print(highestRaw);  
    display.print(" V: "); display.print(peakVoltage, 2); display.println("V");  
      
    // 3\. DYNAMIC STATUS & FINAL RESULT  
    display.setCursor(0, 28);  
      
    if (currentState \== MONITORING) {  
      display.println("Status: Monitoring");  
      display.println("Waiting for growth.");  
    }   
    else if (currentState \== GROWTH\_DETECTED) {  
      display.println("Status: GROWTH ALERT");  
      display.println("Add Antibiotics\!");  
    }   
    else if (currentState \== TESTING\_ANTIBIOTICS) {  
      display.println("Status: Testing...");  
      int timeLeft \= 15 \- ((millis() \- stateTimer) / 1000);  
      display.print("Time left: "); display.print(timeLeft); display.println("s");  
    }   
    else if (currentState \== RESULT\_SUSCEPTIBLE) {  
      display.println("Status: Bacteria Dead");  
      display.setCursor(0, 46);  
      display.setTextSize(2); // BIG text for final result  
      display.println("SUSCEPTIBLE");  
    }   
    else if (currentState \== RESULT\_RESISTIVE) {  
      display.println("Status: Growing");  
      display.setCursor(0, 46);  
      display.setTextSize(2); // BIG text for final result  
      display.println("RESISTIVE");  
    }

    display.display();

    highestRaw \= 0;  
    lastUpdate \= millis();  
  }  
    
  delay(10);  
}

Review: Good Display \- Architecture working fine
# Innoweek 2015 - Logistics Team (Hardware Application)

Embedded telemetry application, to collect and upload vehicles hardware information to SAP HANA data analysis server.

##How to run

To run the application on you Raspeberry Pi you need to...

###Install Raspbian

To install the Rasbian OS on your SD card, you can follow these [instructions](https://www.raspberrypi.org/documentation/installation/installing-images/).


###Install Peripheral Hardware
TODO

###Install Node.js

The Node.js installation can be done with sudo permissions through the package manager following these commands:

```sh
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```

To allow compatibility with legacy packages, the nodejs must be execute by **node** and **nodejs**.
The installation of nodejs-legacy will allow this.

```sh
sudo apt-get install nodejs-legacy
```

You can now check the version of installed applications.
I should now just received the version as result without any error.

```sh
node -v
nodejs -v
npm -v
```

###Clone Repository

To clone the repository from github on raspberry shell execute:
```sh
git clone https://github.com/armbrustsamuel/logistics_hardware.git
```

###Run the application

Once you have the application source on your local machine, enter on the folder and run it through npm script:

```sh
cd logistics_hardware
npm start
```
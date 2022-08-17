# Realtime Share

This is an ionic android and desktop app used to instantly share  files and text between android and desktop. 

### Settings

create a .env file at root directory and paste your firebase credentials

    REACT_APP_APIKEY=""
    REACT_APP_AUTHDOMAIN=""
    REACT_APP_PROJECTID=""
    REACT_APP_STORAGEBUCKET=""
    REACT_APP_MESSAGESENDERID=""
    REACT_APP_APPID=""
    REACT_APP_MEASUREMENTID=""
    GENERATE_SOURCEMAP=false

Now you need to build this react project for furthur  mobile and desktop

   npm run build

### Mobile
For mobile run

    npx cap add android
    npx cap open android

Add your logos to resources folder and run

    npm run android:logos

### Desktop 
for desktop you need to install neutralino.js compile to desktop

    npm install -g @neutralinojs/neu
    neu build







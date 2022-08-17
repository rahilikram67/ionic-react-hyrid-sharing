import { Options, run } from 'cordova-res';
import { AdaptiveIconResourceOptions } from "cordova-res/dist/platform"
import { sync } from "rimraf"
const options: Options = {
    skipConfig: true,
    resourcesDirectory: './resources',
    projectConfig: {
        android: { directory: './android' },
    },
    logstream: process.stdout, // Any WritableStream
    platforms: {
        android: {
            "adaptive-icon": {
                foreground: { sources: ['./resources/icon.png'] },
                background: { sources: ['./resources/back.png'] },
                icon: { sources: ['./resources/icon.png'] },
            },
            icon: {
                sources: ['./resources/icon.png']
            },
            splash: {
                sources: ['./resources/splash.png']
            }
        },
    },
    copy: true
};
(async () => {
    await run(options);
    sync("./resources/android")
})()
---
title: "Using Google Maps in an Ionic application"
date: 2017-07-09T20:36:46+02:00
draft: false
---

Some introductory words go here

An inline ```code snippet``` goes here.

and a link: [GitHub](http://github.com)

As Grace Hopper said:

> I’ve always been more interested


Shortcodes:

{{% p class="tip" %}}Hello **World!**{{% /p %}}



# Heading 1

## Heading 2

### Heading 3

#### Heading 4






## Some HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>huhu</title>
</head>
<body>
    <h1>hello</h1>
</body>
</html>
```

Animated gif of result UI goes here

# Prerequisites

Basic understanding of Ionic 2

Ionic installed on your machine

If not, read...

# Let's get started

Now, let's start.

## Create a new Ionic 2 application

Run `ionic start ionic-google-maps` to create a new Ionic 2 application.
Once the application has been generated, make the newly generated directory your working directory: `cd ionic-google-maps`.

## Google Maps

We are going to use the Google Maps Javascript API, not the native SDK...

Load the JS API using a js file in index.html



## HTML

```html
<ion-header>
    <ion-navbar>
        <ion-buttons start>
            <button ion-button menuToggle>
                <ion-icon name="menu"></ion-icon>
            </button>
        </ion-buttons>

        <ion-title>
            <span translate>Google Maps Example</span>
        </ion-title>
   
    
        <ion-buttons end>
            <button ion-button (click)="presentMarkerFilterDropdown($event)">
                <ion-icon name="funnel"></ion-icon>
            </button>
        </ion-buttons>
        
    </ion-navbar>
</ion-header>

<ion-content>
    
    <!-- loading spinner -->
    <div *ngIf="!mapInitialized" class="spinner-container-centered">
        <ion-spinner></ion-spinner>
    </div>
    
    <div *ngIf="mapsApiReady" id="map"></div>
    
</ion-content>
```

# ADVANCED - FUTURE

Map loading

Filter markers

Further reading / misc other tutorials

# SAMPLE CONTENT - WILL BE DELETED

## npm link

Currently, modules must be published to npm. `npm link` packages will not install properly with our webpack confing (something on our list). If you can't push private code to npm, other options are a private npm repo/npm enterprise, or `npm install` from a git repo.

## Using your module in an Ionic 2 app

```typescript
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

// Import your module
import { MyModule } from 'ionic-module-template';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),

    MyModule // Put your module here
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: []
})
export class AppModule {}
```

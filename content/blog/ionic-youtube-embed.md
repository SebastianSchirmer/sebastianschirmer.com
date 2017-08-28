---
title: Embed YouTube videos in an Ionic 2 application
date: 2017-08-05T20:36:46+02:00
draft: false
---

YouTube videos are typically embedded in an Ionic 2 application by loading a video into an iframe. So let’s try exactly that.

## Load YouTube video into iframe

To start off, create a new Ionic 2 project and a new page “video”. Modify the ```video.html``` code to load a YouTube video as iframe src. In order to do so, get an embed url and iframe element for a YouTube video that you can copy & paste:

```html
<ion-header>
    <ion-navbar>
        <ion-title>
            YouTube Video Embed
        </ion-title>
    </ion-navbar>
</ion-header>

<ion-content padding>    
    <iframe width="560" height="315" src="https://www.youtube.com/embed/MLleDRkSuvk" frameborder="0" allowfullscreen></iframe>
</ion-content>
```

Now we will replace amend the iframe width, make the video url dynamic and add a video title as follows:

```html
<ion-content padding>
    <iframe width="100%" height="315" [src]="video.url" frameborder="0" allowfullscreen></iframe>
    
    <h2>{{ video?.title }}</h2>
</ion-content>
```

The corresponding ```video.ts``` code looks as follows:

```typescript
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-video',
    templateUrl: 'video.html'
})
export class HelpvideoPage {
    video: any = {
        url: 'https://www.youtube.com/embed/MLleDRkSuvk',
        title: 'Awesome video'
    };

    constructor(public navCtrl: NavController) {
    }
}
```

Awesome, let’s run it and see if it works. But… the video doesn’t get loaded into the iframe as we would have expected.

The reason for this is that a url to be loaded into an iframe isn’t be seen as safe by Angular and therefore Angular won’t load it. To circumvent this and to tell Angular that the url is safe to be loaded, the url has to be sanitized by the ```DomSanitizer```. So, add the following imports to your ```video.html``` file:

```typescript
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
```

Now we use the ```DomSanitizer```’s ```bypassSecurityTrustResourceUrl()``` method and pass in our video url to get a sanitized url:

```typescript
trustedVideoUrl: SafeResourceUrl;

constructor(public navCtrl: NavController,
            private domSanitizer: DomSanitizer) {}
            
ionViewWillEnter(): void {
    this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.video.url);
}            
``` 

We’ll need to modify our html as follows:

```html
<ion-content padding>
    <iframe width="100%" height="315" [src]="trustedVideoUrl" frameborder="0" allowfullscreen></iframe>
    
    <h2>{{ video?.title }}</h2>
</ion-content>

```

And it works!

## Allow navigation on iOS

There is one more thing we need to do in order to make this work on iOS, we need to allow navigation to YouTube urls in our ```config.xml``` file by adding the below line:

```xml
<allow-navigation href="https://*youtube.com/*"/>
```

That’s it and we could stop here. However, there’s an improvement you should definitely implement:

## Show a loading spinner during video loading

To indicate to users that a video is loading we may want to show them a loading spinner until a video has completed loading into the iframe. This is especially useful for users on a slow connection or trying to load a large video.

How do we do that? We show a loading spinner initially when entering the page and make use of the iframe’s ```load``` event to hide the loading spinner as soon as the video has completed loading.

Let’s use a standard Ionic 2 Loading component that we present on entering the page and that we hide when the iframe content has completed loading:

```typescript
import { Component } from '@angular/core';
import { Loading, LoadingController, NavController } from 'ionic-angular';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'page-video',
    templateUrl: 'video.html'
})
export class HelpvideoPage {
    video: any = {
        url: 'https://www.youtube.com/embed/MLleDRkSuvk',
        title: 'Awesome video'
    };

    trustedVideoUrl: SafeResourceUrl;
    loading: Loading;

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                private domSanitizer: DomSanitizer) {}

    ionViewWillEnter(): void {
        this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.video.url);

        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        this.loading.present();
    }

    handleIFrameLoadEvent(): void {
        this.loading.dismiss();
    }
}
```

The corresponding ```video.html``` code looks like this:

```html
<iframe width="100%" height="315" [src]="trustedVideoUrl" (load)="handleIFrameLoadEvent()" frameborder="0" allowfullscreen></iframe>
```

Nice. If we try this out, we probably observe that the ```handleIFrameLoadEvent()``` function is called multiple times, not just once. This depends on the device or browser being used, therefore, if you don’t observe this behaviour, just believe me that it happens and that we need to handle it appropriately.

There is a [stackoverflow thread](https://stackoverflow.com/questions/42677931/onload-happening-multiple-times-with-iframe) providing us an explanation on why this happens and how this issue may be mitigated.

It seems that Angular is adding the load event handler to the element before the iframe is added to the DOM.

One possible solution is to ignore events while the video url is still null and only handle them as soon as the video url is not null anymore. We will apply this solution and modify our iframe element in ```video.html``` as follows:

```html
<iframe #iframeVideo width="100%" height="315" [src]="trustedVideoUrl ? trustedVideoUrl : null" (load)="trustedVideoUrl ? handleIFrameLoadEvent() : null" frameborder="0" allowfullscreen></iframe>
```

Awesome, the iframe load event now fires exactly when it is supposed to do so.

And we’re done.

## Complete Code

For your convenience, the complete code is shown below:

### video.ts

```typescript
import { Component } from '@angular/core';
import { Loading, LoadingController, NavController } from 'ionic-angular';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'page-video',
    templateUrl: 'video.html'
})
export class HelpvideoPage {
    video: any = {
        url: 'https://www.youtube.com/embed/MLleDRkSuvk',
        title: 'Awesome video'
    };

    trustedVideoUrl: SafeResourceUrl;
    loading: Loading;

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                private domSanitizer: DomSanitizer) {}

    ionViewWillEnter(): void {
        this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.video.url);

        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        this.loading.present();
    }

    handleIFrameLoadEvent(): void {
        this.loading.dismiss();
    }
}
```

### video.html

```html
<ion-header>
    <ion-navbar>
        <ion-title>
            YouTube Video Embed
        </ion-title>
    </ion-navbar>
</ion-header>

<ion-content padding>
    <iframe width="100%"
            height="315"
            [src]="trustedVideoUrl ? trustedVideoUrl : null"
            (load)="trustedVideoUrl ? handleIFrameLoadEvent() : null"
            frameborder="0"
            allowfullscreen></iframe>
    
    <h2>{{ video?.title }}</h2>
</ion-content>
```

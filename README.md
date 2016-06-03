# photo-slap
slideshow application written in electron and node

[![Build Status](https://travis-ci.org/eddysant/photo-slap.svg?branch=master)](https://travis-ci.org/eddysant/photo-slap) 
[![Dependency Status](https://www.versioneye.com/user/projects/573232bea0ca350034be760c/badge.svg?style=flat)](https://www.versioneye.com/user/projects/573232bea0ca350034be760c)

### raison d'etre:
there doesn't seem to be any full featured photo slide show applications, and if you're like me, you might have tens of thousands of photos, or more, organized in many different folders and you're too lazy to go through them all individually. i have just always found slide show apps to be pretty bad, so hopefully this one is better. 

my issue is that most slide show applications only seem to support one folder at a time or they don't have any support for gifs, or they don't let you delete the photo easily. This application will hopefully remedy all these issues.

### current feature set:
* Open a group of directories and arrow key through photos
* Use the shuffle feature in the menu to mix up the order of the photos
* Support files include: [".jpg", ".jpeg", ".webp", "gif", ".png", ".bmp"]
* Supported videos include (Assuming a compatible encoding): [".webm", ".mp4", ".gifv", ".ogg"] 
* Ability to delete photos (press delete)

### feature sets coming:
* Automatic slide show and on screen controls
* Chromecast support
* Updated Icons
* Cloud drive support
* Social media integration

### currently supported
* Windows
* OS X (future)

### development
clone the repo and run `npm install` followed by`npm run rebuild` then simply run `npm start` to start the app

### licensing
MIT

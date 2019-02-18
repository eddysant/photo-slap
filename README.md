# photo-slap
slideshow application written in electron and node

[![Build Status](https://travis-ci.org/eddysant/photo-slap.svg?branch=master)](https://travis-ci.org/eddysant/photo-slap) 
[![Build status](https://ci.appveyor.com/api/projects/status/pqgyrkl9y307s49r/branch/master?svg=true)](https://ci.appveyor.com/project/eddysant/photo-slap/branch/master)

### raison d'etre:
there doesn't seem to be any full featured photo slide show applications, and if you're like me, you might have tens of thousands of photos, or more, organized in many different folders and you're too lazy to go through them all individually. i have just always found slide show apps to be pretty bad, so hopefully this one is better. 

my issue is that most slide show applications only seem to support one folder at a time or they don't have any support for gifs, or they don't let you delete the photo easily. This application will hopefully remedy all these issues.

### current feature set:
* Open a group of directories and use the arrow keys or on screen controls to move through photos
* Use the shuffle feature in the menu to mix up the order of the photos
* Support files include: [".jpg", ".jpeg", ".webp", "gif", ".png", ".bmp"]
* Supported videos include (Assuming a compatible encoding): [".webm", ".mp4", ".gifv", ".ogg"] 
* Ability to delete photos (press delete, or trash can)
* Slideshow functionality (toggle with spacebar or play/pause button)
* Persistant options in the menu or using the slider button

### feature sets coming:
* Find duplicates

### currently supported
* Windows

### development
clone the repo and run `npm install` followed by `npm start` to start the app

### licensing
CC0 1.0 Universal

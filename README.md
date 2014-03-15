# sencisho

### Description
A simple http server for local development, built on top of Node.js

### Usage
`npm install -g sencisho`

From the directory you want to server static files:

`sencisho [options]`

#### Options
`--port` `-p` Port number
`--live` `-l` Enable livereload
`--browser` `-b` Specify browser

### Examples
Start in default port

`sencisho`

Start in specified port

`sencisho --port 8888` or `sencisho -p 8888`

Enable livereload

`sencisho --live` or `sencisho -l`

Open in other browser than your system default

`sencisho --browser opera` or `sencisho -b opera`

All at once (may be passed in any order)

`sencisho -p 8888 -l -b opera`

### Misc
+ What's up with that name?

  *It's a long story*

**Authors/Contributors**

+ *Julien Castelain*  <jcastelain@gmail.com>
+ *Denis Ciccale*     <dciccale@gmail.com>

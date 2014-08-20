# sencisho

### Description
A simple http server for local development, built on top of Node.js

### Usage
`npm install -g sencisho`

From the directory you want to serve static files:

`sencisho [options]`

#### Options
`--port` `-p` Port number

`--live` `-l` Enable livereload

`--browser` `-b` Specify browser

`--watch` `-w` Additional paths to watch

`--silent` `-s` Don't automatically open a browser

`--responses` `-r` Specify a json file containing a response map

*when using the -r/--responses option, livereload will be enabled*


### Examples
Start in default port

`sencisho`

Start in specified port

`sencisho --port 8888` or `sencisho -p 8888`

Enable livereload

`sencisho --live` or `sencisho -l`

Open in other browser than your system default

`sencisho --browser opera` or `sencisho -b opera`

Add additional paths to the file watcher

`sencisho --watch js/*.js` or `sencisho -w js/*.js`

Don't automatically open a browser

`sencisho --silent` or `sencisho -s`

Specify a json file containing a response map

`sencisho --responses api.json` or `sencisho -r api.json`

Example:

```
{
  "/api/test": {

    "headers": {
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "X-Requested-With"
    },

    "statusCode": 200,

    "body": {
      "name": "Something",
      "data": [1, 2, 3, 4, 5]
    }
  }
}
```

The only required property is the `body` but you can specify `headers` and a `statusCode`


All at once (may be passed in any order)

`sencisho -p 8888 -l -b opera -w js/*.js -s -r api.json`

### Misc
+ What's up with that name?

  *It's a long story*

**Authors/Contributors**

+ *Julien Castelain*  <jcastelain@gmail.com>
+ *Denis Ciccale*     <dciccale@gmail.com>

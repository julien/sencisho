# sencisho

### Description
A simple http server for local development, built on top of Node.js

### Usage
`npm install -g sencisho`

From the directory you want to server static files:

`sencisho [optional port] [optional browser]`

To enable a file watcher and livereload server:

`sencisho [optional port] [optional browser] --live`

**Note** that you will need to manually add the livereload snippet to your html files.


```
<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>
```

[More info](http://feedback.livereload.com/knowledgebase/articles/86180-how-do-i-add-the-script-tag-manually-)

### Misc
+ What's up with that name?
  
  *It's a long story*

**Authors/Contributors**

+ *Julien Castelain*  <jcastelain@gmail.com>
+ *Denis Ciccale*     <dciccale@gmail.com>




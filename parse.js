var fs       = require('fs');
var readline = require('readline');
var stream   = require('stream');

var instream = fs.createReadStream('README.md');
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);

var writeStream = fs.createWriteStream('README-SHORT.md', {flags: 'w'});

var ignore = false;

rl.on('line', function(line) {
  if(line == "<!-- Long Spec START -->"){
    ignore = true;
  }
  if(!ignore){
    writeStream.write(line + "\n");
  }
  if(line == "<!-- Long Spec END -->"){
    ignore = false;
  }
});

rl.on('close', function() {
  writeStream.end();
});

writeStream.on('finish', function () {
    console.log('All done!');
});
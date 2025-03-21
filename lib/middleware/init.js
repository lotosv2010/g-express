const fs = require('fs');

function init() {
  return (req, res, next) => {
    const { pathname } = new URL(req.url, 'http://localhost');
    req.path = pathname;

    res.send = function(msg){
      let type = typeof msg;
      if(type == 'object'){
        res.setHeader('Content-Type','application/json');
        msg = JSON.stringify(msg);
        res.end(msg);
      }else if(type == 'number'){
        res.setHeader('Content-Type','application/plain');
        res.status(msg);
        res.end(http.STATUS_CODES[msg]);
      }else{
        res.setHeader('Content-Type','application/html');
        res.end(msg);
      }
    }

    res.sendFile = function(path){
      fs.createReadStream(url).pipe(res);
    }

    next();
  }
}

module.exports = init;
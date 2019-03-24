fast logger
=========

Very simple node logger with console colors

## Installation
  ```bash
  $ npm install fast-logger
  ```

## Usage
```javascript
var diff = require('fast-logger');
```

## Examples  
```javascript
var logger = require('fast-logger');
logger.settings.logging = true;
logger.log("Hello from logger");
logger.log("Info message from logger", "INFO");
logger.log("Warning message from logger", "WARN");
logger.log("Error message from logger", "ERROR");
```

![](https://cloud.githubusercontent.com/assets/179938/19187109/f499ae24-8c89-11e6-83e6-426545587f96.png "Output")

## Tests usages (will output few lines of log)
  ```bash
  $ npm test
  ```

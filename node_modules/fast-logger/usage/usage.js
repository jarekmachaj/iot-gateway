var logger = require('../index');
logger.settings.logging = true;
logger.log("Hello from logger");
logger.log("Info message from logger", "INFO");
logger.log("Warning message from logger", "WARN");
logger.log("Error message from logger", "ERROR");
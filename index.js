var Zepto = module.exports = require('./src/Zepto');
require('./src/detect')(Zepto);
require('./src/data')(Zepto);
require('./src/form')(Zepto);
require('./src/event')(Zepto);
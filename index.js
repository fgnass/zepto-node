var Zepto = module.exports = require('./src/zepto');
require('./src/detect')(Zepto);
require('./src/data')(Zepto);
require('./src/form')(Zepto);
require('./src/event')(Zepto);

var rewire = require('rewire');

rewireModule('react-scripts/scripts/build.js', loadCustomizer('../config/webpack.prod'));

function loadCustomizer(module) {
  try {
    return require(module);
  } catch(e) {
    if(e.code !== "MODULE_NOT_FOUND") {
      throw e;
    }
  }

  return config => config;
}

function rewireModule(modulePath, customizer) {
  let defaults = rewire(modulePath);

  let config = defaults.__get__('config');
  customizer(config);
}

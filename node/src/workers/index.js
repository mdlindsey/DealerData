'use strict';
module.exports = {
  inventory: require('./inventory').exec,
  sales: require('./sales').exec,
  returns: require('./returns').exec,
};

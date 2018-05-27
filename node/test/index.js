const assert = require('chai').assert;

const worker = {
  sales: require('./../src/workers/sales'),
  returns: require('./../src/workers/returns'),
  inventory: require('./../src/workers/inventory')
};


describe('Workers', () => {
  it('Inventory', async () => {
    assert.isOk(await worker.inventory.exec());
  });
  it('Sales', async () => {
    assert.isOk(await worker.sales.exec());
  });
  it('Returns', async () => {
    assert.isOk(await worker.returns.exec());
  });
});

import { SortProductsByQuantityPipe } from './sort-products-by-quantity.pipe';

describe('SortProductsByQuantityPipe', () => {
  it('create an instance', () => {
    const pipe = new SortProductsByQuantityPipe();
    expect(pipe).toBeTruthy();
  });
});

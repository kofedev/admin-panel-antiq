import { SortProductsByPricePipe } from './sort-products-by-price.pipe';

describe('SortProductsByPricePipe', () => {
  it('create an instance', () => {
    const pipe = new SortProductsByPricePipe();
    expect(pipe).toBeTruthy();
  });
});

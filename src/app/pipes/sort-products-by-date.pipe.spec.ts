import { SortProductsByDatePipe } from './sort-products-by-date.pipe';

describe('SortProductsByDatePipe', () => {
  it('create an instance', () => {
    const pipe = new SortProductsByDatePipe();
    expect(pipe).toBeTruthy();
  });
});

// goalkicklive/__tests__/simple.test.ts

describe('Simple Jest Test', () => {
  it('should pass basic arithmetic', () => {
    expect(1 + 1).toBe(2);
    expect(2 * 2).toBe(4);
  });

  it('should handle string operations', () => {
    expect('hello'.toUpperCase()).toBe('HELLO');
    expect('world'.length).toBe(5);
  });

  it('should work with arrays', () => {
    const numbers = [1, 2, 3];
    expect(numbers).toHaveLength(3);
    expect(numbers).toContain(2);
  });

  it('should work with objects', () => {
    const obj = { name: 'test', value: 42 };
    expect(obj).toHaveProperty('name', 'test');
    expect(obj.value).toBe(42);
  });
});

describe('Test Environment', () => {
  it('should have proper test environment setup', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
  });

  it('should support modern JavaScript features', () => {
    // Test ES6+ features
    const spread = [...[1, 2, 3]];
    expect(spread).toEqual([1, 2, 3]);

    const obj = { a: 1, ...{ b: 2 } };
    expect(obj).toEqual({ a: 1, b: 2 });

    // Test async/await
    const asyncFunc = async () => 'result';
    return asyncFunc().then(result => {
      expect(result).toBe('result');
    });
  });
});

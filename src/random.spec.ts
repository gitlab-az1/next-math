import { Random } from './random';


describe('math/random', () => {
  test('it should be ok', () => {
    expect(25 ** (1/2)).toBe(5);
  });

  test('it should generate a random number', () => {
    const r = new Random();
    const n = r.random;

    expect(n).toBeGreaterThanOrEqual(0);
    expect(n).toBeLessThanOrEqual(1);
  });

  test('it should generate a random number between 0 and 10', () => {
    const n = Random.uniform(0, 10);
    
    expect(n).toBeGreaterThanOrEqual(0);
    expect(n).toBeLessThanOrEqual(10);
  });

  test('it should generate a random integer', () => {
    const n = Random.integer(0, 10);
        
    expect(n).toBeGreaterThanOrEqual(0);
    expect(n).toBeLessThanOrEqual(10);
  });

  test('it should choose a random element from an array', () => {
    const arr = [1, 2, 3, 4, 5];
    const n = Random.choose(arr);
    
    expect(arr).toContain(n);
  });

  test('it should return a random string', () => {
    const str = Random.string(10);
    expect(str.length).toBe(10);
  });

  test('it should return a random string without special chars', () => {
    const str = Random.string(10, false);
    expect(str.length).toBe(10);
    expect(str).toMatch(/^[a-zA-Z0-9]+$/);
  });

  test('it should return a random string with special chars', () => {
    const str = Random.string(10, true);
    expect(str.length).toBe(10);

    // eslint-disable-next-line no-useless-escape
    expect(str).toMatch(/^[a-zA-Z0-9@#\-_\)\(\[\];:%\*]+$/);
  });

  test('it should return the most even integer of 5.443', () => {
    const rand = new Random();
    const n = rand.nextInt(5.443);

    expect(n).toBeGreaterThanOrEqual(0);
    expect(n).toBeLessThanOrEqual(5);
  });

  test('it should return the index of an array with 5 elements', () => {
    const rand = new Random();
    const n = rand.nextInt([1, 2, 3, 4, 5]);

    expect(n).toBeGreaterThanOrEqual(0);
    expect(n).toBeLessThanOrEqual(4);
  });
});
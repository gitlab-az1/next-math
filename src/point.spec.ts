import { Point } from './point';
import { Vector2D, Vector } from './vector';


describe('math/point', () => {
  test('it should be ok', () => {
    expect(25 ** (1/2)).toBe(5);
  });

  test('it should create a point', () => {
    const p = new Point(1, 2);
    expect(p.x).toBe(1);
    expect(p.y).toBe(2);
  });

  test('it should add two points', () => {
    const p1 = new Point(1, 2);
    const p2 = new Point(3, 4);

    const p3 = p1.add(p2);

    expect(p3.x).toBe(4);
    expect(p3.y).toBe(6);
  });

  test('it should subtract two points', () => {
    const p1 = new Point(1, 2);
    const p2 = new Point(3, 4);

    const p3 = p1.subtract(p2);

    expect(p3.x).toBe(-2);
    expect(p3.y).toBe(-2);
  });

  test('it should multiply a point by a scalar', () => {
    const p1 = new Point(1, 2);

    const p2 = p1.scale(2);

    expect(p2.x).toBe(2);
    expect(p2.y).toBe(4);
  });

  test('it should freeze a point', () => {
    const p = new Point(1, 2);
    p.freeze();

    expect(() => p.add(new Point(1, 2))).toThrow();
    expect(() => p.subtract(new Point(1, 2))).toThrow();
    expect(() => p.scale(2)).toThrow();
  });

  test('it should throw an exception when add a freeze point', () => {
    const p = new Point(1, 2);
    p.freeze();

    expect(() => p.add(new Point(1, 2))).toThrow();
  });

  test('it should throw an exception when subtract a freeze point', () => {
    const p = new Point(1, 2);
    p.freeze();

    expect(() => p.subtract(new Point(1, 2))).toThrow();
  });

  test('it should throw an exception when scale a freeze point', () => {
    const p = new Point(1, 2);
    p.freeze();
    
    expect(() => p.scale(2)).toThrow();
  });

  test('it should create a point from a 2D vector', () => {
    const vector = new Vector2D(1, 2);
    const p = Point.fromVector(vector);

    expect(p.x).toBe(1);
    expect(p.y).toBe(2);
  });

  test('it should create a point from a 3D vector using orthographic projection', () => {
    const vector = new Vector(1, 2, 3);
    const p = Point.fromVector(vector, { conversionMethod: 'orthographic_projection' });

    expect(p.x).toBe(1);
    expect(p.y).toBe(2);
  });

  test('it should create a point from a 3D vector using perspective projection', () => {
    const vector = new Vector(1, 2, 3);
    const p = Point.fromVector(vector, { conversionMethod: 'perspective_projection' });
    
    expect(p.x).toBe(0.25);
    expect(p.y).toBe(0.5);
  });

  test('it should create a point from a 3D vector using perspective projection with custom focal length', () => {
    const vector = new Vector(1, 2, 3);
    const p = Point.fromVector(vector, {
      conversionMethod: 'perspective_projection',
      focalLength: 2,
    });
    
    expect(p.x).toBe(0.5);
    expect(p.y).toBe(1);
  });

  test('it should create a point from a 3D vector using perspective projection with custom projection plane Z', () => {
    const vector = new Vector(1, 2, 3);
    const p = Point.fromVector(vector, {
      conversionMethod: 'perspective_projection',
      projectionPlaneZ: 2,
    });
    
    expect(p.x).toBe(0.2);
    expect(p.y).toBe(0.4);
  });

  test('it should create a point from a 3D vector using perspective projection with custom focal length and projection plane Z', () => {
    const vector = new Vector(1, 2, 3);
    const p = Point.fromVector(vector, {
      conversionMethod: 'perspective_projection',
      projectionPlaneZ: 5.1,
      focalLength: 0.95,
    });
    
    expect(p.x).toBe(0.11728395061728394);
    expect(p.y).toBe(0.2345679012345679);
  });

  test('it should throw an exception when create a point from a 3D vector using perspective projection with Z = 0', () => {
    const vector = new Vector(1, 2, 0);
    expect(() => Point.fromVector(vector, { conversionMethod: 'perspective_projection' })).toThrow();
  });
});
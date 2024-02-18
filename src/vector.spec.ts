import { Vector, Vector2D } from './vector';


describe('math/vector', () => {
  test('it should be ok', () => {
    expect(25 ** (1/2)).toBe(5);
  });

  test('it should create a vector', () => {
    const vector = new Vector(0, 0, 0);

    expect(vector).toBeDefined();
    expect(vector.x).toBe(0);
    expect(vector.y).toBe(0);
    expect(vector.z).toBe(0);
  });

  test('it should create a 2D vector', () => {
    const vector = new Vector2D(0, 0);
    
    expect(vector).toBeDefined();
    expect(vector.x).toBe(0);
    expect(vector.y).toBe(0);
  });

  test('it should calculate the magnitude of a vector', () => {
    const vector = new Vector(3, 4, 5);
    expect(vector.magnitude()).toBe(7.0710678118654755);
  });

  test('it should calculate the magnitude of a 2D vector', () => {
    const vector = new Vector2D(3, 4);
    expect(vector.magnitude()).toBe(5);
  });

  test('it should calculate the magnitude of a vector with negative values', () => {
    const vector = new Vector(-3, -4, -5);
    expect(vector.magnitude()).toBe(7.0710678118654755);
  });

  test('it should calculate the magnitude of a 2D vector with negative values', () => {
    const vector = new Vector2D(-3, -4);
    expect(vector.magnitude()).toBe(5);
  });

  test('it should calculate the magnitude of a vector with decimal values', () => {
    const vector = new Vector(3.5, 4.5, 5.5);
    expect(vector.magnitude()).toBe(7.92148975887743);
  });

  test('it should calculate the magnitude of a 2D vector with decimal values', () => {
    const vector = new Vector2D(3.5, 4.5);
    expect(vector.magnitude()).toBe(5.70087712549569);
  });

  test('it should calculate the magnitude of a vector with decimal values and negative values', () => {
    const vector = new Vector(-3.5, -4.5, -5.5);
    expect(vector.magnitude()).toBe(7.92148975887743);
  });

  test('it should calculate the magnitude of a 2D vector with decimal values and negative values', () => {
    const vector = new Vector2D(-3.5, -4.5);
    expect(vector.magnitude()).toBe(5.70087712549569);
  });

  test('it should calculate the magnitude of a vector with zero values', () => {
    const vector = new Vector(0, 0, 0);
    expect(vector.magnitude()).toBe(0);
  });

  test('it should calculate the magnitude of a 2D vector with zero values', () => {
    const vector = new Vector2D(0, 0);
    expect(vector.magnitude()).toBe(0);
  });

  test('it should calculate the magnitude of a vector with one value', () => {
    const vector = new Vector(3, 0, 0);
    expect(vector.magnitude()).toBe(3);
  });

  test('it should calculate the magnitude of a 2D vector with one value', () => {
    const vector = new Vector2D(3, 0);
    expect(vector.magnitude()).toBe(3);
  });

  test('it should calculate the dot product of two vectors', () => {
    const vector1 = new Vector(3, 4, 5);
    const vector2 = new Vector(6, 7, 8);
    expect(vector1.dot(vector2)).toBe(86);
  });

  test('it should calculate the dot product of two 2D vectors', () => {
    const vector1 = new Vector2D(3, 4);
    const vector2 = new Vector2D(6, 7);
    expect(vector1.dot(vector2)).toBe(46);
  });

  test('it should calculate the dot product of two vectors with negative values', () => {
    const vector1 = new Vector(-3, -4, -5);
    const vector2 = new Vector(-6, -7, -8);
    expect(vector1.dot(vector2)).toBe(86);
  });

  test('it should calculate the dot product of two 2D vectors with negative values', () => {
    const vector1 = new Vector2D(-3, -4);
    const vector2 = new Vector2D(-6, -7);
    expect(vector1.dot(vector2)).toBe(46);
  });

  test('it should calculate the dot product of two vectors with decimal values', () => {
    const vector1 = new Vector(3.5, 4.5, 5.5);
    const vector2 = new Vector(6.5, 7.5, 8.5);
    expect(vector1.dot(vector2)).toBe(103.25);
  });

  test('it should calculate the dot product of two 2D vectors with decimal values', () => {
    const vector1 = new Vector2D(3.5, 4.5);
    const vector2 = new Vector2D(6.5, 7.5);
    expect(vector1.dot(vector2)).toBe(56.5);
  });

  test('it should calculate the dot product of two vectors with decimal values and negative values', () => {
    const vector1 = new Vector(-3.5, -4.5, -5.5);
    const vector2 = new Vector(-6.5, -7.5, -8.5);
    expect(vector1.dot(vector2)).toBe(103.25);
  });

  test('it should calculate the dot product of two 2D vectors with decimal values and negative values', () => {
    const vector1 = new Vector2D(-3.5, -4.5);
    const vector2 = new Vector2D(-6.5, -7.5);
    expect(vector1.dot(vector2)).toBe(56.5);
  });

  test('it should add two vectors', () => {
    const vector1 = new Vector(3, 4, 5);
    const vector2 = new Vector(6, 7, 8);
    const result = vector1.add(vector2);
    expect(result.x).toBe(9);
    expect(result.y).toBe(11);
    expect(result.z).toBe(13);
  });

  test('it should add two 2D vectors', () => {
    const vector1 = new Vector2D(3, 4);
    const vector2 = new Vector2D(6, 7);
    const result = vector1.add(vector2);
    expect(result.x).toBe(9);
    expect(result.y).toBe(11);
  });

  test('it should add two vectors with negative values', () => {
    const vector1 = new Vector(-3, -4, -5);
    const vector2 = new Vector(-6, -7, -8);
    const result = vector1.add(vector2);
    expect(result.x).toBe(-9);
    expect(result.y).toBe(-11);
    expect(result.z).toBe(-13);
  });

  test('it should add two 2D vectors with negative values', () => {
    const vector1 = new Vector2D(-3, -4);
    const vector2 = new Vector2D(-6, -7);
    const result = vector1.add(vector2);
    expect(result.x).toBe(-9);
    expect(result.y).toBe(-11);
  });

  test('it should subtract two vectors', () => {
    const vector1 = new Vector(3, 4, 5);
    const vector2 = new Vector(6, 7, 8);
    const result = vector1.subtract(vector2);
    expect(result.x).toBe(-3);
    expect(result.y).toBe(-3);
    expect(result.z).toBe(-3);
  });

  test('it should subtract two 2D vectors', () => {
    const vector1 = new Vector2D(3, 4);
    const vector2 = new Vector2D(6, 7);
    const result = vector1.subtract(vector2);
    expect(result.x).toBe(-3);
    expect(result.y).toBe(-3);
  });

  test('it should scale a vector', () => {
    const vector = new Vector(3, 4, 5);
    const result = vector.scale(2);
    expect(result.x).toBe(6);
    expect(result.y).toBe(8);
    expect(result.z).toBe(10);
  });

  test('it should scale a 2D vector', () => {
    const vector = new Vector2D(3, 4);
    const result = vector.scale(2);
    expect(result.x).toBe(6);
    expect(result.y).toBe(8);
  });

  test('it should scale a vector with negative values', () => {
    const vector = new Vector(-3, -4, -5);
    const result = vector.scale(2);
    expect(result.x).toBe(-6);
    expect(result.y).toBe(-8);
    expect(result.z).toBe(-10);
  });

  test('it should scale a 2D vector with negative values', () => {
    const vector = new Vector2D(-3, -4);
    const result = vector.scale(2);
    expect(result.x).toBe(-6);
    expect(result.y).toBe(-8);
  });

  test('it should normalize a vector', () => {
    const vector = new Vector(3, 4, 5);
    const result = vector.normalize();
    expect(result.x).toBe(0.4242640687119285);
    expect(result.y).toBe(0.565685424949238);
    expect(result.z).toBe(0.7071067811865475);
  });

  test('it should normalize a 2D vector', () => {
    const vector = new Vector2D(3, 4);
    const result = vector.normalize();
    expect(result.x).toBe(0.6);
    expect(result.y).toBe(0.8);
  });

  test('it should normalize a vector with negative values', () => {
    const vector = new Vector(-3, -4, -5);
    const result = vector.normalize();
    expect(result.x).toBe(-0.4242640687119285);
    expect(result.y).toBe(-0.565685424949238);
    expect(result.z).toBe(-0.7071067811865475);
  });

  test('it should normalize a 2D vector with negative values', () => {
    const vector = new Vector2D(-3, -4);
    const result = vector.normalize();
    expect(result.x).toBe(-0.6);
    expect(result.y).toBe(-0.8);
  });

  test('it should throw an error when normalizing a zero vector', () => {
    const vector = new Vector(0, 0, 0);
    let error = false;
    
    try {
      vector.normalize();
      error = false;
    } catch (err: any) {
      error = true;

      expect(err.message).toBe('Cannot normalize a zero vector');
      expect(err.reason).toBe('division by zero');
    }

    expect(error).toBe(true);
  });

  test('it should cross two vectors', () => {
    const vector1 = new Vector(3, 4, 5);
    const vector2 = new Vector(6, 7, 8);
    const result = vector1.cross(vector2);
    expect(result.x).toBe(-3);
    expect(result.y).toBe(6);
    expect(result.z).toBe(-3);
  });

  test('it should throw and error when normalize a freezed vector', () => {
    const vector = new Vector(3, 4, 5);
    vector.freeze();
    let error = false;

    try {
      vector.normalize();
      error = false;
    } catch (err: any) {
      error = true;

      expect(err.message).toBe('Cannot normalize a freezed vector');
    }

    expect(error).toBe(true);
  });

  test('it should throw and error when magnitude a freezed vector', () => {
    const vector = new Vector(3, 4, 5);
    vector.freeze();
    let error = false;
    
    try {
      vector.magnitude();
      error = false;
    } catch (err: any) {
      error = true;
    
      expect(err.message).toBe('Cannot get magnitude of a freezed vector');
    }
    
    expect(error).toBe(true);
  });

  test('it should throw and error when scale a freezed vector', () => {
    const vector = new Vector(3, 4, 5);
    vector.freeze();
    let error = false;
        
    try {
      vector.scale(2);
      error = false;
    } catch (err: any) {
      error = true;
        
      expect(err.message).toBe('Cannot scale a freezed vector');
    }
        
    expect(error).toBe(true);
  });

  test('it should throw and error when add a freezed vector', () => {
    const vector1 = new Vector(3, 4, 5);
    const vector2 = new Vector(6, 7, 8);
    vector1.freeze();
    let error = false;
                
    try {
      vector1.add(vector2);
      error = false;
    } catch (err: any) {
      error = true;
                
      expect(err.message).toBe('Cannot add a freezed vector');
    }
                
    expect(error).toBe(true);
  });

  test('it should throw and error when subtract a freezed vector', () => {
    const vector1 = new Vector(3, 4, 5);
    const vector2 = new Vector(6, 7, 8);
    vector1.freeze();
    let error = false;
                            
    try {
      vector1.subtract(vector2);
      error = false;
    } catch (err: any) {
      error = true;
                            
      expect(err.message).toBe('Cannot subtract a freezed vector');
    }
                            
    expect(error).toBe(true);
  });

  test('it should throw and error when dot a freezed vector', () => {
    const vector1 = new Vector(3, 4, 5);
    const vector2 = new Vector(6, 7, 8);
    vector1.freeze();
    let error = false;
                                        
    try {
      vector1.dot(vector2);
      error = false;
    } catch (err: any) {
      error = true;
                                        
      expect(err.message).toBe('Cannot dot a freezed vector');
    }
                                        
    expect(error).toBe(true);
  });

  test('it should throw and error when cross a freezed vector', () => {
    const vector1 = new Vector(3, 4, 5);
    const vector2 = new Vector(6, 7, 8);
    vector1.freeze();
    let error = false;
                                                    
    try {
      vector1.cross(vector2);
      error = false;
    } catch (err: any) {
      error = true;
                                                    
      expect(err.message).toBe('Cannot cross a freezed vector');
    }
                                                    
    expect(error).toBe(true);
  });

  test('it should throw and error when normalize a freezed vector2D', () => {
    const vector = new Vector2D(3, 4);
    vector.freeze();
    let error = false;
                                                        
    try {
      vector.normalize();
      error = false;
    } catch (err: any) {
      error = true;
                                                        
      expect(err.message).toBe('Cannot normalize a freezed vector');
    }
                                                        
    expect(error).toBe(true);
  });

  test('it should throw and error when magnitude a freezed vector2D', () => {
    const vector = new Vector2D(3, 4);
    vector.freeze();
    let error = false;
                                                                    
    try {
      vector.magnitude();
      error = false;
    } catch (err: any) {
      error = true;
                                                                    
      expect(err.message).toBe('Cannot get magnitude of a freezed vector');
    }
                                                                    
    expect(error).toBe(true);
  });

  test('it should throw and error when scale a freezed vector2D', () => {
    const vector = new Vector2D(3, 4);
    vector.freeze();
    let error = false;
                                                                                    
    try {
      vector.scale(2);
      error = false;
    } catch (err: any) {
      error = true;
                                                                                    
      expect(err.message).toBe('Cannot scale a freezed vector');
    }
                                                                                    
    expect(error).toBe(true);
  });

  test('it should throw and error when add a freezed vector2D', () => {
    const vector1 = new Vector2D(3, 4);
    const vector2 = new Vector2D(6, 7);
    vector1.freeze();
    let error = false;
                                                                                                    
    try {
      vector1.add(vector2);
      error = false;
    } catch (err: any) {
      error = true;
                                                                                                    
      expect(err.message).toBe('Cannot add a freezed vector');
    }
                                                                                                    
    expect(error).toBe(true);
  });

  test('it should throw and error when subtract a freezed vector2D', () => {
    const vector1 = new Vector2D(3, 4);
    const vector2 = new Vector2D(6, 7);
    vector1.freeze();
    let error = false;
                                                                                                                    
    try {
      vector1.subtract(vector2);
      error = false;
    } catch (err: any) {
      error = true;
                                                                                                                    
      expect(err.message).toBe('Cannot subtract a freezed vector');
    }
                                                                                                                    
    expect(error).toBe(true);
  });

  test('it should throw and error when dot a freezed vector2D', () => {
    const vector1 = new Vector2D(3, 4);
    const vector2 = new Vector2D(6, 7);
    vector1.freeze();
    let error = false;
                                                                                                                                    
    try {
      vector1.dot(vector2);
      error = false;
    } catch (err: any) {
      error = true;
                                                                                                                                    
      expect(err.message).toBe('Cannot dot a freezed vector');
    }
                                                                                                                                    
    expect(error).toBe(true);
  });

  test('it should throw and error when normalize a freezed vector2D', () => {
    const vector1 = new Vector2D(3, 4);
    vector1.freeze();
    let error = false;
                                                                                                                                                    
    try {
      vector1.normalize();
      error = false;
    } catch (err: any) {
      error = true;
                                                                                                                                                    
      expect(err.message).toBe('Cannot normalize a freezed vector');
    }
                                                                                                                                                    
    expect(error).toBe(true);
  });
});
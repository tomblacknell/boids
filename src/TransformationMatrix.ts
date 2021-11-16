export class TransformationMatrix {

  private values: number[];

  constructor() {
    // init to identity matrix
    this.values = [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ];
  }

  getValues(): number[] {
    return this.values;
  }

  setValues(values: number[]) {
    this.values = values;
  }

  setValue(index: number, value: number): void {
    this.values[index] = value;
  }

  translate(dx, dy): TransformationMatrix {
    var translateMatrix = new TransformationMatrix();
    translateMatrix.setValue(6, dx);
    translateMatrix.setValue(7, dy);
    return this.multiply(translateMatrix);
  }

  scale(sx, sy): TransformationMatrix {
    var scaleMatrix = new TransformationMatrix();
    scaleMatrix.setValue(0, sx);
    scaleMatrix.setValue(4, sy);
    return this.multiply(scaleMatrix);
  }

  rotate(angleInRadians: number): TransformationMatrix {
    var cos = Math.cos(angleInRadians);
    var sin = Math.sin(angleInRadians);
    var rotateMatrix = new TransformationMatrix();
    rotateMatrix.setValue(0, cos);
    rotateMatrix.setValue(1, -sin);
    rotateMatrix.setValue(3, sin);
    rotateMatrix.setValue(4, cos);
    return this.multiply(rotateMatrix);
  }

  project(width, height): TransformationMatrix {
    var projectMatrix = new TransformationMatrix();
    projectMatrix.setValues([
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1
    ]);
    return projectMatrix;
  }

  multiply(bMatrix: TransformationMatrix): TransformationMatrix {
    var a = this.values;
    var b = bMatrix.getValues();
    var result = new TransformationMatrix();
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
    result.setValues([
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ]);
    return result;
  }

}
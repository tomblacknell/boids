export class TransformationMatrix {

  private values: number[];

  constructor() {
    // init to identity matrix
    this.values = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
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

  translate(dx, dy, dz): TransformationMatrix {
    var translateMatrix = new TransformationMatrix();
    translateMatrix.setValue(12, dx);
    translateMatrix.setValue(13, dy);
    translateMatrix.setValue(14, dz);
    return this.multiply(translateMatrix);
  }

  scale(sx, sy, sz): TransformationMatrix {
    var scaleMatrix = new TransformationMatrix();
    scaleMatrix.setValue(0, sx);
    scaleMatrix.setValue(5, sy);
    scaleMatrix.setValue(10, sz);
    return this.multiply(scaleMatrix);
  }

  xRotate(angleInRadians: number): TransformationMatrix {
    var cos = Math.cos(angleInRadians);
    var sin = Math.sin(angleInRadians);
    var rotateMatrix = new TransformationMatrix();
    rotateMatrix.setValue(5, cos);
    rotateMatrix.setValue(6, sin);
    rotateMatrix.setValue(9, -sin);
    rotateMatrix.setValue(10, cos);
    return this.multiply(rotateMatrix);
  }

  yRotate(angleInRadians: number): TransformationMatrix {
    var cos = Math.cos(angleInRadians);
    var sin = Math.sin(angleInRadians);
    var rotateMatrix = new TransformationMatrix();
    rotateMatrix.setValue(0, cos);
    rotateMatrix.setValue(2, -sin);
    rotateMatrix.setValue(8, sin);
    rotateMatrix.setValue(10, cos);
    return this.multiply(rotateMatrix);
  }

  zRotate(angleInRadians: number): TransformationMatrix {
    var cos = Math.cos(angleInRadians);
    var sin = Math.sin(angleInRadians);
    var rotateMatrix = new TransformationMatrix();
    rotateMatrix.setValue(0, cos);
    rotateMatrix.setValue(1, sin);
    rotateMatrix.setValue(4, -sin);
    rotateMatrix.setValue(5, cos);
    return this.multiply(rotateMatrix);
  }

  project(left, right, bottom, top, near, far): TransformationMatrix {
    var projectMatrix = new TransformationMatrix();
    projectMatrix.setValues([
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0,
      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1,
    ]);
    return projectMatrix;
  }

  multiply(bMatrix: TransformationMatrix): TransformationMatrix {
    var a = this.values;
    var b = bMatrix.getValues();
    var result = new TransformationMatrix();
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    result.setValues([
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ]);
    return result;
  }

}
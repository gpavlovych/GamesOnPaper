export class HslToRgb {

  constructor() {
  }

  private static componentToHex(c: number): string {
    let hex = parseInt(c.toFixed(0)).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  private static rgbToHex(r: number, g: number, b: number): string {
    return "#" + HslToRgb.componentToHex(r) + HslToRgb.componentToHex(g) + HslToRgb.componentToHex(b);
  }


  static toRgb(hue: number, saturation: number, lightness: number): string {
    let c: number;
    c = 2 * lightness - 1;
    if (c < 0) {
      c = -c;
    }

    c = 1 - c;
    c = c * saturation;

    let x: number;
    x = hue / 60;
    x = x % 2;
    x = x - 1;
    if (x < 0) {
      x = -x;
    }

    x = (1 - x) * c;

    let m: number;
    m = lightness - c / 2;

    let r1: number;
    let g1: number;
    let b1: number;

    if (hue >= 0 && hue < 60) {
      r1 = c;
      g1 = x;
      b1 = 0;
    }

    if (hue >= 60 && hue < 120) {
      r1 = x;
      g1 = c;
      b1 = 0;
    }

    if (hue >= 120 && hue < 180) {
      r1 = 0;
      g1 = c;
      b1 = x;
    }

    if (hue >= 180 && hue < 240) {
      r1 = 0;
      g1 = x;
      b1 = c;
    }

    if (hue >= 240 && hue < 300) {
      r1 = x;
      g1 = 0;
      b1 = c;
    }

    if (hue >= 300 && hue < 360) {
      r1 = c;
      g1 = 0;
      b1 = x;
    }

    let r = (r1+m)*255;
    let g = (g1+m)*255;
    let b = (b1+m)*255;

    return HslToRgb.rgbToHex(r, g, b)
  }
}

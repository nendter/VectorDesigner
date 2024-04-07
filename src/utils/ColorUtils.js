export class ColorUtils{
    static rgbaToHex(r, g, b, a = 1) {
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));
        a = Math.max(0, Math.min(1, a));
        return "#" +
            (1 << 24 | r << 16 | g << 8 | b | a * 255 << 24).toString(16).slice(1, 7) +
            Math.floor(a * 255).toString(16).padStart(2, '0');
    }
    static hexToRgba(hex) {
        let r = 0, g = 0, b = 0, a = 1;
        if (hex.startsWith("#")) {
            hex = hex.slice(1);
        }
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6 || hex.length === 8) {
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
            if (hex.length === 8) {
                a = parseInt(hex.slice(6, 8), 16) / 255;
            }
        }
        return [ r/255, g/255, b/255, a ];
    }
}
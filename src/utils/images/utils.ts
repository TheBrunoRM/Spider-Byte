import { type SKRSContext2D, createCanvas, type Image, loadImage } from '@napi-rs/canvas';

export function drawCircularImage(ctx: SKRSContext2D, image: Image, x: number, y: number, width: number, height: number, radius = Math.min(width, height) / 2) {
    ctx.save();
    ctx.beginPath();
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();
}

export function roundedRect(ctx: SKRSContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

export function drawRotatedImage(ctx: SKRSContext2D, img: Image, x: number, y: number, width: number, height: number, angleDeg: number) {
    const rad = angleDeg * Math.PI / 180;
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(rad);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
}

export async function getPixelWithCanvas(srcPath: string, x: number, y: number) {
    const img = await loadImage(srcPath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
    return {
        r,
        g,
        b,
        a
    };
}

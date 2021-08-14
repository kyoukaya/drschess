export function arrow (ctx, startX, startY, endX, endY, controlPoints) {
    let dx = endX - startX;
    let dy = endY - startY;
    let len = Math.sqrt(dx * dx + dy * dy);
    let sin = dy / len;
    let cos = dx / len;
    let a = [];
    a.push(0, 0);
    for (let i = 0; i < controlPoints.length; i += 2) {
        let x = controlPoints[i];
        let y = controlPoints[i + 1];
        a.push(x < 0 ? len + x : x, y);
    }
    a.push(len, 0);
    for (let i = controlPoints.length; i > 0; i -= 2) {
        let x = controlPoints[i - 2];
        let y = controlPoints[i - 1];
        a.push(x < 0 ? len + x : x, -y);
    }
    a.push(0, 0);
    for (let i = 0; i < a.length; i += 2) {
        let x = a[i] * cos - a[i + 1] * sin + startX;
        let y = a[i] * sin + a[i + 1] * cos + startY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
};

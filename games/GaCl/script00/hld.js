// hld.js
// high level drawing
// Drawing utility functions

var hld = { };

hld.hslStr = function(hue, sat, lum)
{
	// Hue = 0 - 360
	// Sat = 0 - 100
	// Lum = 0 - 100
	return 'hsl(' + hue + ', ' + sat + '%, ' + lum + '%)';
}

hld.hslvStr = function(hsl)
{
	// Hue = 0 - 360
	// Sat = 0 - 100
	// Lum = 0 - 100
	return 'hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)';
}

hld.hslaStr = function(hue, sat, lum, alpha)
{
	// Hue = 0 - 360
	// Sat = 0 - 100
	// Lum = 0 - 100
	return 'hsla(' + hue + ', ' + sat + '%, ' + lum + '%, ' + alpha + ')';
}

hld.hslavStr = function(hsl, alpha)
{
	// Hue = 0 - 360
	// Sat = 0 - 100
	// Lum = 0 - 100
	return 'hsla(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%, ' + alpha + ')';
}

hld.lerpRGB = function(r1, g1, b1, r2, g2, b2, t)
{
	return 'rgb('
		+ Math.floor(mut.lerp(r1, r2, t)) + ','
		+ Math.floor(mut.lerp(g1, g2, t)) + ','
		+ Math.floor(mut.lerp(b1, b2, t)) + ')';
}

hld.roundRect = function (ctx, x, y, w, h, r) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	ctx.beginPath();
	ctx.moveTo(x+r, y);
	ctx.arcTo(x+w, y,   x+w, y+h, r);
	ctx.arcTo(x+w, y+h, x,   y+h, r);
	ctx.arcTo(x,   y+h, x,   y,   r);
	ctx.arcTo(x,   y,   x+w, y,   r);
	ctx.closePath();
	return ctx;
}

hld.dashedRect = function(ctx, x, y, w, h, d, c)
{
	ctx.beginPath();
//	var t = 2 * w + 2 * h;
	var s = c;
	for (; s < w; s += d)
	{
		ctx.moveTo(x + s, y);
		var e = s + d/2;
		if (e > w)
		{
			ctx.lineTo(x + w, y);
			ctx.lineTo(x + w, y + (e - w));
		}
		else
		{
			ctx.lineTo(x + e, y);
		}
	}
	s -= w;
	for (; s < h; s += d)
	{
		ctx.moveTo(x + w, y + s);
		var e = s + d/2;
		if (e > h)
		{
			ctx.lineTo(x + w, y + h);
			ctx.lineTo(x + w - (e - h), y + h);
		}
		else
		{
			ctx.lineTo(x + w, y + e);
		}
	}
	s -= h;
	for (; s < w; s += d)
	{
		ctx.moveTo(x + w - s, y + h);
		var e = s + d/2;
		if (e > w)
		{
			ctx.lineTo(x, y + h);
			ctx.lineTo(x, y + h - (e - w));
		}
		else
		{
			ctx.lineTo(x + w - e, y + h);
		}
	}
	s -= w;
	for (; s < h; s += d)
	{
		ctx.moveTo(x, y + h - s);
		var e = s + d/2;
		if (e > w)
		{
			ctx.lineTo(x, y);
			ctx.lineTo(x + (e - h), y);
		}
		else
		{
			ctx.lineTo(x, y + h - e);
		}
	}
	ctx.stroke();
}

hld.dashedPerpPoly = function(ctx, ll, d, c)
{
	// Draws a dashed polygon where the lines are on the x or y
	var s = c;
	if (s > (d / 2))
	{
		s -= d;
	}
	var st;
	var de = ll[0];
	ctx.beginPath();

	for (var i = 1; i <= ll.length; ++i)
	{
		st = de;
		de = ll[i % ll.length];

		var dx = de[0] - st[0];
		var dy = de[1] - st[1];
		var w = Math.abs(dx) + Math.abs(dy);
		// Normalize
		if (dx > 0.001)
		{
			dx = 1;
		}
		else if (dx < -0.001)
		{
			dx = -1;
		}
		if (dy > 0.001)
		{
			dy = 1;
		}
		else if (dy < -0.001)
		{
			dy = -1;
		}

		var done = false;
		while (!done)
		{
			if (s < 0)
			{
				ctx.moveTo(st[0], st[1]);
			}
			else
			{
				ctx.moveTo(st[0] + s * dx, st[1] + s * dy);
			}
			var e = s + d/2;
			if (e > w)
			{
				ctx.lineTo(st[0] + w * dx, st[1] + w * dy);
				done = true;
			}
			else
			{
				ctx.lineTo(st[0] + e * dx, st[1] + e * dy);
				s += d;
				if (s >= w)
				{
					done = true;
				}
			}
		}
		s -= w;
	}
	ctx.stroke();
}

hld.drawGridRect = function(ctx, x, y, w, h, bc, lc, lx, ly, lw, lh)
{
	ctx.fillStyle = bc;
	ctx.fillRect(x, y, w, h);

	ctx.strokeStyle = lc;

	var sx = lx - Math.floor(lx / lw) * lw;
	var sy = ly - Math.floor(ly / lh) * lw;

	ctx.beginPath();
	for (var gx = sx; gx < w; gx += lw)
	{
		ctx.moveTo(x + gx, y);
		ctx.lineTo(x + gx, y + h);
	}
	for (var gy = sy; gy < h; gy += lh)
	{
		ctx.moveTo(x, y + gy);
		ctx.lineTo(x + w, y + gy);
	}
	ctx.stroke();
}

hld.drawScrollbar = function(ctx, x, y, w, h, scrollPos, scrollWindow, scrollHeight, scrollCol, viewCol)
{
	if (scrollWindow > scrollHeight)
	{
		// Don't draw if you can see everything
		return;
	}
	// Fill in the background
	ssc.dc.fillStyle = scrollCol;
	hld.roundRect(ctx, x, y, w, h, w / 2).fill();

	var scrollProportionalStart = (scrollPos / scrollHeight) * h;
	var scrollProportionalEnd = ((scrollPos + scrollWindow)/ scrollHeight) * h;
	if (scrollProportionalEnd > h)
	{
		scrollProportionalEnd = h;
	}
	var scrollHeight = scrollProportionalEnd - scrollProportionalStart;
	ssc.dc.fillStyle = viewCol;
	hld.roundRect(ctx, x, y + scrollProportionalStart, w, scrollHeight, w / 2).fill();
}

var c_antiClockwise = false;
var c_leapTime = 0.6;
var c_subLeap1 = 0.2;
var c_subLeap2 = 0.4;

hld.drawLeap = function(ctx, x, y, w, h, sc, ti)
{
	var at;

	ti /= c_leapTime;
	if (ti > 1.0)
	{
		ti = 1.0;
	}

	if (ti < c_subLeap1)
	{
		at = 0.3 * (ti / c_subLeap1);
	}
	else if (ti < c_subLeap2)
	{
		at = 0.4 * ((ti - c_subLeap1) / (c_subLeap2 - c_subLeap1));
	}
	else
	{
		at = 1.0 * (ti - c_subLeap2) / (1.0 - c_subLeap2);
	}
	hld.drawLeap2(ctx, x, y, w, h, sc, at);
}

hld.drawLeap2 = function(ctx, x, y, w, h, sc, ti)
{
	var md = w;
	if (h > w)
	{
		md = h;
	}
	var r = md / 2 * sc * ti;

	var grd = ssc.dc.createRadialGradient(x, y, r / 8, x, y, r);
	grd.addColorStop(0, "hsla(300,90%,950%,0.8)");
	grd.addColorStop(0.3, "hsla(300,90%,70%,0.6)");
	grd.addColorStop(0.5, "hsla(300,90%,50%,0.5)");
	grd.addColorStop(1, "hsla(300,90%,20%,0.0)");
	ctx.fillStyle = grd;
	ctx.beginPath();
	ctx.arc(x - r, y - r, r, 0, Math.PI / 2, c_antiClockwise);
	ctx.arc(x - r, y + r, r, 3 * Math.PI / 2, 0, c_antiClockwise);
	ctx.arc(x + r, y + r, r, Math.PI, 3 * Math.PI / 2, c_antiClockwise);
	ctx.arc(x + r, y - r, r, Math.PI / 2, Math.PI, c_antiClockwise);
	ctx.fill();
}

hld.tileFitImage = function(ctx, img, x, y, rx, ry, rw, rh)
{
	var dx = x;
	var dy = y;
	var ix = 0;
	var iy = 0;
	var iw = img.width;
	var ih = img.height;
	if (x < rx)
	{
		ix = rx - x;
		dx = rx;
		iw -= ix;
	}
	if (y < ry)
	{
		iy = ry - y;
		dy = ry;
		ih -= iy;
	}
	if ((x + iw) > (rx + rw))
	{
		iw -= (x + iw) - (rx + rw);
	}
	if ((y + ih) > (ry + rh))
	{
		ih -= (y + ih) - (ry + rh);
	}

	ctx.drawImage(img,
		ix, iy, iw, ih,
		dx, dy, iw, ih);
}

hld.calculateScale = function(vw, vh, iw, ih)
{
	var sw = vw / iw;
	var sh = vh / ih;

	if (sw < sh)
	{
		return sw;
	}
	return sh;
}

// Hex drawing

hld.drawHex = function(ctx, r, col, th)
{
	ctx.strokeStyle = col;
	ctx.lineWidth = th;

	ctx.beginPath();
	ctx.moveTo(r[0] - r[2] / 2, r[1]);
	ctx.lineTo(r[0] - r[2] / 4, r[1] - r[3] / 2);
	ctx.lineTo(r[0] + r[2] / 4, r[1] - r[3] / 2);
	ctx.lineTo(r[0] + r[2] / 2, r[1]);
	ctx.lineTo(r[0] + r[2] / 4, r[1] + r[3] / 2);
	ctx.lineTo(r[0] - r[2] / 4, r[1] + r[3] / 2);
	ctx.closePath();
	ctx.stroke();
}

//var c_hexToShipBoxWidthProportion = 0.625;
var c_hexToShipBoxWidthProportion = 0.6;
var c_hexToShipBoxHeightProportion = 1 - (c_hexToShipBoxWidthProportion - 0.5) * 2;

hld.hexToShipRect = function(hr)
{
	var inset = 4;
	var srw = hr[2] * c_hexToShipBoxWidthProportion;
	var srh = hr[3] * c_hexToShipBoxHeightProportion;

	return [ hr[0] - srw / 2 + inset, hr[1] - srh / 2 + inset, srw - inset * 2, srh - inset * 2 ];
}

hld.inHex = function(px, py, r)
{
	if (px < (r[0] - r[2] / 2))						return false;
	if (px >= (r[0] + r[2] / 2))					return false;
	if (py < (r[1] - r[3] / 2))						return false;
	if (py >= (r[1] + r[3] / 2))					return false;

	if (px < (r[0] - (r[3] / 4)))
	{
		if (py < r[1])
		{
			var a = r[0] - r[2] / 2;
			var b = r[1];
			var c = r[0] - r[2] / 4;
			var d = r[1] - r[3] / 2;
			var cy = b + (px - a) * (d - b) / (c - a);
			return (py >= cy);
		}
		else
		{
			var a = r[0] - r[2] / 2;
			var b = r[1];
			var c = r[0] - r[2] / 4;
			var d = r[1] + r[3] / 2;
			var cy = b + (px - a) * (d - b) / (c - a);
			return (py <= cy);
		}
	}
	else if (px >= (r[0] + (r[3] / 4)))
	{
		if (py < r[1])
		{
			var a = r[0] + r[2] / 4;
			var b = r[1] - r[3] / 2;
			var c = r[0] + r[2] / 2;
			var d = r[1];
			var cy = b + (px - a) * (d - b) / (c - a);
			return (py >= cy);
		}
		else
		{
			var a = r[0] + r[2] / 4;
			var b = r[1] + r[3] / 2;
			var c = r[0] + r[2] / 2;
			var d = r[1];
			var cy = b + (px - a) * (d - b) / (c - a);
			return (py <= cy);
		}
	}
	else
	{
		return true;
	}
}

hld.setFont = function(ctx, pxs, align, fillCol)
{
	ctx.font = pxs + "px " + c_baseFont;
	ctx.textAlign = align;
	ctx.fillStyle = fillCol;
}

hld.outineText = function(ctx, text, x, y, fontPxs, align, edgeWidth, edgeColor, fillColor)
{
	ctx.translate(x, y);
	ctx.scale(0.25, 0.25);

	hld.setFont(ctx, fontPxs * 4, align, fillColor);

	ctx.strokeStyle = edgeColor;
	ctx.lineWidth = edgeWidth;
	ctx.lineJoin = "miter"; //Experiment with "bevel" & "round" for the effect you want!
	ctx.miterLimit = 2;
	ctx.strokeText(text, 0, 0);
	ctx.fillText(text, 0, 0);

	ctx.setTransform(1, 0, 0, 1, 0, 0);
}

hld.dashLine = function (ctx, x1, y1, x2, y2, dashLen)
{
	ctx.moveTo(x1, y1);

	var dX = x2 - x1;
	var dY = y2 - y1;
	var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
	var dashX = dX / dashes;
	var dashY = dY / dashes;

	var q = 0;
	while (q++ < dashes)
	{
		x1 += dashX;
		y1 += dashY;
		if (q % 2 == 0)
		{
			ctx.moveTo(x1, y1);
		}
		else
		{
			ctx.lineTo(x1, y1);
		}
	}
	if (q % 2 == 0)
	{
		ctx.moveTo(x1, y1);
	}
	else
	{
		ctx.lineTo(x1, y1);
	}
};

/*
hld.drawHex = function(ctx, x, y, w, h, col, th)
{
	ctx.strokeStyle = col;
	ctx.lineWidth = th;

	ctx.beginPath();
	ctx.moveTo(x, y - h / 2);
	ctx.lineTo(x + w / 2, y - h / 4);
	ctx.lineTo(x + w / 2, y + h / 4);
	ctx.lineTo(x, y + h / 2);
	ctx.lineTo(x - w / 2, y + h / 4);
	ctx.lineTo(x - w / 2, y - h / 4);
	ctx.closePath();
	ctx.stroke();
}

var c_hexToShipBoxWidthProportion = 0.625;
var c_hexToShipBoxHeightProportion = 1 - c_hexToShipBoxWidthProportion * 0.5;

hld.hexToShipRect = function(hr)
{
	var srw = hr[2] * c_hexToShipBoxWidthProportion;
	var srh = hr[3] * c_hexToShipBoxHeightProportion;

	return [ hr[0] - srw / 2, hr[1] - srh / 2, srw, srh ];
}

hld.inHex = function(px, py, x, y, w, h)
{
	if (px < x)					return false;
	if (px >= (x + w))			return false;
	if (py < y)					return false;
	if (py >= (y + h))			return false;

	if (py < (x - (h * 0.25)))
	{
	}
	else if (py >= (x + (h * 0.25)))
	{

	}
	else
	{
		return true;
	}
}
*/

var global = Function('return this')();

(function(){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    // The base Class implementation (does nothing)
    this.Class = function(){};

    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    return function() {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if ( !initializing && this.construct )
                this.construct.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();

// Converts from degrees to radians.
Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
	return radians * 180 / Math.PI;
};

var mut = { };

mut.inRect = function(x, y, rx, ry, rw, rh)
{
	if (x < rx)			return false;
	if (x > (rx + rw))	return false;
	if (y < ry)			return false;
	if (y > (ry + rh))	return false;

	return true;
}

mut.inRectR = function(x, y, r)
{
	if (x < r[0])			return false;
	if (x > (r[0] + r[2]))	return false;
	if (y < r[1])			return false;
	if (y > (r[1] + r[3]))	return false;

	return true;
}

mut.lerp = function(s, e, t)
{
	return s + (e - s) * t;
}

mut.timeCycle = function(t, p)
{
	return (1 + Math.sin(2 *Math.PI * ((t % p) / p))) / 2;
}

mut.wrapText = function(context, text, x, y, maxWidth, maxHeight, lineHeight, lineStart)
{
	if (text == null)
	{
		return;
	}
	var sl = text.split("\n");
	var cy = y;
	for (var li = 0; li < sl.length; ++li)
	{
		var sw = sl[li].split(" ");
		var cw = context.measureText(sw[0]).width;
		var cl = sw[0];
		for (var i = 1; i < sw.length; ++i)
		{
			var wordWidth = context.measureText(" " + sw[i]).width;
			if ((cw + wordWidth) > maxWidth)
			{
				if (lineStart <= 0)
				{
					context.fillText(cl, x, cy);
					cy += lineHeight;
				}
				--lineStart;
				cl = sw[i];
				cw = context.measureText(sw[i]).width;
				if (cy > maxHeight)
				{
					return;
				}
			}
			else
			{
				cl += " " + sw[i];
				cw += wordWidth;
			}
		}
		if (lineStart <= 0)
		{
			context.fillText(cl, x, cy);
			cy += lineHeight;
		}
		--lineStart;
		if (cy > maxHeight)
		{
			return;
		}
	}
}

mut.numLines = function(context, text, maxWidth)
{
	if (text == null)
	{
		return 0;
	}
	var nl = 0;
	var sl = text.split("\n");
	for (var li = 0; li < sl.length; ++li)
	{
		var sw = sl[li].split(" ");
		var cw = context.measureText(sw[0]).width;
		var cl = sw[0];
		for (var i = 1; i < sw.length; ++i)
		{
			var wordWidth = context.measureText(" " + sw[i]).width;
			if ((cw + wordWidth) > maxWidth)
			{
				++nl;
				cl = sw[i];
				cw = context.measureText(sw[i]).width;
			}
			else
			{
				cl += " " + sw[i];
				cw += wordWidth;
			}
		}
		++nl;
	}
	return nl;
}

mut.encodeInt = function(n)
{
	// Encodes 0 to 63 as '0','1',...'9','A','B',...'Z','a','b'...'z','#','@'
	if (n < 0)
	{
		console.log("Bad value into encode");
	}
	if (n < 10)
	{
		// 48 = '0'
		return String.fromCharCode(48 + n);
	}
	if (n < 36)
	{
		// 65 = 'A'
		return String.fromCharCode(65 + n - 10);
	}
	if (n < 62)
	{
		// 97 = 'a'
		return String.fromCharCode(97 + n - 36);
	}
	if (n == 62)
	{
		return "#";
	}
	if (n == 63)
	{
		return "@";
	}
}

mut.encodeLargeInt = function(n, l)
{
	var str = "";
	for (var i = 0; i < l; ++i)
	{
		var d = n % 64;
		n = Math.floor(n / 64);
		str = this.encodeInt(d) + str;
	}
	return str;
}

mut.encodeW = function(n)
{
	return mut.encodeInt(n);
}

mut.encodeD = function(n)
{
	return mut.encodeLargeInt(n, 2);
}

mut.intWithCommas = function(i)
{
	return Math.floor(i).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

mut.floatWithCommas = function(f)
{
	var parts = f.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
}

mut.fixedWithCommas = function(f, n)
{
	var parts = f.toFixed(n).split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
}

mut.toPercent = function(f)
{
	var bh = Math.floor(f * 100);
	var bd = Math.floor(f * 1000) - bh * 10;
	return bh + "." + bd + "%";
}

mut.hmsTime = function(sec)
{
	var str = "";
	var display = false;
	if (sec > 3600)
	{
		str += Math.floor(sec / 3600) + ":";
		sec = sec % 3600;
		display = true;
	}
	if ((sec > 60) || (display))
	{
		var min = Math.floor(sec / 60);
		if ((display) && (min < 10))
		{
			str += "0" + min + ":";
		}
		else
		{
			str += min + ":";
		}
		sec = sec % 60;
	}
	if (sec < 10)
	{
		str += "0" + sec;
	}
	else
	{
		str += sec;
	}

	return str;
}

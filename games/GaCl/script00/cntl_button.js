// button.js

buttonDrawEnum = {
	empty : 0,
	roundRect : 1,
	image : 2
};

var CntlButton = CControl.extend({
	init : function(x, y, width, height, col, fn, obj)
	{
		this._super();
		this.m_px = x;
		this.m_py = y;
		this.m_width = width;
		this.m_height = height;
		this.m_col = col;

		this.m_fn = fn;
		this.m_obj = obj;
		this.m_textEntries = [ ];

		this.m_hilite = false;
		this.m_selected = false;

		this.m_visible = true;
		this.m_active = true;

		this.m_notification = false;

		this.m_buttonDraw = buttonDrawEnum.roundRect;
	},
	addText : function(text, fontDesc, textColor, invTextColor, tx, ty, textAlign)
	{
		var textEntry = {
			m_text : text,
			m_fontDesc : fontDesc,
			m_textColor : textColor,
			m_invTextColor : invTextColor,
			m_textX : tx,
			m_textY : ty,
			m_textAlign : textAlign
		};
		this.m_textEntries.push(textEntry);
	},
	addNotification : function(text, fontDesc, backColor, textColor)
	{
		this.m_notification = true;
		this.m_notificationText = text;
		this.m_notificationFontDesc = fontDesc;
		this.m_notificationBackColor = backColor;
		this.m_notificationTextColor = textColor;
	},
	setImageButton : function(buttonImage, hiliteImage)
	{
		this.m_buttonDraw = buttonDrawEnum.image;
		this.m_buttonImage = buttonImage;
		this.m_hiliteImage = hiliteImage;
		this.m_fixedImageScale = null;
	},
	controlTypeId : function()
	{
		return controlEnum.button;
	},
	render : function()
	{
		if (!this.m_visible)
		{
			return;
		}
		if (this.m_hilite)
		{
			this.renderHilite();
		}
		else
		{
			this.renderNormal();
		}
		// Draw the notification
		if (this.m_notification)
		{
			eng.dc.beginPath();
			eng.dc.fillStyle = this.m_notificationBackColor;
			var r = this.m_width / 6;
			var tx;

			if (this.m_notificationText.length == 1)
			{
				eng.dc.arc(this.m_px + this.m_width, this.m_py, r, 0, Math.PI * 2.0, false);
				eng.dc.fill();
				tx = this.m_px + this.m_width;
			}
			else
			{
				var w = (this.m_notificationText.length + 0.5) * r;
				hld.roundRect(eng.dc, this.m_px + this.m_width - w + r,  this.m_py - r, w, r * 2, r).fill();
				tx = this.m_px + this.m_width - w / 2 + r;
			}

			hld.setFont(eng.dc, this.m_notificationFontDesc, c_textAlignCenter, this.m_notificationTextColor);
			eng.dc.fillText(this.m_notificationText, tx, this.m_py + r * 0.65);
		}
	},
	renderHilite : function()
	{
		switch (this.m_buttonDraw)
		{
			case buttonDrawEnum.empty:
				break;
			case buttonDrawEnum.roundRect:
				eng.dc.fillStyle = this.m_col;
				hld.roundRect(eng.dc, this.m_px, this.m_py, this.m_width, this.m_height, 10).fill();
				break;
			case buttonDrawEnum.image:
				if (this.m_col != null)
				{
					eng.dc.fillStyle = this.m_col;
					hld.roundRect(eng.dc, this.m_px, this.m_py, this.m_width, this.m_height, 10).fill();
				}
				if (this.m_fixedImageScale != null)
				{
					var sw = this.m_hiliteImage.width * this.m_fixedImageScale;
					var sh = this.m_hiliteImage.height * this.m_fixedImageScale;
					var ix = this.m_px + (this.m_width - sw) / 2;
					var iy = this.m_py + (this.m_height - sh) / 2;

					eng.dc.drawImage(this.m_hiliteImage,
						0, 0, this.m_hiliteImage.width, this.m_hiliteImage.height,
						ix, iy, sw, sh);
				}
				else
				{
					eng.dc.drawImage(this.m_hiliteImage,
						0, 0, this.m_hiliteImage.width, this.m_hiliteImage.height,
						this.m_px, this.m_py, this.m_width, this.m_height);
				}
				break;
		}
		for (var i = 0; i < this.m_textEntries.length; ++i)
		{
			if (this.m_textEntries[i].m_text != null)
			{
				hld.setFont(eng.dc, this.m_textEntries[i].m_fontDesc, this.m_textEntries[i].m_textAlign, this.m_textEntries[i].m_invTextColor);
				eng.dc.fillText(this.m_textEntries[i].m_text,
						this.m_px + this.m_textEntries[i].m_textX, this.m_py + this.m_textEntries[i].m_textY);
			}
		}
	},
	renderNormal : function()
	{
		switch (this.m_buttonDraw)
		{
			case buttonDrawEnum.empty:
				break;
			case buttonDrawEnum.roundRect:
				if (this.m_fillCol != null)
				{
					eng.dc.fillStyle = this.m_fillCol;
					hld.roundRect(eng.dc, this.m_px, this.m_py, this.m_width, this.m_height, 10).fill();
				}
				eng.dc.lineWidth = 2;
				eng.dc.strokeStyle = this.m_col;
				hld.roundRect(eng.dc, this.m_px, this.m_py, this.m_width, this.m_height, 10).stroke();
				eng.dc.lineWidth = 1;
				break;
			case buttonDrawEnum.image:
				if (this.m_col != null)
				{
					if (this.m_fillCol != null)
					{
						eng.dc.fillStyle = this.m_fillCol;
						hld.roundRect(eng.dc, this.m_px, this.m_py, this.m_width, this.m_height, 10).fill();
					}
					eng.dc.strokeStyle = this.m_col;
					eng.dc.lineWidth = 2;
					hld.roundRect(eng.dc, this.m_px, this.m_py, this.m_width, this.m_height, 10).stroke();
					eng.dc.lineWidth = 1;
				}
				if (this.m_fixedImageScale != null)
				{
					var sw = this.m_buttonImage.width * this.m_fixedImageScale;
					var sh = this.m_buttonImage.height * this.m_fixedImageScale;
					var ix = this.m_px + (this.m_width - sw) / 2;
					var iy = this.m_py + (this.m_height - sh) / 2;

					eng.dc.drawImage(this.m_buttonImage,
						0, 0, this.m_buttonImage.width, this.m_buttonImage.height,
						ix, iy, sw, sh);
				}
				else
				{
					eng.dc.drawImage(this.m_buttonImage,
						0, 0, this.m_buttonImage.width, this.m_buttonImage.height,
						this.m_px, this.m_py, this.m_width, this.m_height);
				}

				break;
			case buttonDrawEnum.rectColor:
				if (this.m_fillCol != null)
				{
					eng.dc.fillStyle = this.m_fillCol;
					hld.roundRect(eng.dc, this.m_px, this.m_py, this.m_width, this.m_height, 10).fill();
				}
				eng.dc.strokeStyle = this.m_col;
				eng.dc.lineWidth = 2;
				hld.roundRect(eng.dc, this.m_px, this.m_py, this.m_width, this.m_height, 10).stroke();
				eng.dc.lineWidth = 1;
				eng.dc.fillStyle = this.m_rectColor;
				hld.roundRect(eng.dc, this.m_px + this.m_width / 4, this.m_py + this.m_width / 4,
					this.m_width / 2, this.m_height / 2, 10).fill();
				break;
			case buttonDrawEnum.imageArray:
				if (this.m_col != null)
				{
					if (this.m_fillCol != null)
					{
						eng.dc.fillStyle = this.m_fillCol;
						hld.roundRect(eng.dc, this.m_px, this.m_py, this.m_width, this.m_height, 10).fill();
					}
					eng.dc.strokeStyle = this.m_col;
					eng.dc.lineWidth = 2;
					hld.roundRect(eng.dc, this.m_px, this.m_py, this.m_width, this.m_height, 10).stroke();
					eng.dc.lineWidth = 1;
				}
				for (var i = 0; i < this.m_buttonImage.length; ++i)
				{
					eng.dc.drawImage(this.m_buttonImage[i],
						0, 0, this.m_buttonImage[i].width, this.m_buttonImage[i].height,
						this.m_px, this.m_py, this.m_width, this.m_height);
				}
				break;
		}
		for (var i = 0; i < this.m_textEntries.length; ++i)
		{
			if (this.m_textEntries[i].m_text != null)
			{
				hld.setFont(eng.dc, this.m_textEntries[i].m_fontDesc, this.m_textEntries[i].m_textAlign, this.m_textEntries[i].m_textColor);
				eng.dc.fillText(this.m_textEntries[i].m_text,
						this.m_px + this.m_textEntries[i].m_textX, this.m_py + this.m_textEntries[i].m_textY);
			}
		}
	},
	touchDown : function(mx, my)
	{
		if (!this.m_visible)
		{
			return null;
		}
		if (!this.m_active)
		{
			return null;
		}
		if (mut.inRect(mx, my, this.m_px, this.m_py, this.m_width, this.m_height))
		{
			this.m_hilite = true;
			return this;
		}
		return null;
	},
	touchDrag : function(mx, my)
	{
		if (mut.inRect(mx, my, this.m_px, this.m_py, this.m_width, this.m_height))
		{
			this.m_hilite = true;
		}
		else
		{
			this.m_hilite = false;
		}
	},
	touchUp : function(mx, my)
	{
		if (mut.inRect(mx, my, this.m_px, this.m_py, this.m_width, this.m_height))
		{
			if (this.m_fn != null)
			{
//				this.m_fn.call(this.m_obj, this);
				this.m_obj[this.m_fn].call(this.m_obj, this);
			}
		}
		this.m_hilite = false;
	}
});

function buttonHelper(str, fn, obj, x, y, s)
{
	var ds = uiScaleFactor * 2;
	if (s != null)
	{
		ds = s;
	}
	var button = new CntlButton();
	button.init(x, y, ds, ds, c_colWhite, fn, obj);
	button.setImageButton(eng.getImage("ui", str), eng.getImage("ui", str + "_h"));
	return button;
}

// control_list.js

controlEnum =
{
	undefined : -1,
	button : 0,
	textEdit : 1,
	list : 2
};

var CControl = Class.extend({
	init : function()
	{
		this.m_popUp = false;
	},
	controlTypeId : function()
	{
		return controlEnum.undefined;
	},
	tabSelect : function()
	{
		return false;
	},
	render : function()
	{
	},
	touchDown : function(mx, my)
	{
	},
	touchDrag : function(mx, my)
	{
	},
	touchUp : function(mx, my)
	{
	},
	releaseSelectionOnMouseUp : function()
	{
		return true;
	}
});

var CntlGroup = Class.extend({
	init : function()
	{
		this.m_controls = [ ];
		this.m_selectedControl = null;
	},
	addControl : function(con)
	{
		var nLocation = this.m_controls.indexOf(con);
		if (nLocation == -1)
		{
			this.m_controls.push(con);
		}
	},
	removeControl : function(con)
	{
		var nLocation = this.m_controls.indexOf(con);
		if (nLocation != -1)
		{
			this.m_controls.splice(nLocation, 1);
		}
	},
	clear : function()
	{
		this.m_controls = [ ];
		this.m_selectedControl = null;
	},
	numControls : function()
	{
		return this.m_controls.length;
	},
	get : function(ind)
	{
		return this.m_controls[ind];
	},
	selectControl : function(control)
	{
		if (this.m_selectedControl != null)
		{
			this.m_selectedControl.m_selected = false;
		}
		this.m_selectedControl = control;
		this.m_selectedControl.m_selected = true;
	},
	render : function()
	{
		eng.dc.setTransform(1, 0, 0, 1, 0, 0);
		for (var i = 0; i < this.m_controls.length; ++i)
		{
			this.m_controls[i].render();
		}
	},
	touchDown : function(mx, my)
	{
		// text fields
		if (this.m_selectedControl != null)
		{
			this.m_selectedControl.m_selected = false;
		}
		this.m_selectedControl = null;
		for (var i = 0; i < this.m_controls.length; ++i)
		{
			this.m_selectedControl = this.m_controls[i].touchDown(mx, my);
			if (this.m_selectedControl != null)
			{
				this.clearPopups();
				return true;
			}
		}
		this.clearPopups();
		return false;
	},
	clearPopups : function()
	{
		var i = 0;
		while (i < this.m_controls.length)
		{
			if ((this.m_controls[i].m_popUp) && (this.m_selectedControl != this.m_controls[i]))
			{
				this.m_controls.splice(i, 1);
			}
			else
			{
				++i;
			}
		}
	},
	touchDrag : function(mx, my)
	{
		if (this.m_selectedControl != null)
		{
			this.m_selectedControl.touchDrag(mx, my);
			return true;
		}
		return false;
	},
	touchUp : function(mx, my)
	{
		if (this.m_selectedControl != null)
		{
			this.m_selectedControl.touchUp(mx, my);
			if (this.m_selectedControl.releaseSelectionOnMouseUp())
			{
				this.m_selectedControl = null;
			}
			return true;
		}
		return false;
	},
	touchCancel : function()
	{
		if (this.m_selectedControl != null)
		{
			this.m_selectedControl.m_hilite = false;
			this.m_selectedControl = null;
			return true;
		}
		return false;
	}
});


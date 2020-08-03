var c_distStepSize = 4;

var CInput = Class.extend({
	init : function()
	{
		this.m_keyDown = {};

		this.m_mouseLeft = false;
		this.m_mouseRight = false;
		this.m_mouseMiddle = false;
		this.m_prevMouseLeft = false;
		this.m_prevMouseRight = false;
		this.m_prevMouseMiddle = false;
		this.m_mouseLeftUpDown = false;
		this.m_mouseRightUpDown = false;
		this.m_mouseMiddleUpDown = false;
		this.m_mouseX = null;
		this.m_mouseY = null;
		this.m_shiftDown = false;

		this.m_wheelDelta = 0;
	},
	// keyboard input
	handleKeyDown : function(event)
	{
		this.m_keyDown[event.keyCode] = true;
	},
	handleKeyUp : function(event)
	{
		this.m_keyDown[event.keyCode] = false;
	},
	// mouse input
	handleMouseDown : function(event)
	{
		this.m_mouseX = event.clientX;
		this.m_mouseY = event.clientY;
		this.m_shiftDown = event.shiftKey;
		switch (event.which)
		{
			case 1:
				this.m_mouseLeft = true;
				break;
			case 2:
				this.m_mouseMiddle = true;
				break;
			case 3:
				this.m_mouseRight = true;
				break;
		}
	},
	handleMouseUp : function(event)
	{
		this.m_mouseX = event.clientX;
		this.m_mouseY = event.clientY;
		switch (event.which)
		{
			case 1:
				if (this.m_mouseLeft && !this.m_prevMouseLeft)
				{
					// Special case where the mouse button goes up and down before the update occurs
					this.m_mouseLeftUpDown = true;
				}
				this.m_mouseLeft = false;
				break;
			case 2:
				if (this.m_mouseMiddle && !this.m_prevMouseMiddle)
				{
					// Special case where the mouse button goes up and down before the update occurs
					this.m_mouseMiddleUpDown = true;
				}
				this.m_mouseMiddle = false;
				break;
			case 3:
				if (this.m_mouseRight && !this.m_prevMouseRight)
				{
					// Special case where the mouse button goes up and down before the update occurs
					this.m_mouseRightUpDown = true;
				}
				this.m_mouseRight = false;
				break;
		}
	},
	handleMouseMove : function(event)
	{
		this.m_mouseX = event.clientX;
		this.m_mouseY = event.clientY;
	},
	handleMouseWheel : function (event)
	{
		var delta = 0;
		if (!event) /* For IE. */
			event = window.event;
		if (event.wheelDelta) { /* IE/Opera. */
			delta = event.wheelDelta/120;
		} else if (event.detail) { /** Mozilla case. */
			/** In Mozilla, sign of delta is different than in IE.
			 * Also, delta is multiple of 3.
			 */
			delta = -event.detail/3;
		}
		this.m_wheelDelta += delta;
		/** Prevent default actions caused by mouse wheel.
		 * That might be ugly, but we handle scrolls somehow
		 * anyway, so don't bother here..
		 */
		if (event.preventDefault)
			event.preventDefault();
	},
	// touch input
	// for now, treat it just like the mouse
	handleTouchStart : function(event)
	{
		if (event.touches.length == 1)
		{
			this.m_mouseX = event.touches[0].clientX;
			this.m_mouseY = event.touches[0].clientY;
			this.m_shiftDown = false;
			this.m_mouseLeft = true;
			this.m_twoClick = false;
		}
		else if (event.touches.length == 2)
		{
			// We're entering zoom or rotate mode
			this.m_twoClick = true;
			this.m_mouseLeft = false;
			var dx = event.touches[0].clientX - event.touches[1].clientX;
			var dy = event.touches[0].clientY - event.touches[1].clientY;
			this.m_orDist = Math.sqrt((dx * dx) + (dy * dy));
		}
		else
		{
			this.m_twoClick = false;
		}
	},
	handleTouchEnd : function(event)
	{
		if (this.m_twoClick)
		{
			if (event.touches.length < 2)
			{
				this.m_twoClick = false;
			}
		}
		else
		{
//			this.m_mouseX = event.touches[0].clientX;
//			this.m_mouseY = event.touches[0].clientY;
			if (this.m_mouseLeft && !this.m_prevMouseLeft)
			{
				// Special case where the mouse button goes up and down before the update occurs
				this.m_mouseLeftUpDown = true;
			}
			this.m_mouseLeft = false;
		}
	},
	handleTouchMove : function(event)
	{
		if (this.m_twoClick)
		{
			var dx = event.touches[0].clientX - event.touches[1].clientX;
			var dy = event.touches[0].clientY - event.touches[1].clientY;
			var newDistSqr = Math.sqrt((dx * dx) + (dy * dy));
			var distDelta = newDistSqr - this.m_orDist;
			var distDeltaStep = Math.floor(distDelta / c_distStepSize);
			this.m_orDist += distDeltaStep * c_distStepSize;
			this.m_wheelDelta = distDeltaStep;
		}
		else
		{
			this.m_mouseX = event.touches[0].clientX;
			this.m_mouseY = event.touches[0].clientY;
		}
	},
	// Update
	inputHandler : function(elapsed)
	{
		// This is called before the pre-sim update to send input messages
		// This way we have a good idea exactly when they happen
		if (this.m_twoClick)
		{
			if (this.m_prevMouseLeft)
			{
				eng.touchCancel();
				this.m_prevMouseLeft = false;
			}
		}
		else
		{
			// Left button
			if (this.m_mouseLeftUpDown)
			{
				eng.leftMouseButtonDown(this.m_mouseX, this.m_mouseY, this.m_shiftDown);
				eng.leftMouseButtonUp(this.m_mouseX, this.m_mouseY);
				this.m_mouseLeftUpDown = false;
			}
			else
			{
				if (this.m_mouseLeft)
				{
					if (!this.m_prevMouseLeft)
					{
						eng.leftMouseButtonDown(this.m_mouseX, this.m_mouseY, this.m_shiftDown);
					}
					else
					{
						eng.leftMouseButtonHold(this.m_mouseX, this.m_mouseY);
					}
				}
				else
				{
					if (this.m_prevMouseLeft)
					{
						eng.leftMouseButtonUp(this.m_mouseX, this.m_mouseY);
					}
				}
				this.m_prevMouseLeft = this.m_mouseLeft;
			}
		}
		// Right button
		if (this.m_mouseRightUpDown)
		{
			eng.rightMouseButtonDown(this.m_mouseX, this.m_mouseY, this.m_shiftDown);
			eng.rightMouseButtonUp(this.m_mouseX, this.m_mouseY);
			this.m_mouseRightUpDown = false;
		}
		else
		{
			if (this.m_mouseRight)
			{
				if (!this.m_prevMouseRight)
				{
					eng.rightMouseButtonDown(this.m_mouseX, this.m_mouseY, this.m_shiftDown);
				}
				else
				{
					eng.rightMouseButtonHold(this.m_mouseX, this.m_mouseY);
				}
			}
			else
			{
				if (this.m_prevMouseRight)
				{
					eng.rightMouseButtonUp(this.m_mouseX, this.m_mouseY);
				}
			}
			this.m_prevMouseRight = this.m_mouseRight;
		}
		// Mouse wheel
		if (this.m_wheelDelta != 0)
		{
			eng.mouseWheel(this.m_mouseX, this.m_mouseY, this.m_wheelDelta);
			this.m_wheelDelta = 0;
		}
	}
});


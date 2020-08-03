window.onload = init;

var c_appName = "ssc";
var c_nFPS = 30;
var c_maxElapsedTime = (1.0 / 15);
var c_angleFactor = 0.01;
var c_scaleFactor = -0.01;

var c_colBlack = "rgb(0,0,0)";
var c_colWhite = "rgb(255,255,255)";
var c_colGray =  "rgb(128,128,128)";
var c_colDarkGray =  "rgb(64,64,64)";

var c_textAlignLeft = "left";
var c_textAlignCenter = "center";
var c_textAlignRight = "right";

var c_baseFont = "leaguegothic-regular-webfont";
var c_titlePxs = 36;
var c_largePxs = 28;
var c_mediumPxs = 22;
var c_smallPxs = 18;

var eng = null;
var imageLoc = null;
var gameDiv = null;
var mainCanvas = null;

function init()
{
	gameDiv = document.getElementById('contentdiv');		// parent
	mainCanvas = document.getElementById('main_canvas');
	mainCanvas.width = gameDiv.clientWidth;			//gameDiv.innerWidth;
	mainCanvas.height = gameDiv.clientHeight;		//gameDiv.innerHeight;

	eng = new CEngine();
	eng.init();
	setInterval(update, 1000 / c_nFPS);

	mainCanvas.addEventListener('mousedown', function(event) { eng.m_inputMgr.handleMouseDown(event); }, false);
	mainCanvas.addEventListener('mouseup', function(event) { eng.m_inputMgr.handleMouseUp(event); }, false);
	mainCanvas.addEventListener('mousemove', function(event) { eng.m_inputMgr.handleMouseMove(event); }, false);
	mainCanvas.addEventListener('mousewheel', function(event) { eng.m_inputMgr.handleMouseWheel(event); }, false);

	mainCanvas.addEventListener('touchstart', function(event) { eng.m_inputMgr.handleTouchStart(event); }, false);
	mainCanvas.addEventListener('touchend', function(event) { eng.m_inputMgr.handleTouchEnd(event); }, false);
	mainCanvas.addEventListener('touchmove', function(event) { eng.m_inputMgr.handleTouchMove(event); }, false);

	// No necessary on the tablet.  This fixes the problem of the whole canvas becoming selected
	// when double clicked (which is how we expand the lore image)
	mainCanvas.onselectstart = function() { return false; };
	mainCanvas.style.MozUserSelect = "none";
	mainCanvas.style.KhtmlUserSelect = "none";
	mainCanvas.unselectable = "on";
}

function update()
{
	eng.systemUpdate();
}

var CEngine = Class.extend({
    init : function()
    {
		imageLoc = "images/";

        this.m_lastTime = 0;
        this.m_gameTime = 0;
		this.m_realTime = 0;
		this.m_realElapsed = 0;

        this.canvas = mainCanvas;
        this.dc = this.canvas.getContext('2d');

		this.m_inputMgr = new CInput();
		this.m_inputMgr.init();

		this.m_gameWidth = this.canvas.width;
		this.m_gameHeight = this.canvas.height;		// No longer remove space for ads

		this.m_gacl = new CGaCl();
	},
	resize : function()
	{
		this.m_currentMode.resize();
	},
    systemUpdate : function()
    {
        var timeNow = new Date().getTime();
        if (this.m_lastTime == 0)
        {
            // Skip the first entry
            this.m_lastTime = timeNow;
            return;
        }
        var elapsed = ((timeNow - this.m_lastTime) / 1000);			// Convert miliseconds to seconds
		this.m_realElapsed = elapsed;
		this.m_realTime += this.m_realElapsed;
        // Never do more then a double jump
        if (elapsed > c_maxElapsedTime)
        {
            elapsed = c_maxElapsedTime;
        }

        this.m_gameTime += elapsed;

        this.update(elapsed);

        this.m_lastTime = timeNow;
    },
    update : function(elapsed)
    {
		this.m_inputMgr.inputHandler(elapsed);
		this.m_gacl.update(elapsed);
		this.m_gacl.render();
    },
	leftMouseButtonDown : function(mx, my)
    {
		this.m_gacl.touchDown(mx, my);
    },
	leftMouseButtonHold : function(mx, my)
	{
		this.m_gacl.touchDrag(mx, my);
	},
	leftMouseButtonUp : function(mx, my)
    {
		this.m_gacl.touchUp(mx, my);
    },
	touchCancel : function()
	{
	},
	rightMouseButtonDown : function(mx, my)
	{
	},
	rightMouseButtonHold : function(mx, my)
	{
	},
	rightMouseButtonUp : function(mx, my)
	{
	},
	mouseWheel : function(mx, my, wheelDelta)
	{
	},
	getImage : function(imageType, name, ext)
    {
        // local
        var im = new Image();
		if (ext == null)
		{
	        im.src = imageLoc + imageType + "/" + name + ".png";
		}
		else
		{
			im.src = imageLoc + imageType + "/" + name + ext;
		}
        return im;
    }
});


var c_insufficientColor = "rgba(64, 64, 64, 0.5)";

var c_gridBackgroundColor = "rgb(0,0,0)";
var c_gridLineColor = "rgb(0,0,64)";
var c_gridSpacing = 16;

var c_numEventButtons = 5;
//var c_eventButtonWidth = 128;
var c_eventButtonWidth = 136;
var c_eventButtonHeight = c_mediumPxs + 3 * c_smallPxs;

//var c_shipColumnWidth = 400;
var c_shipColumnWidth = 410;
var c_statHeight = c_titlePxs + c_smallPxs + 10;
var c_bottomBar = 64;

var c_writeTimeMS = 60 * 1000 * 5;

var c_moonOrbitMS = 15 * 1000;
var c_monthMS = 5 * 1000;
var c_yearMS = c_monthMS * 12;
var c_baseYear = 1960;

var c_basePPIBonus = 2;

var c_clickTime = 1000;

function bigNumStr(num)
{
	var dl = Math.log(num) * Math.LOG10E;
	if (dl < 6)
	{
		return mut.intWithCommas(num);
	}
	var wp = Math.floor((dl - 6) / 3);
	if ((wp * 2 + 1) > moneyAmounts.length)
	{
		wp = (moneyAmounts.length / 2) - 1;
	}
	var sp = (wp * 3) + 6;
	var fp = dl - sp;
	var hp = Math.exp(fp * Math.LN10);
//	hp = Math.floor(hp * 100) / 100;
//	return mut.fixedWithCommas(hp, 2) + " " + moneyAmounts[wp * 2 + 1];
	return hp.toFixed(2) + " " + moneyAmounts[wp * 2 + 1];
}

var CGaCl = Class.extend({
	construct: function ()
	{
		// constants and images
		this.buildTable();
		this.m_logo = eng.getImage("ui", "lg_48");
		this.m_shipImg = [ ];
		for (var i = 0; i < c_shipTable.length; ++i)
		{
			this.m_shipImg.push(eng.getImage("hulls", c_shipTable[i][c_col.image]));
		}
		this.m_earth = eng.getImage("objects", "earth01");
		this.m_moon = eng.getImage("objects", "moon");
		this.m_galaxy = eng.getImage("objects", "galaxy");
		this.m_telescope = eng.getImage("objects", "telescope");
		this.m_genShip = eng.getImage("objects", "gen_ship");
		this.m_counterEarth = eng.getImage("objects", "counter_earth");
		this.m_maelstrom = eng.getImage("objects", "maelstrom");
		this.m_nebula = eng.getImage("objects", "nebula");
		this.m_click = eng.getImage("ui", "Click");
		this.buildShipButtons();
		this.buildEventButtons();
		this.buildPostPhysicalButtons();
		this.buildSettingButtons();

		this.m_ppChoice = false;
		this.m_settingMode = false;

		this.m_buyAmount = 1;
		this.m_showLevel = false;
		this.m_nextStageEvent = false;

		this.reset(true);

		this.m_clickList = [ ];
		this.m_renderFeature = [ ];

		// Try to read from last game
		this.readFromLocalStorage();
	},
	saveToLocalStorage : function()
	{
		var ol = { };
		ol.m_version = 1;
		ol.m_lastUpdateMS = this.m_lastUpdateMS;
		ol.m_curMoney = this.m_curMoney;
		ol.m_totalMoney = this.m_totalMoney;
		ol.m_playTime = this.m_playTime;
		ol.m_ppi = this.m_ppi;
		ol.m_lastAssend = this.m_lastAssend;
		// ship
		ol.m_shipCounts = [ ];
		for (var i = 0; i < this.m_shipCounts.length; ++i)
		{
			ol.m_shipCounts[i] = this.m_shipCounts[i];
		}
		// events
		ol.m_eventPurchased = [ ];
		for (var i = 0; i < this.m_eventPurchased.length; ++i)
		{
			ol.m_eventPurchased[i] = this.m_eventPurchased[i];
		}
		// JSON-fy it
		var olStr = JSON.stringify(ol);
		// Encrypt here
		// Write out
		localStorage.m_olStr = olStr;
		// Reset write out time
		this.m_writeTime = c_writeTimeMS;
	},
	readFromLocalStorage : function()
	{
		if (localStorage.m_olStr == null)
		{
			// New game
			return ;
		}
		if (localStorage.m_olStr == "")
		{
			// New game
			return ;
		}
		var olStr = localStorage.m_olStr;
		var ol = JSON.parse(olStr);

		this.m_lastUpdateMS = ol.m_lastUpdateMS;
		this.m_curMoney = ol.m_curMoney;
		this.m_totalMoney = ol.m_totalMoney;
		this.m_playTime = ol.m_playTime;
		this.m_ppi = ol.m_ppi;
		this.m_lastAssend = ol.m_lastAssend;

		for (var i = 0; i < this.m_shipCounts.length; ++i)
		{
			this.m_shipCounts[i] = ol.m_shipCounts[i];
		}
		// events
		this.m_eventPurchased = [ ];
		for (var i = 0; i < ol.m_eventPurchased.length; ++i)
		{
			this.m_eventPurchased[i] = ol.m_eventPurchased[i];
			if (this.m_eventPurchased[i])
			{
				var s = c_eventTable[i][0];
				++this.m_numPurchasedEvents[s];
				++this.m_totalEventsPurchased;
				var df = c_eventTable[i][5];
				if (df != null)
				{
					this.m_renderFeature[df] = true;
				}
			}
		}
		// Rebuild the ui
		for (var i = 0; i < c_shipTable.length; ++i)
		{
			this.calculateDPS(i);
			this.m_shipCost[i] = this.calculateCost(i);
			this.updateShipButtonText(i);
		}
		// Calculate the stage
		this.m_curStage = c_stage.galaxy;
		for (var i = 0; i < c_eventTable.length; ++i)
		{
			if (!this.m_eventPurchased[i])
			{
				this.m_curStage = c_eventTable[i][0];
				break;
			}
		}
		this.updateEventButtonText();
		// Reset write out time
		this.m_writeTime = c_writeTimeMS;
	},
	buildTable: function ()
	{
		for (var i = 2; i < c_shipTable.length; ++i)
		{
			c_shipTable[i][c_col.baseCost] = c_shipTable[i - 1][c_col.baseCost] * 8;
			c_shipTable[i][c_col.exponent] = c_shipTable[i - 1][c_col.exponent] - 0.5;
			c_shipTable[i][c_col.dps] = c_shipTable[i - 1][c_col.dps] * 6;
		}
		var curStage = c_stage.earth;
		this.m_finalEventInStage = [ ];
		this.m_numEvents = [ ];
		for (var i = 0; i < c_eventTable.length; ++i)
		{
			var s = c_eventTable[i][0];
			if (this.m_numEvents[s] == null)
			{
				this.m_numEvents[s] = 0;
			}
			++this.m_numEvents[s];
			if (s != curStage)
			{
				this.m_finalEventInStage[curStage] = i - 1;
				curStage = s;
			}
		}
		this.m_finalEventInStage[c_stage.galaxy] = c_eventTable.length - 1;
	},
	buildShipButtons: function ()
	{
		this.m_shipControls = new CntlGroup();
		this.m_shipControls.init();

		// add the 1, 10, 100 buttons
		this.m_buyAmountButtons = [];

		var bx = 30;
		var by = c_statHeight + 10;
		var bw = (c_shipColumnWidth - 20 - 120) / 3;
		var bbw = bw + 5;
		var bh = c_mediumPxs + 4;

		var buttonOne = new CntlButton();
		buttonOne.init(bx, by, bw, bh, c_colWhite, 'buyAmount', this);
		buttonOne.addText("1", c_mediumPxs, c_colBlack, c_colWhite, bw / 2, c_smallPxs + 4, c_textAlignCenter);
		buttonOne.m_fillCol = c_colWhite;
		buttonOne.m_amount = 1;
		buttonOne.m_active = false;
		this.m_buyAmountButtons.push(buttonOne);
		this.m_shipControls.addControl(buttonOne);
		this.m_buyOneButton = buttonOne;

		var buttonTen = new CntlButton();
		buttonTen.init(bx + bbw, by, bw, bh, c_colWhite, 'buyAmount', this);
		buttonTen.addText("10", c_mediumPxs, c_colWhite, c_colBlack, bw / 2, c_smallPxs + 4, c_textAlignCenter);
		buttonTen.m_amount = 10;
		this.m_buyAmountButtons.push(buttonTen);
		this.m_shipControls.addControl(buttonTen);

		var buttonHundred = new CntlButton();
		buttonHundred.init(bx + bbw * 2, by, bw, bh, c_colWhite, 'buyAmount', this);
		buttonHundred.addText("100", c_mediumPxs, c_colWhite, c_colBlack, bw / 2, c_smallPxs + 4, c_textAlignCenter);
		buttonHundred.m_amount = 100;
		this.m_buyAmountButtons.push(buttonHundred);
		this.m_shipControls.addControl(buttonHundred);

		var tw = 50;
		var viewToggleButton = new CntlButton();
		viewToggleButton.init(c_shipColumnWidth - 5 - tw, by, tw, bh, c_colWhite, 'viewToggle', this);
		viewToggleButton.addText("Lvl", c_mediumPxs, c_colWhite, c_colBlack, tw / 2, c_smallPxs + 4, c_textAlignCenter);
		this.m_shipControls.addControl(viewToggleButton);

		var shipStartY = c_statHeight + c_mediumPxs + 25;
		var bx = 5;
		var by = shipStartY;
		var ms = 101;			// The max ship image size is 101
		var bs = 72;
		this.m_shipButtons = [ ];
		for (var i = 0; i < c_shipTable.length; ++i)
		{
			var button = new CntlButton();
			button.init(bx, by, bs, bs, c_colWhite, 'buyShip', this);
			button.m_shipId = i;
			button.setImageButton(this.m_shipImg[i], this.m_shipImg[i]);
			button.m_fixedImageScale = bs / ms;
			button.addText("--", c_smallPxs, c_colWhite, c_colWhite, bs + 5, c_mediumPxs, c_textAlignLeft);
			button.addText("--", c_smallPxs, c_colWhite, c_colWhite, bs + 5, 2 * c_mediumPxs, c_textAlignLeft);
			button.addText("--", c_smallPxs, c_colWhite, c_colWhite, bs + 5, 3 * c_mediumPxs, c_textAlignLeft);

			this.m_shipButtons.push(button);
			this.m_shipControls.addControl(button);
//			this.updateShipButtonText(i);

			if (i == ((c_shipTable.length / 2) - 1))
			{
				bx += c_shipColumnWidth / 2;
				by = shipStartY;
			}
			else
			{
				by += bs + 5;
			}
		}
	},
	buildEventButtons: function ()
	{
		this.m_eventButtons = [ ];

		var bx = eng.m_gameWidth - c_eventButtonWidth - 4;
		var by = c_statHeight + 8 + c_smallPxs;

		for (var i = 0; i < c_numEventButtons; ++i)
		{
			var button = new CntlButton();
			button.init(bx, by, c_eventButtonWidth - 2, c_eventButtonHeight, c_colWhite, 'purchaseEventButtonResponse', this);
			button.m_eventId = -1;

			button.addText("--", c_mediumPxs, c_colWhite, c_colBlack, 5, c_mediumPxs, c_textAlignLeft);
			button.addText("--", c_smallPxs, c_colWhite, c_colBlack, 5, c_mediumPxs + c_smallPxs * 1.25, c_textAlignLeft);
			button.addText("--", c_smallPxs, c_colWhite, c_colBlack, 5, c_mediumPxs + 2.5 * c_smallPxs, c_textAlignLeft);
			button.addText("--", c_mediumPxs, c_colWhite, c_colBlack, c_eventButtonWidth - 10, c_mediumPxs + 2.5 * c_smallPxs, c_textAlignRight);

			this.m_shipControls.addControl(button);
			this.m_eventButtons.push(button);

			by += c_eventButtonHeight + 8;
		}
		var ps = c_statHeight - 12;
		this.m_ppiButton = new CntlButton();
		this.m_ppiButton.init(eng.m_gameWidth - ps - 6, 6, ps, ps, c_colWhite, 'goPostPhysical', this);
		this.m_ppiButton.setImageButton(eng.getImage("ui", "post_physical"), eng.getImage("ui", "post_physical_h"));
		this.m_shipControls.addControl(this.m_ppiButton);

		var ss = c_statHeight - 24;
		this.m_settingsButton = new CntlButton();
		this.m_settingsButton.init(c_shipColumnWidth - ss - 6, c_statHeight - ss - 6, ss, ss, c_colWhite, 'openSettings', this);
		this.m_settingsButton.setImageButton(eng.getImage("ui", "Settings_button"), eng.getImage("ui", "Settings_button_h"));
		this.m_shipControls.addControl(this.m_settingsButton);
	},
	buildPostPhysicalButtons : function()
	{
		this.m_ppButtons = new CntlGroup();
		this.m_ppButtons.init();

		var ww = eng.m_gameWidth - (c_shipColumnWidth + c_eventButtonWidth);
		var wh = eng.m_gameHeight - (c_statHeight + c_bottomBar);

		var dx = c_shipColumnWidth + ww * 0.1;
		var dy = c_statHeight + wh * 0.2;
		var dw = ww * 0.8;
		var dh = wh * 0.6;

		var bw = 80;
		var bh = c_mediumPxs * 1.5;

		var bx = dx + dw - bw - 10;
		var by = dy + dh - bh * 2.5;

		var ascendButton = new CntlButton();
		ascendButton.init(bx, by, bw, bh, c_colWhite, 'ascendResponse', this);
		ascendButton.addText("Ascend", c_mediumPxs, c_colWhite, c_colBlack, bw / 2, c_mediumPxs + 2, c_textAlignCenter);
		this.m_ppButtons.addControl(ascendButton);

		by += bh * 1.25;
		var ascendCancelButton = new CntlButton();
		ascendCancelButton.init(bx, by, bw, bh, c_colWhite, 'ascendCancelResponse', this);
		ascendCancelButton.addText("Cancel", c_mediumPxs, c_colWhite, c_colBlack, bw / 2, c_mediumPxs + 2, c_textAlignCenter);
		this.m_ppButtons.addControl(ascendCancelButton);
	},
	buildSettingButtons : function()
	{
		this.m_settingButtons = new CntlGroup();
		this.m_settingButtons.init();

		var ww = eng.m_gameWidth - (c_shipColumnWidth + c_eventButtonWidth);
		var wh = eng.m_gameHeight - (c_statHeight + c_bottomBar);

		var dx = c_shipColumnWidth + ww * 0.1;
		var dy = c_statHeight + wh * 0.2;
		var dw = ww * 0.8;
		var dh = wh * 0.6;

		var bw = 80;
		var bh = c_mediumPxs * 1.5;

		var bx = dx + 10;
		var by = dy + c_smallPxs * 3;

		var hardReset = new CntlButton();
		hardReset.init(bx, by, bw, bh, c_colWhite, 'hardReset', this);
		hardReset.addText("Hard reset", c_mediumPxs, c_colWhite, c_colBlack, bw / 2, c_mediumPxs + 2, c_textAlignCenter);
		this.m_settingButtons.addControl(hardReset);

		by += c_smallPxs * 3;
		var soundButton = new CntlButton();
		soundButton.init(bx, by, bw, bh, c_colWhite, 'toggleSound', this);
		soundButton.addText("Sound", c_mediumPxs, c_colWhite, c_colBlack, bw / 2, c_mediumPxs + 2, c_textAlignCenter);
		this.m_settingButtons.addControl(soundButton);

		by += c_smallPxs * 3;
		var squareDogButton = new CntlButton();
		squareDogButton.init(bx, by, bw, bh, c_colWhite, 'squareDog', this);
		squareDogButton.addText("Square Dog", c_mediumPxs, c_colWhite, c_colBlack, bw / 2, c_mediumPxs + 2, c_textAlignCenter);
		this.m_settingButtons.addControl(squareDogButton);

		by += c_smallPxs * 3;
		var exitSettingsButton = new CntlButton();
		exitSettingsButton.init(c_shipColumnWidth + ww / 2 - bw / 2, by, bw, bh, c_colWhite, 'exitSettings', this);
		exitSettingsButton.addText("Exit", c_mediumPxs, c_colWhite, c_colBlack, bw / 2, c_mediumPxs + 2, c_textAlignCenter);
		this.m_settingButtons.addControl(exitSettingsButton);
	},
	update : function (elapsed)
	{
		// jjj - Debug (each minute is like 4 hours)
		var spdMult = 60;
		// jjj - Debug (each minute is like 4 hours)

		var curDate = new Date();
		var curMS = curDate.getTime();
		var deltaMS = curMS - this.m_lastUpdateMS;
		this.m_playTime += deltaMS * spdMult;

		this.m_writeTime -= deltaMS;
		if (this.m_writeTime < 0)
		{
			this.saveToLocalStorage();
		}

		var dps = 0;
		for (var i = 0; i < c_shipTable.length; ++i)
		{
			dps += this.m_shipDPS[i];
		}
		var newAmount = dps * (deltaMS / 1000);
		newAmount *= spdMult;
		this.m_curMoney += newAmount;
		this.m_totalMoney += newAmount;

		this.m_newPpi = Math.floor(Math.sqrt(this.m_totalMoney / 1.0E12));

		this.updateClickList(deltaMS);

		this.m_lastUpdateMS = curMS;
		this.colorButtons();
	},
	updateClickList : function(deltaMS)
	{
		var i = 0;
		while (i < this.m_clickList.length)
		{
			this.m_clickList[i][2] += deltaMS;
			if (this.m_clickList[i][2] > c_clickTime)
			{
				this.m_clickList.splice(i, 1);
			}
			else
			{
				++i;
			}
		}
	},
	colorButtons: function ()
	{
		for (var i = 0; i < this.m_shipButtons.length; ++i)
		{
			var bn = this.m_shipButtons[i];
			if (this.m_shipCost[i] <= this.m_curMoney)
			{
				bn.m_fillCol = null;
				bn.m_active = true;
			}
			else
			{
				bn.m_fillCol = c_insufficientColor;
				bn.m_active = false;
			}
		}
		for (var i = 0; i < this.m_eventButtons.length; ++i)
		{
			var bn = this.m_eventButtons[i];
			if (bn.m_eventId == -1)
			{
				bn.m_fillCol = c_insufficientColor;
				bn.m_active = false;
			}
			else
			{
				var eventCost = c_eventTable[bn.m_eventId][4];
				if (eventCost <= this.m_curMoney)
				{
					bn.m_fillCol = null;
					bn.m_active = true;
				}
				else
				{
					bn.m_fillCol = c_insufficientColor;
					bn.m_active = false;
				}
			}
		}
	},
	render : function()
	{
		this.renderBackground();
		this.renderTitle();
		this.renderShips();
		this.renderSpace();
		this.renderClick();
		this.renderPostPhysical();
		this.renderSettings();
	},
	renderBackground : function()
	{
		hld.drawGridRect(eng.dc, 0, 0, eng.m_gameWidth, eng.m_gameHeight,
			c_gridBackgroundColor, c_gridLineColor,
			0, 0, c_gridSpacing, c_gridSpacing);
		eng.dc.beginPath();
		eng.dc.lineWidth = 2;
		eng.dc.strokeStyle = c_colWhite;
		eng.dc.moveTo(c_shipColumnWidth, 0);
		eng.dc.lineTo(c_shipColumnWidth, eng.m_gameHeight);
		eng.dc.moveTo(0, c_statHeight);
		eng.dc.lineTo(eng.m_gameWidth, c_statHeight);
		eng.dc.moveTo(c_shipColumnWidth, eng.m_gameHeight - c_bottomBar);
		eng.dc.lineTo(eng.m_gameWidth, eng.m_gameHeight - c_bottomBar);
		eng.dc.stroke();
	},
	renderTitle : function()
	{
		hld.setFont(eng.dc, c_titlePxs, c_textAlignCenter, c_colWhite);
		eng.dc.fillText("Galactic Clicker", c_shipColumnWidth / 2, c_titlePxs);
		hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
		eng.dc.fillText("Square Dog Studios", c_shipColumnWidth / 2, c_titlePxs + c_smallPxs);

		// Money
		hld.setFont(eng.dc, c_titlePxs, c_textAlignCenter, c_colWhite);
		var moneyStr = bigNumStr(this.m_curMoney);
		eng.dc.fillText("$" + moneyStr, (eng.m_gameWidth + c_shipColumnWidth - c_statHeight) / 2, c_titlePxs + 5);

		// Date since game start
		hld.setFont(eng.dc, c_smallPxs, c_textAlignLeft, c_colWhite);
		eng.dc.fillText("Year", c_shipColumnWidth + 4, c_smallPxs + 3);
		// debug
		if (1)
		{
			var cSec = 1000;
			var cMin = cSec * 60;
			var cHour = cMin * 60;
			var cDay = cHour * 24;
			var days = Math.floor(this.m_playTime / cDay);
			var hours = Math.floor((this.m_playTime % cDay) / cHour);
			var mins = Math.floor((this.m_playTime % cHour) / cMin);
			var secs = Math.floor((this.m_playTime % cMin) / cSec);
			eng.dc.fillText(days + ":" + hours.toString() + ":" + mins + ":" + secs, c_shipColumnWidth + 4, 2 * c_smallPxs + 3);
		}
		else
		{
			var year = c_baseYear + Math.floor(this.m_playTime / c_yearMS);
			var yearStr;
			if (year > 9999)
			{
				yearStr = mut.intWithCommas(year);
			}
			else
			{
				yearStr = year.toString();
			}
			var month = Math.floor((this.m_playTime % c_yearMS) / c_monthMS);
			eng.dc.fillText(c_months[month] + " " + yearStr, c_shipColumnWidth + 4, 2 * c_smallPxs + 3);
		}
		// Post physical intelligences
		var ps = c_statHeight - 8;
		var px = eng.m_gameWidth - ps - 8;
		hld.setFont(eng.dc, c_smallPxs, c_textAlignRight, c_colWhite);
		eng.dc.fillText("PPI (+" + this.m_ppiBonus.toFixed(1) + "%)", px, c_smallPxs + 3);
		var ppiStr = bigNumStr(this.m_ppi);
		eng.dc.fillText(ppiStr, px, 2 * c_smallPxs + 5);
		var newPpiStr = bigNumStr(this.m_newPpi);
		eng.dc.fillText("{ +" + newPpiStr + " }", eng.m_gameWidth - 64, 3 * c_smallPxs + 3);

		// Stage and events
		if (!this.m_renderFeature['end_game'])
		{
			var ex = eng.m_gameWidth - c_eventButtonWidth / 2 - 4;
			hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
			eng.dc.fillText("Stage: " + this.m_curStage
					+ " (" + this.m_numPurchasedEvents[this.m_curStage] + " / " + this.m_numEvents[this.m_curStage] + ")",
				ex, c_statHeight + c_smallPxs + 1);
		}
	},
	renderShips : function()
	{
		this.m_shipControls.render();
		if (this.m_nextStageEvent)
		{
			var tx = this.m_eventButtons[2].m_px + this.m_eventButtons[2].m_width / 2;
			var ty = this.m_eventButtons[2].m_py + this.m_eventButtons[2].m_height + c_smallPxs * 1.5;

			hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
			eng.dc.fillText("Purchase this event", tx, ty);
			ty += c_smallPxs;
			eng.dc.fillText("to move to the next stage", tx, ty);
			ty += c_smallPxs;
			eng.dc.fillText("of your galactic empire", tx, ty);
			ty += c_smallPxs;
		}
	},
	renderSpace : function()
	{
		switch (this.m_curStage)
		{
			case c_stage.earth:
				this.renderEarth();
				break;
			case c_stage.system:
				this.renderSolSystem();
				break;
			case c_stage.sector:
				this.renderSector();
				break;
			case c_stage.galaxy:
				this.renderGalaxy();
				break;
		}
	},
	renderEarth : function()
	{
		var ww = eng.m_gameWidth - (c_shipColumnWidth + c_eventButtonWidth);
		var wh = eng.m_gameHeight - (c_statHeight + c_bottomBar);
		var ex = ww / 2  + c_shipColumnWidth;
		var ey = wh / 2 + c_statHeight;
		var ew = 96;
		var eh = 96;
		eng.dc.drawImage(this.m_earth, ex - ew / 2, ey - eh / 2, ew, eh);

		if (this.m_renderFeature['nasa'])
		{
			var r1 = ((this.m_lastUpdateMS % 2000) / 2000) * 50 + 48;
			var r2 = (((this.m_lastUpdateMS + 666) % 2000) / 2000) * 50 + 48;
			var r3 = (((this.m_lastUpdateMS + 1333) % 2000) / 2000) * 50 + 48;
			eng.dc.strokeStyle = c_colGray;
			eng.dc.lineWidth = 1;
			eng.dc.beginPath();
			eng.dc.arc(ex, ey, r1, 0, Math.PI * 2, true);
			eng.dc.stroke();
			eng.dc.beginPath();
			eng.dc.arc(ex, ey, r2, 0, Math.PI * 2, true);
			eng.dc.stroke();
			eng.dc.beginPath();
			eng.dc.arc(ex, ey, r3, 0, Math.PI * 2, true);
			eng.dc.stroke();
		}

		var mor = wh * 0.4;
		eng.dc.beginPath();
		eng.dc.strokeStyle = c_colWhite;
		eng.dc.lineWidth = 2;
		eng.dc.arc(ex, ey, mor, 0, Math.PI * 2, true);
		eng.dc.stroke();
		eng.dc.lineWidth = 1;
		var ma = ((this.m_lastUpdateMS % c_moonOrbitMS) / c_moonOrbitMS) * Math.PI * 2.0;
		var mx = Math.cos(ma) * mor + ex;
		var my = Math.sin(ma) * mor + ey;
		var mr = 28;

		eng.dc.translate(mx, my);
		eng.dc.rotate(ma);
		eng.dc.scale(mr / this.m_moon.width, mr / this.m_moon.height);

		if (this.m_renderFeature['moon_colony'])
		{
			eng.dc.beginPath();
			eng.dc.strokeStyle = c_colWhite;
			eng.dc.lineWidth = 8;
			eng.dc.arc(-mr * 1.5, -mr * 1.5, mr, 0, Math.PI * 2, true);
			eng.dc.moveTo(0, 0);
			eng.dc.lineTo(-mr * 3.5, -mr * 3.5);
			eng.dc.stroke();

			var r1 = ((this.m_lastUpdateMS % 1000) / 1000) * 50;
			var r2 = (((this.m_lastUpdateMS + 500) % 1000) / 1000) * 50;
			eng.dc.strokeStyle = c_colWhite;
			eng.dc.lineWidth = 2;
			eng.dc.beginPath();
			eng.dc.arc(-mr * 3.5, -mr * 3.5, r1, 0, Math.PI * 2, true);
			eng.dc.stroke();
			eng.dc.beginPath();
			eng.dc.arc(-mr * 3.5, -mr * 3.5, r2, 0, Math.PI * 2, true);
			eng.dc.stroke();
		}

		eng.dc.translate(-this.m_moon.width / 2, -this.m_moon.height / 2);
		eng.dc.drawImage(this.m_moon, 0, 0);

		if (this.m_renderFeature['moon_flag'])
		{
			eng.dc.translate(this.m_moon.width / 2, this.m_moon.height / 2);
			eng.dc.beginPath();
			eng.dc.strokeStyle = c_colWhite;
			eng.dc.lineWidth = 10;
			eng.dc.moveTo(mr * 2, 0);
			eng.dc.lineTo(mr * 5, 0);
			eng.dc.lineTo(mr * 5, mr * 2);
			eng.dc.lineTo(mr * 3.5, mr * 2);
			eng.dc.lineTo(mr * 3.5, 0);
			eng.dc.stroke();
			eng.dc.lineWidth = 1;
//			eng.dc.strokeRect(0, mr * 1.5, mr * 0.5, mr * 0.5);
		}
		eng.dc.setTransform(1, 0, 0, 1, 0, 0);

		if (this.m_renderFeature['earth_tele'])
		{
			var ta = (((this.m_lastUpdateMS % c_moonOrbitMS) / c_moonOrbitMS) + 1.25) * Math.PI * 2.0;
			var tor = mor * 0.5;
			var tx = Math.cos(ta) * tor + ex;
			var ty = Math.sin(ta) * tor + ey;
			var tr = 28;

			eng.dc.translate(tx, ty);
			eng.dc.rotate(ta + Math.PI * 0.5);
			eng.dc.scale(tr / this.m_telescope.width, mr / this.m_telescope.height);
			eng.dc.translate(-this.m_telescope.width / 2, -this.m_telescope.height / 2);
			eng.dc.drawImage(this.m_telescope, 0, 0);
			eng.dc.setTransform(1, 0, 0, 1, 0, 0);
		}
	},
	renderSolSystem : function()
	{
		var ww = eng.m_gameWidth - (c_shipColumnWidth + c_eventButtonWidth);
		var wh = eng.m_gameHeight - (c_statHeight + c_bottomBar);
		var sx = ww / 2  + c_shipColumnWidth;
		var sy = wh / 2 + c_statHeight;
		var sr = 10;

		eng.dc.beginPath();
		eng.dc.fillStyle = c_colWhite;
		eng.dc.arc(sx, sy, sr, 0, Math.PI * 2, true);
		eng.dc.fill();

		if (this.m_renderFeature['solar_amplifier'])
		{
			var ang = ((this.m_lastUpdateMS % 1000) / 1000) * Math.PI * 2.0;
			eng.dc.lineWidth = 3;
			for (var i = 0; i < 6; ++i)
			{
				eng.dc.beginPath();
				eng.dc.fillStyle = c_colWhite;
				var sa = ang + i * Math.PI * 2 / 6;
				var ea = sa + ((Math.PI * 2 / 6) * 0.75);
				eng.dc.arc(sx, sy, sr * 1.5, sa, ea, false);
				eng.dc.stroke();
			}
			eng.dc.lineWidth = 1;
		}

		var or = 25;
		var dor = 16;
		for (var i = 0; i < 9; ++i)
		{
			eng.dc.beginPath();
			if (i == 4)
			{
				eng.dc.lineWidth = 16;
				eng.dc.strokeStyle = "rgba(64,64,64,0.5)";
			}
			else
			{
				eng.dc.lineWidth = 1;
				eng.dc.strokeStyle = c_colWhite;
			}
			eng.dc.arc(sx, sy, or, 0, Math.PI * 2, true);
			eng.dc.stroke();

			// Do the planet
			if (i != 4)
			{
				var ye = or * 1000;
				var ang = ((this.m_lastUpdateMS % ye) / ye) * Math.PI * 2.0;
				var px = Math.cos(ang) * or + sx;
				var py = Math.sin(ang) * or + sy;
				var pr = 5;
				eng.dc.beginPath();
				eng.dc.fillStyle = c_colWhite;
				eng.dc.arc(px, py, pr, 0, Math.PI * 2, true);
				eng.dc.fill();

				if (i == 2)
				{
					var mor = 10;
					eng.dc.beginPath();
					eng.dc.lineWidth = 1;
					eng.dc.strokeStyle = c_colWhite;
					eng.dc.arc(px, py, mor, 0, Math.PI * 2, true);
					eng.dc.stroke();
					var ma = ((this.m_lastUpdateMS % c_moonOrbitMS) / c_moonOrbitMS) * Math.PI * 2.0;
					var mx = Math.cos(ma) * mor + px;
					var my = Math.sin(ma) * mor + py;
					var mr = 3;
					eng.dc.beginPath();
					eng.dc.fillStyle = c_colWhite;
					eng.dc.arc(mx, my, mr, 0, Math.PI * 2, true);
					eng.dc.fill();

					if (this.m_renderFeature['counter_earth'])
					{
						var ta = ang + Math.PI;
						var tx = Math.cos(ta) * or + sx;
						var ty = Math.sin(ta) * or + sy;
						var tr = 16;

						eng.dc.translate(tx, ty);
						eng.dc.rotate(ta * 10);
						eng.dc.scale(tr / this.m_counterEarth.width, tr / this.m_counterEarth.height);
						eng.dc.translate(-this.m_counterEarth.width / 2, -this.m_counterEarth.height / 2);
						eng.dc.drawImage(this.m_counterEarth, 0, 0);
						eng.dc.setTransform(1, 0, 0, 1, 0, 0);
					}
				}
				if (i == 5)
				{
					if (this.m_renderFeature['jupiter_farming'])
					{
						var ta = ang + Math.PI * 0.1;
						var tx = Math.cos(ta) * (or * 1.1) + sx;
						var ty = Math.sin(ta) * (or * 1.1) + sy;
						var tr = 5;
						var pr = 3;

						eng.dc.beginPath();
						eng.dc.lineWidth = 1;
						eng.dc.moveTo(tx - tr, ty - tr);
						eng.dc.lineTo(tx + tr, ty + tr);
						eng.dc.moveTo(tx + tr, ty - tr);
						eng.dc.lineTo(tx - tr, ty + tr);
						eng.dc.stroke();
						eng.dc.beginPath();
						eng.dc.arc(tx - tr, ty - tr, pr, 0, Math.PI * 2, true);
						eng.dc.fill();
						eng.dc.beginPath();
						eng.dc.arc(tx - tr, ty + tr, pr, 0, Math.PI * 2, true);
						eng.dc.fill();
						eng.dc.beginPath();
						eng.dc.arc(tx + tr, ty + tr, pr, 0, Math.PI * 2, true);
						eng.dc.fill();
						eng.dc.beginPath();
						eng.dc.arc(tx + tr, ty - tr, pr, 0, Math.PI * 2, true);
						eng.dc.fill();

						eng.dc.beginPath();
						eng.dc.lineWidth = 3;
						eng.dc.lineDashOffset = -((this.m_lastUpdateMS % 1000) / 1000) * 10;
						eng.dc.setLineDash([3, 3]);
						eng.dc.moveTo(px, py);
						eng.dc.lineTo(tx, ty);
						eng.dc.stroke();

						eng.dc.lineWidth = 1;
						eng.dc.setLineDash([0, 0]);
					}
				}
				if (i == 6)
				{
					eng.dc.beginPath();
					eng.dc.lineWidth = 4;
					eng.dc.strokeStyle = "rgba(64,64,64,0.8)";
					eng.dc.arc(px, py, 10, 0, Math.PI * 2, true);
					eng.dc.stroke();

					if (this.m_renderFeature['galactic_scope'])
					{
						var ta = ang - Math.PI * 0.125;
						var tx = Math.cos(ta) * or + sx;
						var ty = Math.sin(ta) * or + sy;
						var tr = 24;

						eng.dc.translate(tx, ty);
						eng.dc.rotate(ta + Math.PI * 0.5);
						eng.dc.scale(tr / this.m_telescope.width, tr / this.m_telescope.height);
						eng.dc.translate(-this.m_telescope.width / 2, -this.m_telescope.height / 2);
						eng.dc.drawImage(this.m_telescope, 0, 0);
						eng.dc.setTransform(1, 0, 0, 1, 0, 0);
					}
				}
			}
			else
			{
				if (this.m_renderFeature['ceres_colony'])
				{
					var ye = or * 1000;
					var ang = ((this.m_lastUpdateMS % ye) / ye) * Math.PI * 2.0;
					var px = Math.cos(ang) * or + sx;
					var py = Math.sin(ang) * or + sy;
					var pr = 5;
					eng.dc.beginPath();
					eng.dc.fillStyle = c_colWhite;
					eng.dc.moveTo(px, py - pr);
					eng.dc.lineTo(px + pr, py);
					eng.dc.lineTo(px, py + pr);
					eng.dc.lineTo(px - pr, py);
					eng.dc.closePath();
					eng.dc.fill();
				}
				if (this.m_renderFeature['stanford_torus'])
				{
					var ye = or * 1000;
					var ang = ((this.m_lastUpdateMS % ye) / ye) * Math.PI * 2.0 + Math.PI * 0.75;
					var px = Math.cos(ang) * or + sx;
					var py = Math.sin(ang) * or + sy;
					var pr = 5;
					eng.dc.beginPath();
					eng.dc.lineWidth = 2;
					eng.dc.fillStyle = c_colWhite;
					eng.dc.arc(px + pr * 2, py, pr + 1, 0, Math.PI * 2, true);
					eng.dc.fill();
					eng.dc.beginPath();
					eng.dc.fillRect(px, py - pr - 1,  pr * 2, pr * 2 + 2);
					eng.dc.beginPath();
					eng.dc.strokeStyle = c_colWhite;
					eng.dc.fillStyle = c_colBlack;
					eng.dc.arc(px, py, pr, 0, Math.PI * 2, true);
					eng.dc.fill();
					eng.dc.stroke();
					eng.dc.lineWidth = 1;
				}
			}
			switch (i)
			{
				case 3:
					if (this.m_renderFeature['mars_colony'])
					{
						var r1 = ((this.m_lastUpdateMS % 2000) / 2000) * 10 + 4;
						var r2 = (((this.m_lastUpdateMS + 666) % 2000) / 2000) * 10 + 4;
						var r3 = (((this.m_lastUpdateMS + 1333) % 2000) / 2000) * 10 + 4;
						eng.dc.strokeStyle = c_colGray;
						eng.dc.lineWidth = 1;
						eng.dc.beginPath();
						eng.dc.arc(px, py, r1, 0, Math.PI * 2, true);
						eng.dc.stroke();
						eng.dc.beginPath();
						eng.dc.arc(px, py, r2, 0, Math.PI * 2, true);
						eng.dc.stroke();
						eng.dc.beginPath();
						eng.dc.arc(px, py, r3, 0, Math.PI * 2, true);
						eng.dc.stroke();
					}
					break;
				case 5:
				case 7:
					if (this.m_renderFeature['space_stations'])
					{
						var stx = Math.cos(ang + Math.PI) * or + sx;
						var sty = Math.sin(ang + Math.PI) * or + sy;
						var ss = 8;

						eng.dc.beginPath();
						eng.dc.lineWidth = 2;
						eng.dc.fillStyle = c_colBlack;
						eng.dc.strokeStyle = c_colWhite;
						eng.dc.moveTo(stx - ss, sty - ss * 0.5);
						eng.dc.lineTo(stx, sty - ss);
						eng.dc.lineTo(stx + ss, sty - ss * 0.5);
						eng.dc.lineTo(stx + ss * 0.25, sty - ss * 0.125);
						eng.dc.lineTo(stx + ss * 0.25, sty + ss * 0.125);
						eng.dc.lineTo(stx + ss, sty + ss * 0.5);
						eng.dc.lineTo(stx, sty + ss);
						eng.dc.lineTo(stx - ss, sty + ss * 0.5);
						eng.dc.lineTo(stx - ss * 0.25, sty + ss * 0.125);
						eng.dc.lineTo(stx - ss * 0.25, sty - ss * 0.125);
						eng.dc.closePath();
						eng.dc.fill();
						eng.dc.stroke();
						eng.dc.lineWidth = 1;
					}
					break;
			}

			or += dor;
			dor *= 1.1;
		}

		if (this.m_renderFeature['gen_ship'])
		{
			var gx = ww * 0.825  + c_shipColumnWidth;
			var gy = wh * 0.1 + c_statHeight;
			var gs = 24;

			eng.dc.translate(gx, gy);
//			eng.dc.rotate(ta + Math.PI * 0.5);
			eng.dc.scale(gs / this.m_genShip.width, gs / this.m_genShip.height);
			eng.dc.translate(-this.m_genShip.width / 2, -this.m_genShip.height / 2);
			eng.dc.drawImage(this.m_genShip, 0, 0);
			eng.dc.setTransform(1, 0, 0, 1, 0, 0);
		}
	},
	renderSector : function()
	{
		var ww = eng.m_gameWidth - (c_shipColumnWidth + c_eventButtonWidth);
		var wh = eng.m_gameHeight - (c_statHeight + c_bottomBar);
		var sx = ww / 2  + c_shipColumnWidth;
		var sy = wh / 2 + c_statHeight;

		this.renderSystem(sx, sy, 7, 1.0, [1, 1, 2, 1], "Sol");

		this.renderSystem(sx + ww * -0.3, sy + wh * -0.2, 10, 2.0, [2, 1, 1], "Cygni");
		this.renderSystem(sx + ww * 0.2, sy + wh * -0.2, 8, 1.0, [1, 1], "Wolf 359");
		this.renderSystem(sx + ww * -0.1, sy + wh * 0.3, 7, 1.0, [2, 1, 1], "Ross");
		this.renderSystem(sx + ww * -0.35, sy + wh * 0.15, 9, 1.0, [1, 2, 1, 1], "Centauri");
		this.renderSystem(sx + ww * 0.32, sy + wh * 0.35, 6, 1.0, [1, 2], "Sirius");
		this.renderSystem(sx + ww * 0.25, sy + wh * 0.1, 10, 1.0, [1, 1, 1], "Eridani");
		this.renderSystem(sx + ww * -0.1, sy + wh * -0.35, 5, 1.0, [1, 2, 2], "Indi");
		this.renderSystem(sx + ww * 0.35, sy + wh * -0.375, 15, 1.0, [1], "Procyon");

		if (this.m_renderFeature['maelstrom'])
		{
			var mx = sx + ww * 0.20;
			var my = sy + wh * 0.39;
			var ms = 64;
			var ma = ((this.m_lastUpdateMS % 8000) / 8000) * Math.PI * 2.0;

			eng.dc.translate(mx, my);
			eng.dc.rotate(ma);
			eng.dc.scale(ms / this.m_maelstrom.width, ms / this.m_maelstrom.height);
			eng.dc.translate(-this.m_maelstrom.width / 2, -this.m_maelstrom.height / 2);
			eng.dc.drawImage(this.m_maelstrom, 0, 0);
			eng.dc.setTransform(1, 0, 0, 1, 0, 0);
		}
		if (this.m_renderFeature['first_colony'])
		{
			this.renderLeapPath(sx, sy, ww, wh, 0, 0, -0.1, 0.3, 3, c_colWhite);
		}
		if (this.m_renderFeature['alien_probe'])
		{
			var px = sx + ww * -0.22;
			var py = sy + wh * -0.30;
			var ps = 4;

			var r1 = ((this.m_lastUpdateMS % 3000) / 3000) * ps * 4;
			var r2 = (((this.m_lastUpdateMS + 1000) % 3000) / 3000) * ps * 4;
			var r3 = (((this.m_lastUpdateMS + 2000) % 3000) / 3000) * ps * 4;
			eng.dc.strokeStyle = c_colGray;
			eng.dc.lineWidth = 2;
			eng.dc.beginPath();
			eng.dc.arc(px, py, r1, 0, Math.PI * 2, true);
			eng.dc.stroke();
			eng.dc.beginPath();
			eng.dc.arc(px, py, r2, 0, Math.PI * 2, true);
			eng.dc.stroke();
			eng.dc.beginPath();
			eng.dc.arc(px, py, r3, 0, Math.PI * 2, true);
			eng.dc.stroke();

			eng.dc.beginPath();
			eng.dc.strokeStyle = c_colWhite;
			eng.dc.lineWidth = 2;
			eng.dc.moveTo(px - ps, py);
			eng.dc.lineTo(px, py - ps);
			eng.dc.lineTo(px + ps, py);
			eng.dc.lineTo(px, py + 2 * ps);
			eng.dc.closePath();
			eng.dc.stroke();
			eng.dc.lineWidth = 1;
		}
		if (this.m_renderFeature['bypass'])
		{
			var ax = sx + ww * -0.21;
			var ay = sy + wh * -0.15;
			var bx = sx + ww * 0.27;
			var by = sy + wh * -0.375;
			var r1 = 5;

			eng.dc.beginPath();
			eng.dc.lineWidth = 3;
			eng.dc.lineDashOffset = -((this.m_lastUpdateMS % 1000) / 1000) * 10;
			eng.dc.setLineDash([3, 3]);
			eng.dc.moveTo(ax, ay);
			eng.dc.lineTo(bx, by);
			eng.dc.stroke();
			eng.dc.lineWidth = 1;
			eng.dc.setLineDash([0, 0]);

			eng.dc.strokeStyle = c_colWhite;
			eng.dc.fillStyle = c_colBlack;
			eng.dc.lineWidth = 2;
			eng.dc.beginPath();
			eng.dc.arc(ax, ay, r1, 0, Math.PI * 2, true);
			eng.dc.fill();
			eng.dc.stroke();

			eng.dc.lineWidth = 2;
			eng.dc.beginPath();
			eng.dc.arc(bx, by, r1, 0, Math.PI * 2, true);
			eng.dc.fill();
			eng.dc.stroke();
			eng.dc.lineWidth = 1;
		}
		if (this.m_renderFeature['dark_matter'])
		{
			var ax = sx + ww * -0.30;
			var ay = sy + wh * 0.35;
			var r1 = 15;

			eng.dc.strokeStyle = c_colWhite;
			eng.dc.fillStyle = c_colBlack;
			eng.dc.lineWidth = 2;

			eng.dc.beginPath();
			eng.dc.arc(ax + r1 * 1.5, ay, r1, Math.PI * 1.3, Math.PI * 0.7, true);
			eng.dc.stroke();

			eng.dc.beginPath();
			eng.dc.arc(ax - r1 * 1.5, ay, r1, Math.PI * 1.7, Math.PI * 0.3, false);
			eng.dc.stroke();

			eng.dc.lineWidth = 1;

			for (var i = 0; i < 3; ++i)
			{
				var a = (((this.m_lastUpdateMS + i * 500) % 1500) / 1500) * 0.6 * Math.PI;
				var lx = ax + r1 * 1.5 + r1 * Math.cos(a + Math.PI * 0.7);
				var ly = ay + r1 * Math.sin(a + Math.PI * 0.7);
				var rx = ax - r1 * 1.5 + r1 * Math.cos(-a + Math.PI * 0.3);
				var ry = ay + r1 * Math.sin(-a + Math.PI * 0.3);
				var lnx = (lx - rx) * 0.6 + rx;
				var lny = ly + (Math.random() * 10) - 5;
				var rnx = (lx - rx) * 0.3 + rx;
				var rny = ry + (Math.random() * 10) - 5;
				eng.dc.beginPath();
				eng.dc.moveTo(lx, ly);
				eng.dc.lineTo(lnx, lny);
				eng.dc.lineTo(rnx, rny);
				eng.dc.lineTo(rx, ry);
				eng.dc.stroke();
			}
		}
		if (this.m_renderFeature['alien_colony'])
		{
			var cx = sx + ww * 0.25;
			var cy = sy + wh * 0.1;

			var or = 10 * 2;
			var om = 1.0;
			var dor = 8;

			or += dor;
			dor *= 1.1;

			var ye = or * 1000 / om;
			var ang = ((this.m_lastUpdateMS % ye) / ye) * Math.PI * 2.0;
			var px = Math.cos(ang) * or + cx;
			var py = Math.sin(ang) * or + cy;

			var ps = 4;

			var r1 = ((this.m_lastUpdateMS % 3000) / 3000) * ps * 4;
			var r2 = (((this.m_lastUpdateMS + 1000) % 3000) / 3000) * ps * 4;
			var r3 = (((this.m_lastUpdateMS + 2000) % 3000) / 3000) * ps * 4;
			eng.dc.strokeStyle = c_colGray;
			eng.dc.lineWidth = 2;
			eng.dc.beginPath();
			eng.dc.arc(px, py, r1, 0, Math.PI * 2, true);
			eng.dc.stroke();
			eng.dc.beginPath();
			eng.dc.arc(px, py, r2, 0, Math.PI * 2, true);
			eng.dc.stroke();
			eng.dc.beginPath();
			eng.dc.arc(px, py, r3, 0, Math.PI * 2, true);
			eng.dc.stroke();

			eng.dc.beginPath();
			eng.dc.strokeStyle = c_colWhite;
			eng.dc.lineWidth = 2;
			eng.dc.strokeRect(px - 5, py - 5, 10, 10);
			eng.dc.lineWidth = 1;
		}
		if (this.m_renderFeature['leap_paths'])
		{
			this.renderLeapPath(sx, sy, ww, wh, 0, 0, -0.35, 0.15, 3, c_colWhite);		// Sol -> Centauri
			this.renderLeapPath(sx, sy, ww, wh, 0, 0, 0.25, 0.1, 3, c_colWhite);		// Sol -> Eridani
			this.renderLeapPath(sx, sy, ww, wh, 0, 0, 0.2, -0.2, 3, c_colWhite);		// Sol -> Wolf 359
		}
		if (this.m_renderFeature['sector_commerce'])
		{
			this.renderLeapPath(sx, sy, ww, wh, -0.3, -0.2, -0.35, 0.15, 1, c_colGray);		// Cygni -> Centauri
			this.renderLeapPath(sx, sy, ww, wh, 0.32, 0.35, 0.25, 0.1, 1, c_colGray);		// Sirius -> Eridani
			this.renderLeapPath(sx, sy, ww, wh, -0.1, -0.35, 0.2, -0.2, 1, c_colGray);		// Indi -> Wolf 359
		}
		if (this.m_renderFeature['detect_array'])
		{
			var px = sx + ww * -0.175;
			var py = sy + wh * -0.025;
			var ps = 8;

			eng.dc.beginPath();
			eng.dc.strokeStyle = c_colWhite;
			eng.dc.lineWidth = 2;
			eng.dc.moveTo(px, py - ps * 2.5);
			eng.dc.lineTo(px, py + ps * 2.5);
			eng.dc.stroke();
			eng.dc.lineWidth = 1;

			for (var i = 0; i < 7; ++i)
			{
				var ang = (((this.m_lastUpdateMS + i * 250) % 2500) / 2500) * Math.PI * 2.0;
				var bx = Math.cos(ang) * ps * 1.5;
				var by = (ps * 4) / 7 * (i - 3);
				eng.dc.beginPath();
				eng.dc.strokeStyle = c_colWhite;
				eng.dc.moveTo(px - bx, py + by);
				eng.dc.lineTo(px + bx, py + by);
				eng.dc.stroke();
				eng.dc.beginPath();
				eng.dc.fillStyle = c_colWhite;
				eng.dc.arc(px - bx, py + by, 1, 0, Math.PI * 2, true);
				eng.dc.fill();
				eng.dc.beginPath();
				eng.dc.fillStyle = c_colWhite;
				eng.dc.arc(px + bx, py + by, 1, 0, Math.PI * 2, true);
				eng.dc.fill();
			}
		}
		if (this.m_renderFeature['nebula_colony'])
		{
			var px = sx + ww * 0.1;
			var py = sy + wh * 0.20;
			var ps = 60;

			eng.dc.translate(px, py);
			eng.dc.scale(ps / this.m_nebula.width, ps / this.m_nebula.height);
			eng.dc.translate(-this.m_nebula.width / 2, -this.m_nebula.height / 2);
			eng.dc.drawImage(this.m_nebula, 0, 0);
			eng.dc.setTransform(1, 0, 0, 1, 0, 0);

			eng.dc.beginPath();
			eng.dc.fillStyle = c_colWhite;
			eng.dc.arc(px + ps * -0.2, py + ps * 0.1, 3, 0, Math.PI * 2, true);
			eng.dc.fill();
			eng.dc.beginPath();
			eng.dc.fillStyle = c_colWhite;
			eng.dc.arc(px + ps * 0.1, py + ps * -0.1, 3, 0, Math.PI * 2, true);
			eng.dc.fill();
		}
	},
	renderSystem : function(sx, sy, sr, om, pl, name)
	{
		eng.dc.beginPath();
		eng.dc.fillStyle = c_colWhite;
		eng.dc.arc(sx, sy, sr, 0, Math.PI * 2, true);
		eng.dc.fill();

		var or = sr * 2;
		var dor = 8;
		for (var i = 0; i < pl.length; ++i)
		{
			eng.dc.beginPath();
			if (pl[i] == 2)
			{
				eng.dc.lineWidth = 4;
				eng.dc.strokeStyle = "rgba(64,64,64,0.5)";
			}
			else
			{
				eng.dc.lineWidth = 1;
				eng.dc.strokeStyle = c_colWhite;
			}
			eng.dc.arc(sx, sy, or, 0, Math.PI * 2, true);
			eng.dc.stroke();
			// Do the planet
			if (pl[i] == 1)
			{
				var ye = or * 1000 / om;
				var ang = ((this.m_lastUpdateMS % ye) / ye) * Math.PI * 2.0;
				var px = Math.cos(ang) * or + sx;
				var py = Math.sin(ang) * or + sy;
				var pr = 3;
				eng.dc.beginPath();
				eng.dc.fillStyle = c_colWhite;
				eng.dc.arc(px, py, pr, 0, Math.PI * 2, true);
				eng.dc.fill();
			}
			or += dor;
			dor *= 1.1;
		}
		eng.dc.lineWidth = 1;
		hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
		eng.dc.fillText(name, sx, sy + or - dor + c_smallPxs + 2);
	},
	renderLeapPath : function(sx, sy, ww, wh, ax, ay, bx, by, lw, co)
	{
		eng.dc.beginPath();
		eng.dc.strokeStyle = co;
		eng.dc.lineWidth = lw;
		eng.dc.lineDashOffset = -((this.m_lastUpdateMS % 1000) / 1000) * 10;
		eng.dc.setLineDash([3, 3]);
		eng.dc.moveTo(sx + ww * ax, sy + wh * ay);
		eng.dc.lineTo(sx + ww * bx, sy + wh * by);
		eng.dc.stroke();
		eng.dc.lineWidth = 1;
		eng.dc.setLineDash([0, 0]);
	},
	renderGalaxy : function()
	{
		var ww = eng.m_gameWidth - (c_shipColumnWidth + c_eventButtonWidth);
		var wh = eng.m_gameHeight - (c_statHeight + c_bottomBar);
		var ex = ww / 2  + c_shipColumnWidth;
		var ey = wh / 2 + c_statHeight;

		var gs = ww;
		if (wh < ww)
		{
			gs = wh;
		}
		eng.dc.drawImage(this.m_galaxy, ex - gs / 2, ey - gs / 2, gs, gs);

		// Center region
		var gr = gs / 2;
		var cr = gr * 0.15;
		eng.dc.beginPath();
		eng.dc.lineWidth = 2;
		eng.dc.strokeStyle = "rgba(255, 255, 255, 0.5)";
		eng.dc.fillStyle = "rgba(0, 0, 0, 0.75)";
		eng.dc.arc(ex, ey, cr, 0, Math.PI * 2, true);
		if (!this.m_renderFeature['core_barrier'])
		{
			eng.dc.fill();
		}
		eng.dc.stroke();

		if (this.m_renderFeature['end_game'])
		{
			for (var i = 0; i < 12; ++i)
			{
				var t = ((this.m_lastUpdateMS % 1500) / 1500) * Math.PI * 2;
				var s = (Math.sin(t) * 0.05 + 0.8) * cr;
				eng.dc.translate(ex, ey);
				eng.dc.rotate(i * Math.PI * 2 / 12 + t);
				eng.dc.scale(1, 0.5);
				eng.dc.beginPath();
				eng.dc.strokeStyle = c_colWhite;
				eng.dc.lineWidth = 2;
				eng.dc.arc(0, 0, s, 0, Math.PI * 2, true);
				eng.dc.stroke();
				eng.dc.setTransform(1, 0, 0, 1, 0, 0);
				eng.dc.lineWidth = 1;
			}

			var tx = eng.m_gameWidth - c_eventButtonWidth * 0.6 - 2;
			var ty = c_statHeight + 8 + c_smallPxs * 4;

//			var tx = this.m_eventButtons[2].m_px + this.m_eventButtons[2].m_width / 2;
//			var ty = this.m_eventButtons[2].m_py + this.m_eventButtons[2].m_height + c_smallPxs * 1.5;

			hld.setFont(eng.dc, c_mediumPxs, c_textAlignCenter, c_colWhite);
			eng.dc.fillText("Congratulations!", tx, ty);
			ty += c_smallPxs * 1.5;
			hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
			eng.dc.fillText("Your empire spans", tx, ty);
			ty += c_smallPxs;
			eng.dc.fillText("the entire galaxy!", tx, ty);
			ty += 3 * c_smallPxs;
			eng.dc.fillText("Now onto the local group...", tx, ty);
			ty += 8 * c_smallPxs;
			eng.dc.fillText("Thanks for playing!", tx, ty);
			ty += c_smallPxs;
			eng.dc.fillText("I hope you enjoyed it!", tx, ty);
			ty += c_smallPxs;
			eng.dc.fillText("Square Dog Studios", tx, ty);
			ty += c_smallPxs;
		}

		if (this.m_renderFeature['core_barrier'])
		{
			var ang = ((this.m_lastUpdateMS % 5000) / 5000) * Math.PI * 2.0;
			eng.dc.lineWidth = 3;
			for (var i = 0; i < 6; ++i)
			{
				eng.dc.beginPath();
				eng.dc.strokeStyle = c_colBlack;
				var sa = ang + i * Math.PI * 2 / 6;
				var ea = sa + ((Math.PI * 2 / 6) * 0.75);
				eng.dc.arc(ex, ey, cr + 3, sa, ea, false);
				eng.dc.stroke();
				eng.dc.beginPath();
				eng.dc.arc(ex, ey, cr + 6, Math.PI - sa, Math.PI - ea, true);
				eng.dc.stroke();
			}
			eng.dc.lineWidth = 1;
		}

		// Sectors
		for (var d = 0; d < 2; ++d)
		{
			var ir = (0.2 + d * 0.35) * gr;
			var or = (0.2 + 0.30 + d * 0.35) * gr;
			for (var r = 0; r < 6; ++r)
			{
				var sa = r * Math.PI * 2 / 6;
				sa += Math.PI * 2 / 64;
				var ea = (r + 1)  * Math.PI * 2 / 6;
				ea -= Math.PI * 2 / 64;
				var secId = r + d * 6;
				switch (secId)
				{
					case 0:
						break;
					case 1:
						break;
					case 2:
						break;
					case 3:
						break;
					case 4:
						break;
					case 5:
						break;
					case 6:
						break;
					case 7:
						break;
					case 8:
						break;
					case 9:
						break;
					case 10:
						break;
					case 11:
						break;
				}
				eng.dc.beginPath();
				eng.dc.lineWidth = 2;
				eng.dc.strokeStyle = "rgba(255, 255, 255, 0.5)";
				eng.dc.fillStyle = "rgba(0, 0, 0, 0.75)";
				eng.dc.arc(ex, ey, ir, sa, ea, false);
//				eng.dc.lineTo(ex, ey);
				eng.dc.arc(ex, ey, or, ea, sa, true);
				eng.dc.closePath();
				switch (secId)
				{
					case 0:
						if (!this.m_renderFeature['ukrath_stalemate'])
						{
							eng.dc.fill();
						}
						else
						{
							eng.dc.fillStyle = c_colWhite;
							hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
							eng.dc.fillText("U'Krath", ex + gr * 0.3, ey + gr * 0.15);
							eng.dc.fillText("Stalemate", ex + gr * 0.3, ey + gr * 0.15 + c_smallPxs);
						}
						break;
					case 1:
						if (!this.m_renderFeature['drosun_estate'])
						{
							eng.dc.fill();
						}
						else
						{
							eng.dc.fillStyle = c_colWhite;
							hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
							eng.dc.fillText("Drosun", ex, ey + gr * 0.35);
							eng.dc.fillText("Estates", ex, ey + gr * 0.35 + c_smallPxs);
						}
						break;
					case 2:
						if (!this.m_renderFeature['purchase_region'])
						{
							eng.dc.fill();
						}
						else
						{
							eng.dc.fillStyle = c_colWhite;
							hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
							eng.dc.fillText("Region", ex - gr * 0.3, ey + gr * 0.15);
							eng.dc.fillText("purchased", ex - gr * 0.3, ey + gr * 0.15 + c_smallPxs);
						}
						break;
					case 3:
						if (!this.m_renderFeature['reactivate_horum'])
						{
							eng.dc.fill();
						}
						else
						{
							eng.dc.fillStyle = c_colWhite;
							hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
							eng.dc.fillText("Reactivate", ex - gr * 0.3, ey - gr * 0.2);
							eng.dc.fillText("Horum", ex - gr * 0.3, ey - gr * 0.2 + c_smallPxs);
						}
						break;
					case 4:
						if (!this.m_renderFeature['crash_collective'])
						{
							eng.dc.fill();
						}
						else
						{
							eng.dc.fillStyle = c_colWhite;
							hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
							eng.dc.fillText("Crash", ex, ey - gr * 0.4);
							eng.dc.fillText("Collective", ex, ey - gr * 0.4 + c_smallPxs);
						}
						break;
					case 5:
						if (!this.m_renderFeature['purge_growth'])
						{
							eng.dc.fill();
						}
						else
						{
							eng.dc.fillStyle = c_colWhite;
							hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
							eng.dc.fillText("Purge", ex + gr * 0.3, ey - gr * 0.2);
							eng.dc.fillText("growth", ex + gr * 0.3, ey - gr * 0.2 + c_smallPxs);

							for (var i = 0; i < 4; ++i)
							{
								var at = sa + Math.random() * (ea - sa);
                                var ot = ir + Math.random() * (or - ir);

								var px = Math.cos(at) * ot + ex;
								var py = Math.sin(at) * ot + ey;
								var s = 3;

								eng.dc.beginPath();
								eng.dc.strokeStyle = c_colWhite;
								eng.dc.lineWidth = 2;
								eng.dc.moveTo(px - s, py - s);
								eng.dc.lineTo(px + s, py + s);
								eng.dc.moveTo(px - s, py + s);
								eng.dc.lineTo(px + s, py - s);
								eng.dc.stroke();
							}
						}
						break;
					case 6:
						if (!this.m_renderFeature['brooth_war'])
						{
							eng.dc.fill();
						}
						else
						{
							eng.dc.beginPath();
							eng.dc.fillStyle = c_colWhite;
							eng.dc.arc(ex + gr * 0.55, ey + gr * 0.5, 3, 0, Math.PI * 2, true);
							eng.dc.fill();
							eng.dc.beginPath();
							eng.dc.strokeStyle = c_colWhite;
							eng.dc.lineWidth = 1;
							eng.dc.moveTo(ex + gr * 0.55, ey + gr * 0.5);
							eng.dc.lineTo(ex + gr * 0.55, ey + gr * 0.7);
							eng.dc.lineTo(ex + gr * 0.65, ey + gr * 0.7);
							eng.dc.stroke();
							eng.dc.fillStyle = c_colWhite;
							hld.setFont(eng.dc, c_smallPxs, c_textAlignLeft, c_colWhite);
							eng.dc.fillText("Brooth", ex + gr * 0.675, ey + gr * 0.725);
							eng.dc.fillText("War", ex + gr * 0.675, ey + gr * 0.725 + c_smallPxs);
						}
						break;
					case 7:
						if (!this.m_renderFeature['cascade_leap_drive'])
						{
							eng.dc.fill();
						}
						eng.dc.beginPath();
						eng.dc.fillStyle = c_colWhite;
						eng.dc.arc(ex - gr * 0.2, ey + gr * 0.7, 3, 0, Math.PI * 2, true);
						eng.dc.fill();
						if (!this.m_renderFeature['cascade_leap_drive'])
						{
							eng.dc.beginPath();
							eng.dc.strokeStyle = c_colWhite;
							eng.dc.lineWidth = 2;
							eng.dc.setLineDash([3, 3]);
							eng.dc.arc(ex - gr * 0.2, ey + gr * 0.7, 9, 0, Math.PI * 2, true);
							eng.dc.stroke();
							eng.dc.setLineDash([0, 0]);
						}
						eng.dc.beginPath();
						eng.dc.moveTo(ex - gr * 0.2, ey + gr * 0.7);
						eng.dc.lineTo(ex - gr * 0.2, ey + gr * 0.925);
						eng.dc.lineTo(ex - gr * 0.1, ey + gr * 0.925);
						eng.dc.stroke();
						hld.setFont(eng.dc, c_smallPxs, c_textAlignLeft, c_colWhite);
						eng.dc.fillText("Earth", ex - gr * 0.09, ey + gr * 0.95);

						if (this.m_renderFeature['stellar_manifold'])
						{
							for (var i = 0; i < 3; ++i)
							{
								eng.dc.translate(ex - gr * 0.05, ey + gr * 0.65);
								eng.dc.rotate(i * Math.PI * 2 / 3);
								var t = ((this.m_lastUpdateMS % 2500) / 2500) * Math.PI * 2;
								var s = Math.sin(t) * 0.15 + 0.35;
								eng.dc.scale(s, 1);
								eng.dc.beginPath();
								eng.dc.strokeStyle = c_colWhite;
								eng.dc.lineWidth = 2;
								eng.dc.arc(0, 0, 8, 0, Math.PI * 2, true);
								eng.dc.stroke();
								eng.dc.setTransform(1, 0, 0, 1, 0, 0);
								eng.dc.lineWidth = 1;
							}
						}
						if (this.m_renderFeature['first_contact'])
						{
							eng.dc.beginPath();
							eng.dc.fillStyle = c_colWhite;
							eng.dc.arc(ex + gr * 0.25, ey + gr * 0.65, 3, 0, Math.PI * 2, true);
							eng.dc.fill();
							eng.dc.beginPath();
							eng.dc.moveTo(ex + gr * 0.25, ey + gr * 0.65);
							eng.dc.lineTo(ex + gr * 0.25, ey + gr * 0.85);
							eng.dc.lineTo(ex + gr * 0.35, ey + gr * 0.85);
							eng.dc.stroke();
							hld.setFont(eng.dc, c_smallPxs, c_textAlignLeft, c_colWhite);
							eng.dc.fillText("First", ex + gr * 0.36, ey + gr * 0.875);
							eng.dc.fillText("Contact", ex + gr * 0.36, ey + gr * 0.875 + c_smallPxs);
						}
						break;
					case 8:
						if (!this.m_renderFeature['defeat_empire'])
						{
							eng.dc.fill();
						}
						else
						{
							eng.dc.fillStyle = c_colWhite;
							hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
							eng.dc.fillText("Defeat", ex - gr * 0.625, ey + gr * 0.3);
							eng.dc.fillText("Empire", ex - gr * 0.625, ey + gr * 0.3 + c_smallPxs);
						}
						if (this.m_renderFeature['niven_ring'])
						{
							eng.dc.beginPath();
							eng.dc.strokeStyle = c_colWhite;
							eng.dc.lineWidth = 3;
							eng.dc.arc(ex - gr * 0.425, ey + gr * 0.475, 6, 0, Math.PI * 2, true);
							eng.dc.stroke();
							eng.dc.beginPath();
							eng.dc.lineWidth = 1;
							eng.dc.moveTo(ex - gr * 0.425 - 3, ey + gr * 0.475 + 3);
							eng.dc.lineTo(ex - gr * 0.425 - 53, ey + gr * 0.475 + 53);
							eng.dc.stroke();
							eng.dc.fillStyle = c_colWhite;
							hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
							eng.dc.fillText("Niven", ex - gr * 0.425 - 53, ey + gr * 0.475 + 53 + c_smallPxs);
							eng.dc.fillText("Ring", ex - gr * 0.425 - 53, ey + gr * 0.475 + 53 + 2 * c_smallPxs);
						}
						break;
					case 9:
						if (!this.m_renderFeature['crush_alliance'])
						{
							eng.dc.fill();
						}
						else
						{
							eng.dc.fillStyle = c_colWhite;
							hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
							eng.dc.fillText("Crush", ex - gr * 0.625, ey - gr * 0.4);
							eng.dc.fillText("Rebel", ex - gr * 0.625, ey - gr * 0.4 + c_smallPxs);
							eng.dc.fillText("Alliance", ex - gr * 0.625, ey - gr * 0.4 + 2 * c_smallPxs);
						}
						break;
					case 10:
						if (!this.m_renderFeature['join_federation'])
						{
							eng.dc.fill();
						}
						else
						{
							eng.dc.fillStyle = c_colWhite;
							hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
							eng.dc.fillText("Join", ex, ey - gr * 0.7);
							eng.dc.fillText("Federation", ex, ey - gr * 0.7 + c_smallPxs);
						}
						break;
					case 11:
						if (!this.m_renderFeature['progenitor_domain'])
						{
							eng.dc.fill();
						}
						else
						{
							eng.dc.fillStyle = c_colWhite;
							hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
							eng.dc.fillText("Progenitor", ex + gr * 0.6, ey - gr * 0.35);
							eng.dc.fillText("Domain", ex + gr * 0.6, ey - gr * 0.35 + c_smallPxs);
						}
						break;
				}
				// Draw the sector border
				eng.dc.beginPath();
				eng.dc.lineWidth = 2;
				eng.dc.strokeStyle = "rgba(255, 255, 255, 0.5)";
				eng.dc.arc(ex, ey, ir, sa, ea, false);
//				eng.dc.lineTo(ex, ey);
				eng.dc.arc(ex, ey, or, ea, sa, true);
				eng.dc.closePath();
				eng.dc.stroke();
			}
		}
	},
	renderClick : function()
	{
		for (var i = 0; i < this.m_clickList.length; ++i)
		{
			var px = this.m_clickList[i][0] + Math.sin(this.m_clickList[i][2] * Math.PI * 2 * 2 / c_clickTime) * 25 * this.m_clickList[i][2] / c_clickTime;
			var py = this.m_clickList[i][1] - this.m_clickList[i][2] * 100 / c_clickTime;
			var sc = 0.5 * (0.25 + 0.75 * this.m_clickList[i][2] / c_clickTime);

			var al = 1.0 - (0.8 * this.m_clickList[i][2] / c_clickTime);

			eng.dc.beginPath();
			eng.dc.globalAlpha = al;
			eng.dc.translate(px, py);
			//eng.dc.rotate(ta + Math.PI * 0.5);
			eng.dc.scale(sc, sc);
			eng.dc.translate(-this.m_click.width / 2, -this.m_click.height / 2);
			eng.dc.drawImage(this.m_click, 0, 0);
			eng.dc.setTransform(1, 0, 0, 1, 0, 0);
			eng.dc.globalAlpha = 1;
		}
	},
	renderPostPhysical : function()
	{
		if (!this.m_ppChoice)
		{
			return;
		}
		var ww = eng.m_gameWidth - (c_shipColumnWidth + c_eventButtonWidth);
		var wh = eng.m_gameHeight - (c_statHeight + c_bottomBar);

		var dx = c_shipColumnWidth + ww * 0.1;
		var dy = c_statHeight + wh * 0.2;
		var dw = ww * 0.8;
		var dh = wh * 0.6;

		eng.dc.fillStyle = c_colBlack;
		hld.roundRect(eng.dc, dx, dy, dw, dh, 10).fill();
		eng.dc.strokeStyle = c_colWhite;
		eng.dc.lineWidth = 3;
		hld.roundRect(eng.dc, dx, dy, dw, dh, 10).stroke();

		var px = c_shipColumnWidth + ww * 0.5;
		var py = dy;
		py += c_largePxs;

		hld.setFont(eng.dc, c_largePxs, c_textAlignCenter, c_colWhite);
		eng.dc.fillText("Go Post Physical", px, py);
		py += c_smallPxs * 1.5;
		hld.setFont(eng.dc, c_smallPxs, c_textAlignCenter, c_colWhite);
		eng.dc.fillText("Leave the physical world and ascend to a post physical state.", px, py);
		py += c_smallPxs;
		eng.dc.fillText("You will restart at 1960 level technology but you will have a number of", px, py);
		py += c_smallPxs;
		eng.dc.fillText("Post Physical Intelligences (P.P.I) to look out for your galactic culture - ", px, py);
		py += c_smallPxs;
		eng.dc.fillText("giving you a permanent production bonus", px, py);

		var sx = dx + ww * 0.15;
		var sy = py + c_largePxs * 1.5;
		eng.dc.fillText("Current PPI", sx, sy);
		sy += c_smallPxs;
		var ppiStr = bigNumStr(this.m_ppi);
		eng.dc.fillText(ppiStr, sx, sy);
		sy += c_smallPxs * 1.5;

		eng.dc.fillText("Gained after ascension", sx, sy);
		sy += c_smallPxs;
		var newPpiStr = bigNumStr(this.m_newPpi);
		eng.dc.fillText(newPpiStr, sx, sy);
		sy += c_smallPxs * 1.5;

		eng.dc.fillText("Bonus per PPI", sx, sy);
		sy += c_smallPxs;
		eng.dc.fillText(this.m_ppiBonus.toFixed(1) + "%", sx, sy);

		this.m_ppButtons.render();
	},
	renderSettings : function()
	{
		if (!this.m_settingMode)
		{
			return;
		}
		var ww = eng.m_gameWidth - (c_shipColumnWidth + c_eventButtonWidth);
		var wh = eng.m_gameHeight - (c_statHeight + c_bottomBar);

		var dx = c_shipColumnWidth + ww * 0.1;
		var dy = c_statHeight + wh * 0.2;
		var dw = ww * 0.8;
		var dh = wh * 0.6;

		eng.dc.fillStyle = c_colBlack;
		hld.roundRect(eng.dc, dx, dy, dw, dh, 10).fill();
		eng.dc.strokeStyle = c_colWhite;
		eng.dc.lineWidth = 3;
		hld.roundRect(eng.dc, dx, dy, dw, dh, 10).stroke();

		var px = c_shipColumnWidth + ww * 0.5;
		var py = dy;
		py += c_largePxs;

		hld.setFont(eng.dc, c_largePxs, c_textAlignCenter, c_colWhite);
		eng.dc.fillText("Settings", px, py);
		hld.setFont(eng.dc, c_smallPxs, c_textAlignLeft, c_colWhite);
		px = dx + 110;
		py += c_smallPxs * 2.5;
		eng.dc.fillText("Hard reset will completely reset your game", px, py);
		py += c_smallPxs * 1;
		eng.dc.fillText("as if you'd never played it", px + 20, py);
		py += c_smallPxs * 2;
		eng.dc.fillText("Toggle the sound system", px, py);
		py += c_smallPxs * 3;
		eng.dc.fillText("Visit the Square Dog Studio site", px, py);

		hld.setFont(eng.dc, c_smallPxs, c_textAlignRight, c_colGray);
		eng.dc.fillText("Ver 1.0.5", dx + dw - 10, dy + dh - c_smallPxs * 0.5);

		this.m_settingButtons.render();
	},
	touchDown : function(mx, my)
	{
		if (this.m_ppChoice)
		{
			var processed = this.m_ppButtons.touchDown(mx, my);
			return;
		}
		if (this.m_settingMode)
		{
			var processed = this.m_settingButtons.touchDown(mx, my);
			return;
		}
		var processed = this.m_shipControls.touchDown(mx, my);
		if (processed)
		{
			return;
		}
		// Add money for a click
		var dps = 0;
		for (var i = 0; i < c_shipTable.length; ++i)
		{
			dps += this.m_shipDPS[i];
		}
		var newAmount = dps * 0.25;
		this.m_curMoney += newAmount;
		this.m_clickList.push([mx, my, 0]);
	},
	touchDrag : function(mx, my)
	{
		if (this.m_ppChoice)
		{
			var processed = this.m_ppButtons.touchDrag(mx, my);
			return;
		}
		if (this.m_settingMode)
		{
			var processed = this.m_settingButtons.touchDrag(mx, my);
			return;
		}
		var processed = this.m_shipControls.touchDrag(mx, my);
		if (processed)
		{
			return;
		}
	},
	touchUp : function(mx, my)
	{
		if (this.m_ppChoice)
		{
			var processed = this.m_ppButtons.touchUp(mx, my);
			return;
		}
		if (this.m_settingMode)
		{
			var processed = this.m_settingButtons.touchUp(mx, my);
			return;
		}
		var processed = this.m_shipControls.touchUp(mx, my);
		if (processed)
		{
			return;
		}
	},
	buyShip : function(bn)
	{
		var totalCost = this.calculateCost(bn.m_shipId);
		if (this.m_curMoney >= totalCost)
		{
			this.m_curMoney -= totalCost;
			this.m_shipCounts[bn.m_shipId] += this.m_buyAmount;
			this.calculateDPS(bn.m_shipId);
			this.m_shipCost[bn.m_shipId] = this.calculateCost(bn.m_shipId);
			this.updateShipButtonText(bn.m_shipId);
			this.saveToLocalStorage();
		}
	},
	calculateCost : function(sid)
	{
		var totalCost = 0;
		for (var i = 0; i < this.m_buyAmount; ++i)
		{
			var unitCost = 1 + (c_shipTable[sid][c_col.exponent] / 100);
			unitCost = Math.pow(unitCost, this.m_shipCounts[sid] + i);
			unitCost *= c_shipTable[sid][c_col.baseCost];
			totalCost += unitCost;
		}
		// Apply any global discounts here
		return totalCost;
	},
	calculateDPS : function(sid)
	{
		this.m_shipLevelMult[sid] = 1;
		var i = 0;
		while ((i < c_shipLevels[sid * 2].length) &&
			(c_shipLevels[sid * 2][i] <= this.m_shipCounts[sid]))
		{
			this.m_shipLevelMult[sid] *= c_shipLevels[sid * 2 + 1][i];
			++i;
		}
		this.m_shipLevel[sid] = i - 1;
		// event bonuses
		this.m_ppiBonus = c_basePPIBonus;
		this.m_shipDPS[sid] = this.m_shipCounts[sid] * c_shipTable[sid][c_col.dps];
		var eventDpsBonusMult = 1;
		for (var i = 0; i < c_eventTable.length; ++i)
		{
			if (this.m_eventPurchased[i])
			{
				if ((c_eventTable[i][2] == 12) || (c_eventTable[i][2] == sid))
				{
					eventDpsBonusMult *= c_eventTable[i][3];
				}
				if (c_eventTable[i][2] == 13)
				{
					this.m_ppiBonus += c_eventTable[i][3];
				}
			}
		}
		// Calculate the dps
		this.m_shipDPS[sid] *= eventDpsBonusMult;
		var ppiDpsBonusMult = 1.0 + (this.m_ppi * this.m_ppiBonus / 100);
		this.m_shipDPS[sid] *= ppiDpsBonusMult;
		this.m_shipDPS[sid] *= this.m_shipLevelMult[sid];
	},
	buyAmount : function(bn)
	{
		this.m_buyAmount = bn.m_amount;
		for (var i = 0; i < this.m_buyAmountButtons.length; ++i)
		{
			if (this.m_buyAmountButtons[i].m_amount == this.m_buyAmount)
			{
				this.m_buyAmountButtons[i].m_fillCol = c_colWhite;
				this.m_buyAmountButtons[i].m_textEntries[0].m_textColor = c_colBlack;
				this.m_buyAmountButtons[i].m_textEntries[0].m_invTextColor = c_colWhite;
				this.m_buyAmountButtons[i].m_active = false;
			}
			else
			{
				this.m_buyAmountButtons[i].m_fillCol = null;
				this.m_buyAmountButtons[i].m_textEntries[0].m_textColor = c_colWhite;
				this.m_buyAmountButtons[i].m_textEntries[0].m_invTextColor = c_colBlack;
				this.m_buyAmountButtons[i].m_active = true;
			}
		}
		// Recalculate the costs
		for (var i = 0; i < c_shipTable.length; ++i)
		{
			this.m_shipCost[i] = this.calculateCost(i);
			this.updateShipButtonText(i);
		}
	},
	viewToggle : function(bn)
	{
		this.m_showLevel = !this.m_showLevel;
		if (this.m_showLevel)
		{
			bn.m_textEntries[0].m_text = "$ / s";
		}
		else
		{
			bn.m_textEntries[0].m_text = "Lvl";
		}
		for (var i = 0; i < c_shipTable.length; ++i)
		{
			this.updateShipButtonText(i);
		}
	},
	updateShipButtonText : function(sid)
	{
		var sb = this.m_shipButtons[sid];
		var shipString = mut.intWithCommas(this.m_shipCounts[sid]) + " " + c_shipTable[sid][c_col.name];
		if (this.m_shipCounts[sid] != 1)
		{
			shipString += "s";
		}
		shipString += " L" + (this.m_shipLevel[sid] + 1);
		sb.m_textEntries[0].m_text = shipString;
		var costString = "$" + bigNumStr(this.m_shipCost[sid]);
		sb.m_textEntries[1].m_text  = costString;
		if (this.m_showLevel)
		{
			var levelString;
			if (this.m_shipLevel[sid] < c_shipLevels[sid * 2].length)
			{
				levelString = "L" + (this.m_shipLevel[sid] + 2)
					+ " at " + mut.intWithCommas(c_shipLevels[sid * 2][this.m_shipLevel[sid] + 1])
					+ " (x " + c_shipLevels[sid * 2 + 1][this.m_shipLevel[sid] + 1] + ")";
			}
			else
			{
				levelString = "Max level";
			}
			sb.m_textEntries[2].m_text  = levelString;
		}
		else
		{
			var dpsString = bigNumStr(this.m_shipDPS[sid]) + " /s";
			sb.m_textEntries[2].m_text  = dpsString;
		}
	},
	purchaseEventButtonResponse : function(bn)
	{
		if (this.m_curMoney > c_eventTable[bn.m_eventId][4])
		{
			this.m_curMoney -= c_eventTable[bn.m_eventId][4];
			this.m_eventPurchased[bn.m_eventId] = true;
			var s = c_eventTable[bn.m_eventId][0];
			++this.m_numPurchasedEvents[s];
			++this.m_totalEventsPurchased;
			var df = c_eventTable[bn.m_eventId][5];
			if (df != null)
			{
				this.m_renderFeature[df] = true;
			}
			for (var i = 0; i < c_shipTable.length; ++i)
			{
				this.calculateDPS(i);
				this.m_shipCost[i] = this.calculateCost(i);
				this.updateShipButtonText(i);
			}
			// Check to see if you've moved to the next stage
			for (var i = 0; i < c_eventTable.length; ++i)
			{
				if (!this.m_eventPurchased[i])
				{
					this.m_curStage = c_eventTable[i][0];
					break;
				}
			}
			this.updateEventButtonText();
			this.saveToLocalStorage();
		}
	},
	updateEventButtonText : function()
	{
		this.m_nextStageEvent = false;
		var bi = 0;
		var ei = 0;
		var bDone = false;
		while (true)
		{
			if (bi >= c_numEventButtons)
			{
				break;
			}
			if (ei >= c_eventTable.length)
			{
				break;
			}
			if (c_eventTable[ei][0] > this.m_curStage)
			{
				break;
			}
			if (this.m_eventPurchased[ei])
			{
				++ei;
				continue;
			}
			if (ei == this.m_finalEventInStage[this.m_curStage])
			{
				if (bi > 0)
				{
					break;
				}
				this.m_eventButtons[0].m_visible = false;
				this.m_eventButtons[0].m_eventId = -1;
				this.m_eventButtons[1].m_visible = false;
				this.m_eventButtons[1].m_eventId = -1;
				bi = 2;
				this.m_nextStageEvent = true;
			}
			var button = this.m_eventButtons[bi];
			button.m_textEntries[0].m_text = c_eventTable[ei][1];
			button.m_textEntries[1].m_text = "$" + bigNumStr(c_eventTable[ei][4]);
			if (c_eventTable[ei][2] < c_shipTable.length)
			{
				var typeStr = c_shipTable[c_eventTable[ei][2]][0];
				var typeAmount = c_eventTable[ei][3];
				button.m_textEntries[2].m_text = typeStr + " x" + typeAmount;
			}
			else if (c_eventTable[ei][2] == 12)
			{
				var typeAmount = c_eventTable[ei][3];
				button.m_textEntries[2].m_text = "Production x" + typeAmount;
			}
			else if (c_eventTable[ei][2] == 13)
			{
				var typeAmount = c_eventTable[ei][3];
				button.m_textEntries[2].m_text = "PPI +" + typeAmount.toFixed(1) + "%";
			}
			if (c_eventTable[ei][5] != null)
			{
				button.m_textEntries[3].m_text = "!";
			}
			else
			{
				button.m_textEntries[3].m_text = null;
			}
			button.m_visible = true;
			button.m_eventId = ei;

			++bi;
			++ei;
		}
		for (var i = bi; i < c_numEventButtons; ++i)
		{
			var button = this.m_eventButtons[i];
			button.m_visible = false
			button.m_eventId = -1;
		}
	},
	goPostPhysical : function()
	{
		this.m_ppChoice = true;
	},
	softReset : function()
	{
		this.reset(false);
		this.saveToLocalStorage();
	},
	hardReset : function()
	{
//		localStorage.removeItem('m_olStr');
		this.reset(true);
		this.saveToLocalStorage();
	},
	reset : function(hard)
	{
		this.m_shipCounts = [ ];
		this.m_shipLevel = [ ];
		this.m_shipLevelMult = [ ];
		this.m_shipDPS = [ ];
		this.m_shipCost = [ ];
		for (var i = 0; i < c_shipTable.length; ++i)
		{
			this.m_shipCounts.push(0);
			this.m_shipLevel.push(-1);
			this.m_shipLevelMult.push(1);
			this.m_shipDPS.push(0);
			this.m_shipCost.push(c_shipTable[i][c_col.baseCost]);
		}
		this.m_eventPurchased = [ ];
		this.m_renderFeature = [ ];

		var startTime = new Date();
		this.m_lastUpdateMS = startTime.getTime();

		this.m_curMoney = c_shipTable[0][c_col.baseCost];
		this.m_totalMoney = this.m_curMoney;
		if (hard)
		{
			this.m_playTime = 0;
			this.m_ppi = 0;
			this.m_lastAssend = -1;
		}
		else
		{
//			this.m_playTime = 0;
			this.m_ppi += this.m_newPpi;
			this.m_lastAssend = this.m_playTime;
		}
		this.m_newPpi = 0;
		this.m_ppiBonus = c_basePPIBonus;

		this.m_curStage = c_stage.earth;

		this.m_totalEventsPurchased = 0;
		this.m_numPurchasedEvents = [ ];
		for (var i = 0; i < this.m_numEvents.length; ++i)
		{
			this.m_numPurchasedEvents.push(0);
		}

		this.buyAmount(this.m_buyOneButton);
		for (var i = 0; i < c_shipTable.length; ++i)
		{
			this.calculateDPS(i);
			this.m_shipCost[i] = this.calculateCost(i);
			this.updateShipButtonText(i);
		}
		this.updateEventButtonText();
	},
	openSettings : function()
	{
		this.m_settingMode = true;
	},
	ascendResponse : function()
	{
		this.reset(false);
		this.m_ppChoice = false;
	},
	ascendCancelResponse : function()
	{
		this.m_ppChoice = false;
	},
	hardReset : function()
	{
		this.reset(true);
		this.m_settingMode = false;
	},
	toggleSound : function()
	{
		this.m_settingMode = false;
	},
	squareDog : function()
	{
		this.m_settingMode = false;
	},
	exitSettings : function()
	{
		this.m_settingMode = false;
	}
});


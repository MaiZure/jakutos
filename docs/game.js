 
function initActor(ch)
{
	/* Properties */
	this.map_x = Math.round(Math.random()*WORLD_SIZE_X-4)+2;
	this.map_y = Math.round(Math.random()*WORLD_SIZE_Y-4)+2;
	this.next_x = this.map_x;
	this.next_y = this.map_y;
	this.offset_x = 0;
	this.offset_y = 0;
	this.color = "rgb(224,224,224)";
	this.is_player = false;
	this.dirty = true;
	this.avatar = ch;
	this.animating = false;
	
	/* Methods */
	this.render = renderActor;
	this.move_left = _move_left;
	this.move_up = _move_up;
	this.move_right = _move_right;
	this.move_down = _move_down;
	this.ai_move = _ai_move;
	this.is_visible = _is_visible;
	this.can_move = _can_move;
	this.moveAnimate = _moveAnimate;
	
	/* Externs */
	this.world = Region;
}

function renderActor(target_context)
{
	if (!this.is_visible()) { this.dirty = false; return; } /* culling */
	
	target_context.font = (Camera.font_size+" Sans-Serif");
	target_context.fillStyle = this.color;
	target_context.textAlign = "center";
	var current_view_grid_x = this.map_x-Camera.view_grid_x;
	var current_view_grid_y = this.map_y-Camera.view_grid_y;
	var current_view_pixel_x = 32+current_view_grid_x*Camera.grid_size+this.offset_x;
	var current_view_pixel_y = 32+current_view_grid_y*Camera.grid_size+this.offset_y;
	target_context.fillText(this.avatar,current_view_pixel_x,current_view_pixel_y);
	
}

function _move_left() { if (this.can_move(this.map_x-1,this.map_y)) { this.next_x-=1; this.animating = true; this.dirty = true; }}
function _move_up() { if (this.can_move(this.map_x,this.map_y-1)) { this.next_y-=1; this.animating = true; this.dirty = true; }}
function _move_right() { if (this.can_move(this.map_x+1,this.map_y)) { this.next_x+=1; this.animating = true; this.dirty = true; }}
function _move_down() { if (this.can_move(this.map_x,this.map_y+1)) { this.next_y+=1; this.animating = true; this.dirty = true; }}

function _moveAnimate()
{
	if (this.next_x < this.map_x) { this.offset_x-=ANIMATION_STEPS;}
	if (this.next_x > this.map_x) { this.offset_x+=ANIMATION_STEPS;}
	if (this.next_y < this.map_y) { this.offset_y-=ANIMATION_STEPS;}
	if (this.next_y > this.map_y) { this.offset_y+=ANIMATION_STEPS;}
	
	if (Math.abs(this.offset_x) == Camera.grid_size || Math.abs(this.offset_y) == Camera.grid_size) 
	{
		this.offset_x = 0;
		this.offset_y = 0;
		this.map_x = this.next_x;
		this.map_y = this.next_y;
		this.animating = false;
	}
}

function _ai_move()
{
	switch (Math.floor(Math.random()*4))
	{
		case 0: this.move_left(); break;
		case 1: this.move_up(); break;
		case 2: this.move_right(); break;
		case 3: this.move_down(); break;
	}
}

function _can_move(xx, yy)
{
	if (this.animating) {return false;}
	return this.world.is_clear(xx,yy);
}

function _is_visible()
{
	if (this.map_x < Camera.view_grid_x) {return false;}
	if (this.map_x > Camera.view_grid_x+Camera.view_grid_width-1) {return false;}
	if (this.map_y < Camera.view_grid_y) {return false;}
	if (this.map_y > Camera.view_grid_y+Camera.view_grid_height-1) {return false;}	
	return true;
}

const COL_MAP_WATER = 'rgb(100,100,175)';
const COL_MAP_DIRT = 'rgb(170,100,50)';
const COL_MAP_GRASS = 'rgb(20,150,50)';
const COL_MAP_MOUNTAIN = 'rgb(175,185,200)';
 
function random_grass_color()
{
	var r,g,b;
	r = Math.round(Math.random()*40)+0;
	g = Math.round(Math.random()*100)+100;
	b = Math.round(Math.random()*40)+20;
	return "rgb("+r+","+g+","+b+")";
}

function random_water_color()
{
	var r,g,b;
	r = Math.round(Math.random()*20)+90;
	g = Math.round(Math.random()*20)+90;
	b = Math.round(Math.random()*50)+150;
	return "rgb("+r+","+g+","+b+")";
}

function random_dirt_color()
{
	var r,g,b;
	r = Math.round(Math.random()*40)+150;
	g = Math.round(Math.random()*40)+80;
	b = Math.round(Math.random()*40)+20;
	return "rgb("+r+","+g+","+b+")";
}

function random_mountain_color()
{
	var r,g,b;
	r = Math.round(Math.random()*30)+160;
	g = Math.round(Math.random()*10)+r;
	b = Math.round(Math.random()*60)+170;
	return "rgb("+r+","+g+","+b+")";
}

 
/* Kick off the game when the window loads */
window.addEventListener("load", gameInit, false);

/* Capture key pressed when the Document has focus */
document.addEventListener("keydown", doKeyDown, false);

function initHud()
{
	this.dirty = true;
	this.minimap_world_dirty = true;
	this.minimap_viewbox_dirty = true;
	
	this.render_hud_text = render_hud_text;
	this.render = renderHud;
	
	this.Minimap = new initMinimap();
	
	this.render();
}

function renderHud()
{
	if (this.dirty) { this.render_hud_text(wctx); }
	this.Minimap.render();
	this.dirty = false;
}

function render_hud_text(target_context)
{
	/* Old stuff
	target_context.font = BASE_FONT_SIZE+" Sans-Serif";
	target_context.fillStyle = FG_COLOR;
	target_context.textAlign = "right";
	var animateOut = SETTING_ANIMATE ? "Animations ON" : "Animations OFF";
	target_context.fillText(animateOut,target_context.canvas.width,50);	
	*/
}

function gameInit()
{
	var i;
	
	Camera = new initCamera();
	Region = new initRegion();
	Player = create_player();
	
	Monsters = [];
	for (i=0; i<NUMBER_OF_MONSTERS; i++) { Monsters[i] = create_monster(); }
	
	worldCanvas.width = Math.round(window.innerWidth*0.96);
	worldCanvas.height = Math.round(window.innerHeight*0.96);
	actorCanvas.width = Math.round(window.innerWidth*0.96);
	actorCanvas.height = Math.round(window.innerHeight*0.96);
	
	Hud = new initHud();
	Camera.refocus(Player.map_x, Player.map_y, true);
	Camera.render(wctx,actx);
}

function create_player()
{
	var actor = new initActor("@");
	actor.is_player = true;
	return actor;
}

function create_monster()
{
	var actor = new initActor("s");
	actor.color = "rgb(224,224,0)";
	return actor;
}

function doKeyDown(event)
{
	var i;
	
	/* In lieu of a formal game loop (async-type state-machine), I'll trigger updates based on all key presses */
	switch (event.keyCode)
	{	
		case KB_LEFT: Player.move_left(); break;
		case KB_UP: Player.move_up(); break;
		case KB_RIGHT: Player.move_right(); break;
		case KB_DOWN: Player.move_down(); break;
		case KB_A: toggle_animate(); break;
		case KB_C: Camera.refocus(Player.map_x, Player.map_y); break;
		case KB_MINUS: Camera.zoom_out(); break;
		case KB_PLUS: Camera.zoom_in(); break;
	}
	
	for (i=0; i<Monsters.length; i++) { Monsters[i].ai_move(); }
	
	Camera.render(wctx,actx);
}

worldCanvas = document.getElementById("World");
actorCanvas = document.getElementById("Actors");
wctx = worldCanvas.getContext("2d");
actx = actorCanvas.getContext("2d");


function initMinimap()
{
	this.minimap_world_dirty = true;
	this.minimap_viewbox_dirty = true;
	
	this.base_x = worldCanvas.width-WORLD_SIZE_X;
	this.base_y = worldCanvas.height-WORLD_SIZE_Y;
	
	this.render = renderMinimap;
	this.clear_minimap = clear_minimap;
	this._renderTerrain = renderTerrain;
	this._renderViewbox = renderViewbox;
}

function renderMinimap()
{
	if (this.minimap_world_dirty) { this._renderTerrain(wctx); }
	if (this.minimap_viewbox_dirty) { this._renderViewbox(actx); }
}

function renderTerrain(target_context)
{
	var i,j, px, py;
	for (j=0; j<WORLD_SIZE_Y; j++)
	{
		for (i=0; i<WORLD_SIZE_X; i++)
		{
			px = this.base_x+i;
			py = this.base_y+j;
			
			target_context.fillStyle = Region.gridcol[j][i]
			target_context.fillRect(px,py,1,1);
		}
	}
	
	this.minimap_world_dirty = false;
}

function renderViewbox(target_context)
{
	clear_minimap(target_context);
	
	px = worldCanvas.width-WORLD_SIZE_X+Camera.view_grid_x+1;
	py = worldCanvas.height-WORLD_SIZE_Y+Camera.view_grid_y+1;
	target_context.strokeStyle = "rgb(255,255,0)";
	target_context.beginPath();
	target_context.lineTo(px,py);
	target_context.lineTo(px+Camera.view_grid_width,py);
	target_context.lineTo(px+Camera.view_grid_width,py+Camera.view_grid_height);
	target_context.lineTo(px,py+Camera.view_grid_height);
	target_context.lineTo(px,py);
	target_context.stroke();

	this.minimap_viewbox_dirty = false;
}

function clear_minimap(target_context)
{
	var xx = target_context.canvas.width-WORLD_SIZE_X;
	var yy = target_context.canvas.height-WORLD_SIZE_Y;
	var ww = WORLD_SIZE_X;
	var hh = WORLD_SIZE_Y;
	target_context.clearRect(xx,yy,ww,hh);
}
 

/* Constructor for the region (map) */
function initRegion()
{
	this.dirty = true;
	
	this.render = renderRegion;
	this.is_clear = _is_clear;
	this.grid = [[],[]]
	this.gridcol = [[],[]];
	this.build_map = _build_map;
	this.load_map = _load_map;
	
	this.load_map();
}

function renderRegion(target_context)
{
	var i,j, ch, col;
	target_context.font = Camera.font_size+" Courier";
	target_context.textAlign = "center";
	for (j=Camera.view_grid_y; j<Math.min(Camera.view_grid_y+Camera.view_grid_height,WORLD_SIZE_Y); j++)
	{
		for (i=Camera.view_grid_x; i<Math.min(Camera.view_grid_x+Camera.view_grid_width,WORLD_SIZE_X); i++)
		{
			switch (this.grid[j][i])
			{
				case 0: ch = "~"; break;
				case 1: 
				case 2: ch = "."; break;
				case 3: ch = "^"; break;
			}
			target_context.fillStyle = this.gridcol[j][i];
			target_context.fillText(ch,32+(i-Camera.view_grid_x)*Camera.grid_size,32+(j-Camera.view_grid_y)*Camera.grid_size);
		}
	}
	this.dirty = false;
}

function _is_clear(xx, yy)
{
	if (xx < 0) { return false; }
	if (yy < 0) { return false; }
	if (xx >= WORLD_SIZE_X) { return false; }
	if (yy >= WORLD_SIZE_Y) { return false; }
	if (this.grid[yy][xx] < 3) { return true; } else { return false; }
}

function _build_map()
{
	for (i=0; i<WORLD_SIZE_X; i++) 
	{
		this.grid[i] = [];
		this.gridcol[i] = [];
	}
	
	for (j=0; j<WORLD_SIZE_Y; j++)
	{
		for (i=0; i<WORLD_SIZE_X; i++)
		{
			if (Math.random() > 0.9) {this.grid[j][i] = 2; } else {this.grid[j][i] = 1;}
			
			switch (this.grid[j][i])
			{
				case 0: this.gridcol[j][i] = random_water_color(); break;
				case 1: this.gridcol[j][i] = GRASSLAND ? random_grass_color() : random_dirt_color(); break;
				case 2: this.gridcol[j][i] = random_mountain_color(); break;
			}
		}
	}
}

function _load_map()
{
	var ch;
	for (i=0; i<WORLD_SIZE_X; i++) 
	{
		this.grid[i] = [];
		this.gridcol[i] = [];
	}
	
	for (j=0; j<WORLD_SIZE_Y; j++)
	{
		for (i=0; i<WORLD_SIZE_X; i++)
		{
			ch = WORLD_MAP_1.charAt(j*128+i);
			
			switch (ch)
			{
				case '~': this.grid[j][i]=0; break;
				case '0': this.grid[j][i]=1; break;
				case '1': this.grid[j][i]=2; break;
				case '2': 
				case '3': 
				case '4': 
				case '5': 
				case '6': 
				case '7': 
				case '8': 
				case '9': this.grid[j][i]=3; break;
			}
			
			switch (this.grid[j][i])
			{
				case 0: this.gridcol[j][i] = COL_MAP_WATER; break;
				case 1: this.gridcol[j][i] = COL_MAP_DIRT; break;
				case 2: this.gridcol[j][i] = COL_MAP_GRASS; break;
				case 3: this.gridcol[j][i] = COL_MAP_MOUNTAIN; break;
			}
		}
	}
}

function initCamera()
{
	this.dirty = false;
	this.view_grid_x = 0;
	this.view_grid_y = 0;
	this.grid_size = 32;
	this.view_px_x = 0;
	this.view_px_y = 0;
	this.view_px_width = 768;
	this.view_px_height = 576;
	this.font_size = this.grid_size+"px";
	this.view_grid_width = this.view_px_width/this.grid_size;
	this.view_grid_height = this.view_px_height/this.grid_size;
	
	
	this.target_view_x = 0;
	this.target_view_y = 0;
	this.px_offset_x = 0;
	this.px_offset_y = 0;
	
	this.animate_camera = _animate_camera;
	this.zoom_in = world_rescale_up;
	this.zoom_out = world_rescale_down;
	this.refocus = refocus_view;
	this.render = renderWorld;
	this.rescale = recalculate_view_scale;
	this.clear_world = clear_world;
}

function renderWorld(world_context, actor_context)
{	
	var i;
	
	if (Player.animating)
	{
		if (SETTING_ANIMATE)
		{
			var count = 0;
			var timer = setTimeout(function() {
				var interval = setInterval(function(){
				count++;
				Player.moveAnimate();
				
				for (i=0; i<Monsters.length; i++) { Monsters[i].moveAnimate(); }
	
				Camera.clear_world(actor_context);
				Player.render(actor_context);
				
				for (i=0; i<Monsters.length; i++) { Monsters[i].render(actor_context); }
				
				if (count > (Camera.grid_size/ANIMATION_STEPS)) { clearInterval(interval); clearTimeout(timer);}
				}, 0)
			}, 24);
		}
		else
		{
			Player.map_x = Player.next_x;
			Player.map_y = Player.next_y;
			Player.animating = false;
			for (i=0; i<Monsters.length; i++) 
			{ 
				Monsters[i].map_x = Monsters[i].next_x;
				Monsters[i].map_y = Monsters[i].next_y;
				Monsters[i].animating = false;
			}
		}
		
		if (Player.map_x - this.view_grid_x < 5 || this.view_grid_x+this.view_grid_width-Player.map_x < 5)
			this.refocus(Player.map_x, Player.map_y);
		
		if (Player.map_y - this.view_grid_y < 5 || this.view_grid_y+this.view_grid_height-Player.map_y < 5)
			this.refocus(Player.map_x, Player.map_y);
		
	}
	
	if (Region.dirty) { this.clear_world(world_context); Region.render(world_context); }
	if (Player.dirty) { this.clear_world(actor_context); Player.render(actor_context); }
	Hud.render();
	
	for (i=0; i<Monsters.length; i++)
	{
		if (Monsters[i].dirty) 
		{ 
			Monsters[i].render(actor_context); 
		}
	}
}
 
function world_rescale_down()
{
	if (this.grid_size > 8)
	{
		Region.dirty = true;
		Hud.Minimap.minimap_viewbox_dirty = true;
		this.grid_size/=2;
		this.rescale();
		this.refocus(Player.map_x, Player.map_y, true);
	}
}

function world_rescale_up()
{
	if (this.grid_size < 128)
	{
		Region.dirty = true;
		Hud.Minimap.minimap_viewbox_dirty = true;
		this.grid_size*=2;
		this.rescale();
		this.refocus(Player.map_x, Player.map_y, true);
	}
}

function recalculate_view_scale()
{
	this.font_size = this.grid_size+"px";
	this.view_grid_width = this.view_px_width/this.grid_size;
	this.view_grid_height = this.view_px_height/this.grid_size;
}

function refocus_view(xx, yy, immediate = false)
{
	var i;
	var old_x = this.view_grid_x;
	var old_y = this.view_grid_y;
	
	if (!SETTING_ANIMATE || immediate)
	{
		this.view_grid_x = Math.round(xx-this.view_grid_width/2);
		this.view_grid_y = Math.round(yy-this.view_grid_height/2);
		
		this.view_grid_x = Math.max(this.view_grid_x,0);
		this.view_grid_y = Math.max(this.view_grid_y,0);
		
		this.view_grid_x = Math.min(WORLD_SIZE_X-this.view_grid_width,this.view_grid_x);
		this.view_grid_y = Math.min(WORLD_SIZE_Y-this.view_grid_height,this.view_grid_y);
		
		if (this.view_grid_x != old_x || this.view_grid_y != old_y)
		{
			this.dirty = true;
			Hud.Minimap.minimap_viewbox_dirty = true;
			Region.dirty = true;
			Player.dirty = true;
			for (i=0; i<Monsters.length; i++) { Monsters[i].dirty = true; }
		}
	}
	else
	{
		this.dirty = true;
		
		this.target_view_x = Math.round(xx-Camera.view_grid_width/2);
		this.target_view_y = Math.round(yy-Camera.view_grid_height/2);
		this.target_view_x = Math.max(Camera.target_view_x,0);
		this.target_view_y = Math.max(Camera.target_view_y,0);
		this.target_view_x = Math.min(WORLD_SIZE_X-Camera.view_grid_width,Camera.target_view_x);
		this.target_view_y = Math.min(WORLD_SIZE_Y-Camera.view_grid_height,Camera.target_view_y);
		
		if (Camera.dirty) {Camera.animate_camera();}
	}
}

function toggle_animate()
{
	Region.dirty = true;
	Hud.dirty = true;
	SETTING_ANIMATE = !SETTING_ANIMATE;
}

function _animate_camera()
{
	
	if (this.view_grid_x == this.target_view_x && this.view_grid_y == this.target_view_y)
	{
		this.dirty = false;
		return;
	}
	
	var timer = setTimeout(function() {
		var interval = setInterval(function(){
			
			if (Camera.view_grid_x < Camera.target_view_x) { Camera.view_grid_x++; }
			if (Camera.view_grid_x > Camera.target_view_x) { Camera.view_grid_x--; }
			if (Camera.view_grid_y < Camera.target_view_y) { Camera.view_grid_y++; }
			if (Camera.view_grid_y > Camera.target_view_y) { Camera.view_grid_y--; }
			
			if (Camera.view_grid_x == Camera.target_view_x && Camera.view_grid_y == Camera.target_view_y)
			{
				Camera.dirty = false;
				Hud.Minimap.minimap_viewbox_dirty = true;
			}
			
			Camera.clear_world(actx);
			Camera.clear_world(wctx);
			Player.render(actx);
			Region.render(wctx);
			Hud.render();
			for (i=0; i<Monsters.length; i++) { Monsters[i].render(actx); }
		
			if (!Camera.dirty) { clearInterval(interval); clearTimeout(timer);}
		}, 0)
	}, 24);
}

function clear_world(target_context)
{
	var xx = this.view_px_x;
	var yy = this.view_px_y;
	var ww = this.view_px_width+64;
	var hh = this.view_px_width+64;
	target_context.clearRect(xx, yy, xx+ww, yy+hh);
}
 
 /* Game Constants */
const WORLD_SIZE_X = 128;
const WORLD_SIZE_Y = 128;
const BASE_FONT_SIZE = "32px";
const VERSION_MAJOR = 0;
const VERSION_MINOR = 1;

/* Game Settings */
var SETTING_ANIMATE = true;
var NUMBER_OF_MONSTERS = 20;
var ANIMATION_STEPS = 2; /* 1 = slow, 2 = medium, 4 = fast */
var FG_COLOR = "rgb(170,170,170)"
var GRASSLAND = Math.round(Math.random());

/* Keyboard Codes */
const KB_LEFT = 37;
const KB_UP = 38;
const KB_RIGHT = 39;
const KB_DOWN = 40;
const KB_A = 65;
const KB_C = 67;
const KB_MINUS = 189;
const KB_PLUS = 187;
 

const WORLD_MAP_1 = "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~1~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~111~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~1~~~~~121~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~0~~~~~0000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~111~~~1121~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~0000~~~~0000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~11121111122111~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~12222222222221~~~~~~~~~~~~~~~~~~~~~~~~~00~~~~0000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~12223222222221~~~~~~~~~~~~~~~~~~~~~~~~~00000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~122232002322211~~~~~~~~~~~~~~~~~~~~~~~~~00000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~1112223000032222111~~~~~~~~~~~~~~~~~~~~~~~000000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~1112222230000322222211~~~~~~~~~~~~~~~~~~~~~~~~000000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~1111222232002222221111~~~~~~~~~~~~~~~~~~~~~~~~000000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~1111222222222111~~~~~~~~~~~~~~~~~~~~~~~~~~~000000~~~00000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~12222222221~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~00~~~~~~~~000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~11222211111~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~111211~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~111~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~00000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~1~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~0000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~0000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~00000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~00~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~00~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~00~~~~~~~~~~~~~~~~~~~~~~~~0~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~00~~~~~~~~~~~~~~~~~~~~~0000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~0000~~~~~~0~~~~~~~~~~00000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~0~~~~~~~~~~~~~~~~~~0000~~~~000~~~~~~~0000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~00~~~~~~~~~~~~~~~~~~000000000000~~~~0000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~0~~~~~~~~~~~00~~~~~~0000000000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~0~~~~~~~~~~~~~~~~~~~~11~~~~~~~~~~~~~~0~~~~~~~~~~~0000~~~0000000000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~00~~~~~~~~~~~~~~~~~~2211~~~~~~~0~~~~~00~~~~~~~~~~~00000000000000000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~0000~~~~~~~~~~~~0~~~33321~~~~~~0000000000~~~~~~~~~~00000000000000000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~0000~~~~~~~~~~~~112344432~~~~~~00000001000~~~~~~~~000000000000000000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~00000111~~~~~000123444432~~~~~~00110111111~~~~~00111111111000000000000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~000011111111~~~001122000332~~~~~~0011111111111111111111111100000000000000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~000112233322211111122000221~~~~~~~01111111111111111111111110001111000000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~0012233444333221112310000111~~~~~~0111111211111112111111111222221110000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~01123444444433221123100000010~~~~~0111111111111111111111111222222110000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~01234455555443322223100010000~~~~~00000111111111111111111122233221100000000000~~~~000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~012345555555443322232222210000~~~~000000001111111000000111122332211000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~013445566655544332233332221000~~~~~0000000000000000000002212333221100000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~023445566655544333333343332100~~~~~000000000000000000000221222222110000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~02344556665554433334444443210~~~~~~~0000000000000000000001122222110000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~01234555555544433334555443210~~~~~~~0000000000000000000001112222110000~~~~~~~~~~~~~~~~~~~~~~~~~~00~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~01234455555544333344555543210~~~~~~~000000000000000000000011111111000~~~~~~~~~~~~~~~~~~~~~~~~~~00000000~~~~~~~~~~~~~~~~~~~~~~~~~0112344455444333334555544321~~~~~~~~000000000000000000000011111110000~~~~~~~~~~~~~~~~~~~~~~~~~~000000000~~~~~~~~~~~~~~~~~~~~~~~~001123333333322233455554321~~~~~~~~0000000000000000000000001111110000~~~~~~~~~~~~~~~~~~~~~~~~~~00000000000~~~~~~~~~~~~~~~~~~~~~~00011222222222222345554432~~~~~~~~~000000000000000000000000111110000~~~~~~~~~~~~~~~~~~~~~~~~~~~00000000000~~~~~~~~~~~~~~~~~~~~~~000011111111111123445543~~~~~~~~~00000000000000000000000000011110000~~~~~~~~~~~~~~~~~~~~~~~~~~~~000000000~~~~~~~~~~~~~~~~~~~~~~~000000011110001122344432~~~~~~~~000000000000000000000000000001100000~~~~~~~~~~~~~~~~~~~~~~~~~~~~000000000~~~~~~~~~~~~~~~~~~~~~~~00000000000000011223332~~~~~~~~000000000000000000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~000000000~~~~~~~~~~~~~~~~~~~~~~~00000000000000001122221~~~~~~~00000000000000000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~00000000000~~~~~~~~~~~~~~~~~~~~~~00000000000000000111111~~~~~00000000000000000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~0000~~~~000~~~~~~~~~~~~~~~~~~~~~~0001111100000000000000~~~~~~00000000000000000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~000~~~~0~~~~~~~~~~~~~~~~~~~~~~~~001111111000000000000~~~~~~~00000000000000000000000000000000~~~~~~~~~~~~~~~~~~~0~~~~~~~~~~~~~~~~~00~~~~~~~~~~~~~~~~~~~~~~~~~~~~~001111111100000000000~~~~~~~00000000000000000000000000000000~~~~~~~~~~~~~~~~~~~000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~0111222111000000001~~~~~~~~~00000000000000000000000100000000~~~~~~~~~~~~~~~~~~0000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~011122211100000001~~~~~~~~~111110000000000000000000110000000~~~~~~~~~~~~1100000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~01122221110000001~~~~~~~~~~211111100000000000000000100010000011~~~~~~11111000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~01122221110000~~~~~~~~~~~~222211111000000000000000010001111001111111111110000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~01222221110000~~~~~~~~~33333222211111111111000001111001111111111111111100000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~01222221100000~~~~~~~~443333322222211111111111111111000100000101000000~~~~000000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~01222221100000~~~~~~4444433333333222222221111111111100010000000000000~~~~~00000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~02222211000000112234444443333333322222222212122111111000001000000000~~~~~~00000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~01222211000000112234444443333333322222111122222111111000001111100000~~~~~~0000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~01222110000000112233444443333333322222212112121111111111111111100000~~~~~~000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~0122211000~~~00112~~~44443333333322122111111111111110000000~~~~00000~~~~~000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~011111000~~~~~~11~~~~~~33333332222111111111111111000000000~~~~~~~000~~~~0000000000000000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~00111000~~~~~~~01~~~~~~~3333222221111111110000000000000000~~~~~~~0000000000000000~~~~00~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~0000000~~~~~~~~~1~~~~~~~~2222221111110000000000000~~~~000~~~~~~~~~00000000000000~~~~~~0~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~000000~~~~~~~~~~~0~~~~~~~~22111~~~000000~~~000000~~~~~~~~~~~~~~~~~~00000000000~~~~~~~~~~~~~~~~~~~~~~~~121~~~~~~~~~~~~~~~~~~~~~~~00000~~~~~~~~~~~~00~~~~~~~~1111~~~~~0000~~~~~000~~~~~~~~~~~~~~~~~~~~~~~~0000~~~~~~~~~~~~~~~~~~~~~~~~~3555~~~~~~~~~~~~~~~~~~~~~~~00000~~~~~~~~~~~~0~~~~~~~~~~100~~~~~~~0~~~~~~~00~~~~~~~~~~~~~~~~~~~~~~~~~00~~~~~~~~~~~~~~~~~~~~~~~~~~~777~~~~~~~~~~~~~~~~~~~~~~~0000~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~00~~~~~~~~~~~~~~~~~~~~~~~~~~~78752~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~7775~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~555~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~12~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";

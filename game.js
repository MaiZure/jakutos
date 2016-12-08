 
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
	if (!this.is_visible()) { return; } /* culling */
	
	target_context.font = (FONT_SIZE+" Sans-Serif");
	target_context.fillStyle = this.color;
	target_context.textAlign = "center";
	var current_view_grid_x = this.map_x-VIEW_GRID_X;
	var current_view_grid_y = this.map_y-VIEW_GRID_Y;
	var current_view_pixel_x = 32+current_view_grid_x*GRID_SIZE+this.offset_x;
	var current_view_pixel_y = 32+current_view_grid_y*GRID_SIZE+this.offset_y;
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
	
	if (Math.abs(this.offset_x) == GRID_SIZE || Math.abs(this.offset_y) == GRID_SIZE) 
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
	if (this.map_x < VIEW_GRID_X) {return false;}
	if (this.map_x > VIEW_GRID_X+VIEW_GRID_WIDTH) {return false;}
	if (this.map_y < VIEW_GRID_Y) {return false;}
	if (this.map_y > VIEW_GRID_Y+VIEW_GRID_HEIGHT) {return false;}	
	return true;
}
 
function random_grass_color()
{
	var r,g,b;
	r = Math.round(Math.random()*40)+0;
	g = Math.round(Math.random()*100)+100;
	b = Math.round(Math.random()*40)+20;
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
	this.world = Region;
	this.dirty = true;
	this.minimap = renderMinimap;
	this.render = renderHud;
}

function renderHud(target_context)
{
	target_context.font = BASE_FONT_SIZE+" Sans-Serif";
	target_context.fillStyle = FG_COLOR;
	target_context.textAlign = "right";
	var animateOut = SETTING_ANIMATE ? "Animations ON" : "Animations OFF";
	target_context.fillText(animateOut,target_context.canvas.width,50);
	this.minimap(target_context);
	this.dirty = false;
}

function renderMinimap(target_context)
{
	var i,j, px, py;
	for (j=WORLD_SIZE_Y-1;j>0;j--)
	{
		for (i=WORLD_SIZE_X-1;i>0;i--)
		{
			px = worldCanvas.width-i-1;
			py = worldCanvas.height-j-1;
			
			target_context.fillStyle = this.world.gridcol[j][i]
			target_context.fillRect(px,py,1,1);
		}
	}
	
	/* View Area */
	px = worldCanvas.width-WORLD_SIZE_X+VIEW_GRID_X;
	py = worldCanvas.height-WORLD_SIZE_Y+VIEW_GRID_Y;
	target_context.strokeStyle = "rgb(255,255,0)";
	target_context.beginPath();
	target_context.lineTo(px,py);
	target_context.lineTo(px+VIEW_GRID_WIDTH,py);
	target_context.lineTo(px+VIEW_GRID_WIDTH,py+VIEW_GRID_HEIGHT);
	target_context.lineTo(px,py+VIEW_GRID_HEIGHT);
	target_context.lineTo(px,py);
	target_context.stroke();
}

function gameInit()
{
	var i;
	
	Region = new initRegion();
	Hud = new initHud();
	Player = create_player();
	
	Monsters = [];
	for (i=0; i<NUMBER_OF_MONSTERS; i++) { Monsters[i] = create_monster(); }
	
	worldCanvas.width = Math.round(window.innerWidth*0.96);
	worldCanvas.height = Math.round(window.innerHeight*0.96);
	actorCanvas.width = Math.round(window.innerWidth*0.96);
	actorCanvas.height = Math.round(window.innerHeight*0.96);
	
	refocus_view(Player.map_x, Player.map_y);
	renderWorld(wctx,actx);
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
		case KB_C: refocus_view(Player.map_x, Player.map_y); break;
		case KB_MINUS: world_rescale_down(); break;
		case KB_PLUS: world_rescale_up(); break;
	}
	
	for (i=0; i<Monsters.length; i++) { Monsters[i].ai_move(); }
	
	renderWorld(wctx,actx);
}

worldCanvas = document.getElementById("World");
actorCanvas = document.getElementById("Actors");
wctx = worldCanvas.getContext("2d");
actx = actorCanvas.getContext("2d");
 

/* Constructor for the region (map) */
function initRegion()
{
	this.dirty = true;
	this.render = renderRegion;
	this.is_clear = _is_clear;
	this.grid = [[],[]]
	this.gridcol = [[],[]];
	this.build_map = _build_map;
	
	this.build_map();
}

function renderRegion(target_context)
{
	var i,j, ch, col;
	target_context.font = FONT_SIZE+" Courier";
	//target_context.fillStyle = FG_COLOR;
	target_context.textAlign = "center";
	for (j=VIEW_GRID_Y; j<Math.min(VIEW_GRID_Y+VIEW_GRID_HEIGHT,WORLD_SIZE_Y); j++)
	{
		for (i=VIEW_GRID_X; i<Math.min(VIEW_GRID_X+VIEW_GRID_WIDTH,WORLD_SIZE_X); i++)
		{
			switch (this.grid[j][i])
			{
				case 0: ch = "."; break;
				case 1: ch = "^"; break;
			}
			target_context.fillStyle = this.gridcol[j][i];
			target_context.fillText(ch,32+(i-VIEW_GRID_X)*GRID_SIZE,32+(j-VIEW_GRID_Y)*GRID_SIZE);
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
	if (this.grid[yy][xx] == 0) { return true; } else { return false; }
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
			if (Math.random() > 0.9) {this.grid[j][i] = 1; } else {this.grid[j][i] = 0;}
			
			switch (this.grid[j][i])
			{
				case 0: this.gridcol[j][i] = GRASSLAND ? random_grass_color() : random_dirt_color(); break;
				case 1: this.gridcol[j][i] = random_mountain_color(); break;
			}
		}
	}
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
			
				actor_context.clearRect(0,0,actor_context.canvas.width,actor_context.canvas.height);
				Player.render(actor_context);
				
				for (i=0; i<Monsters.length; i++) { Monsters[i].render(actor_context); }
				
				if (count > (GRID_SIZE/ANIMATION_STEPS)) { clearInterval(interval); clearTimeout(timer);}
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
		
		if (Player.map_x - VIEW_GRID_X < 5 || VIEW_GRID_X+VIEW_GRID_WIDTH-Player.map_x < 5)
			refocus_view(Player.map_x, Player.map_y);
		
		if (Player.map_y - VIEW_GRID_Y < 5 || VIEW_GRID_Y+VIEW_GRID_HEIGHT-Player.map_y < 5)
			refocus_view(Player.map_x, Player.map_y);
		
	}
	
	actor_context.clearRect(0,0,actorCanvas.width,actorCanvas.height);
	if (Region.dirty) { world_context.clearRect(0,0,worldCanvas.width,worldCanvas.height); Region.render(world_context); Hud.render(world_context);}
	if (Player.dirty) { Player.render(actor_context); }
	
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
	if (GRID_SIZE > 8)
	{
		Region.dirty = true;
		GRID_SIZE/=2;
		recalculate_view_scale();
		refocus_view(Player.map_x, Player.map_y);
	}
}

function world_rescale_up()
{
	if (GRID_SIZE < 128)
	{
		Region.dirty = true;
		GRID_SIZE*=2;
		recalculate_view_scale();
		refocus_view(Player.map_x, Player.map_y);
	}
}

function recalculate_view_scale()
{
	FONT_SIZE = GRID_SIZE+"px";
	VIEW_GRID_WIDTH = VIEW_PIXEL_WIDTH/GRID_SIZE;
	VIEW_GRID_HEIGHT = VIEW_PIXEL_HEIGHT/GRID_SIZE;	
}

function refocus_view(xx, yy)
{
	var i;
	var old_x = VIEW_GRID_X;
	var old_y = VIEW_GRID_Y;
	
	VIEW_GRID_X = Math.round(xx-VIEW_GRID_WIDTH/2);
	VIEW_GRID_Y = Math.round(yy-VIEW_GRID_HEIGHT/2);
	
	VIEW_GRID_X = Math.max(VIEW_GRID_X,0);
	VIEW_GRID_Y = Math.max(VIEW_GRID_Y,0);
	
	VIEW_GRID_X = Math.min(WORLD_SIZE_X-VIEW_GRID_WIDTH,VIEW_GRID_X);
	VIEW_GRID_Y = Math.min(WORLD_SIZE_Y-VIEW_GRID_HEIGHT,VIEW_GRID_Y);
	
	if (VIEW_GRID_X != old_x || VIEW_GRID_Y != old_y)
	{
		Region.dirty = true;
		Player.dirty = true;
		for (i=0; i<Monsters.length; i++) { Monsters[i].dirty = true; }
	}
}

function toggle_animate()
{
	Region.dirty = true;
	Hud.dirty = true;
	SETTING_ANIMATE = !SETTING_ANIMATE;
}
 
 /* Game Constants */
const WORLD_SIZE_X = 100;
const WORLD_SIZE_Y = 100;
const BASE_FONT_SIZE = "32px";
const VERSION_MAJOR = 0;
const VERSION_MINOR = 1;

/* Game Settings */
var SETTING_ANIMATE = true;
var NUMBER_OF_MONSTERS = 16;
var ANIMATION_STEPS = 4; /* 1 = slow, 2 = medium, 4 = fast */
var GRID_SIZE = 32;
var FONT_SIZE = GRID_SIZE+"px";
var VIEW_PIXEL_WIDTH = 768;
var VIEW_PIXEL_HEIGHT = 576;
var VIEW_GRID_WIDTH = VIEW_PIXEL_WIDTH/GRID_SIZE;
var VIEW_GRID_HEIGHT = VIEW_PIXEL_HEIGHT/GRID_SIZE;
var VIEW_GRID_X = 0;
var VIEW_GRID_Y = 0;
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

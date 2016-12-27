/**
 * Project Jakutos
 *
 *  Copyright 2016 by MaiZure <maizure/|\member.fsf.org>
 *
 * This file is part of the project Jakutos.
 * 
 * Jakutos is free software: you can redistribute 
 * it and/or modify it under the terms of the GNU General Public 
 * License as published by the Free Software Foundation, either 
 * version 3 of the License, or (at your option) any later version.
 * 
 * Jakutos is distributed in the hope that it will 
 * be useful, but WITHOUT ANY WARRANTY; without even the implied warranty 
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Jakutos.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @license GPL-3.0+ <https://www.gnu.org/licenses/gpl.txt>
 */
 

/* Constructor for the region (map) */
function World()
{
	this.dirty = true;
	this.grid = [[],[]]
	this.gridcol = [[],[]];
	this.gridheight = [[],[]];
	this.gridmob=[[],[]];

	this.load_map();
}

/* Renders the visible portion of the world */
World.prototype.render = function(target_context)
{
	var i,j, ch, col;
	var start_grid_x, start_grid_y, end_grid_x, end_grid_y;
	var px, py;
	
	target_context.font = View.font_size+" clacon";
	target_context.textAlign = "left";
	
	start_grid_x = View.view_grid_x;
	start_grid_y = View.view_grid_y;
	end_grid_x = Math.min(View.view_grid_x+View.view_grid_width,WORLD_SIZE_X);
	end_grid_y = Math.min(View.view_grid_y+View.view_grid_height,WORLD_SIZE_Y);
	
	
	for (j=start_grid_y; j<end_grid_y; j++) {
		for (i=start_grid_x; i<end_grid_x; i++) {
			px = (i-View.view_grid_x)*View.grid_width;
			py = (j-View.view_grid_y)*View.grid_height+View.grid_height;
			target_context.fillStyle = this.gridcol[j][i];
			target_context.fillText(this.grid[j][i],px,py);
		}
	}
	
	this.dirty = false;
};

/* Checks if the target tile is movable
   returns true or false */
World.prototype.is_clear = function(xx, yy)
{
	if (xx < 0) { return false; }
	if (yy < 0) { return false; }
	if (xx >= WORLD_SIZE_X) { return false; }
	if (yy >= WORLD_SIZE_Y) { return false; }
	if (this.gridheight[yy][xx] >= 0) { return true; } else { return false; }
};

/* Tests it's possible to move to the target based on height different
   returns true or false */
World.prototype.is_movable = function(from_x, from_y, to_x, to_y)
{
	var diff = this.gridheight[to_y][to_x] - this.gridheight[from_y][from_x];
	
	if (diff < 3) { return true; }
	
	return false;
};

/* Randomly generates a map - unused for now */
World.prototype.build_map = function()
{
	for (i=0; i<WORLD_SIZE_X; i++) {
		this.grid[i] = [];
		this.gridcol[i] = [];
		this.gridheight[i]= [];
		this.gridmob[i] = [];
	}
	
	for (j=0; j<WORLD_SIZE_Y; j++) {
		for (i=0; i<WORLD_SIZE_X; i++) {	
			if (Math.random() > 0.9) {
				this.grid[j][i] = 2; 
			} else {
				this.grid[j][i] = 1;
			}
			
			switch (this.grid[j][i]) {
				case 0: this.gridcol[j][i] = random_water_color(); break;
				case 1: this.gridcol[j][i] = GRASSLAND ? random_grass_color() : random_dirt_color(); break;
				case 2: this.gridcol[j][i] = random_mountain_color(); break;
			}
		}
	}
};

/* Loads the map based on the const strings WORLD_MAP_* */
World.prototype.load_map = function load_map()
{
	
	var ch, i ,j, k, line;
	var source_map = [];
	var target_base_x = [];
	var target_base_y = [];
	var region_size = 252;
	save_data = localStorage;
	
	source_map[0] = WORLD_MAP_1; target_base_x[0] = 0; target_base_y[0]  = 0;
	source_map[1] = WORLD_MAP_2; target_base_x[1] = region_size; target_base_y[1]  = 0;
	source_map[2] = WORLD_MAP_3; target_base_x[2] = region_size*2; target_base_y[2]  = 0;
	source_map[3] = WORLD_MAP_4; target_base_x[3] = region_size*3; target_base_y[3]  = 0;
	source_map[4] = WORLD_MAP_5; target_base_x[4] = region_size*4; target_base_y[4]  = 0;
	source_map[5] = WORLD_MAP_6; target_base_x[5] = 0; target_base_y[5]  = region_size;
	source_map[6] = WORLD_MAP_7; target_base_x[6] = region_size; target_base_y[6] = region_size;
	source_map[7] = WORLD_MAP_8; target_base_x[7] = region_size*2; target_base_y[7]  = region_size;
	source_map[8] = WORLD_MAP_9; target_base_x[8] = region_size*3; target_base_y[8]  = region_size;
	source_map[9] = WORLD_MAP_10; target_base_x[9] = region_size*4; target_base_y[9]  = region_size;
	source_map[10] = WORLD_MAP_11; target_base_x[10] = 0; target_base_y[10]  = region_size*2;
	source_map[11] = WORLD_MAP_12; target_base_x[11] = region_size; target_base_y[11]  = region_size*2;
	source_map[12] = WORLD_MAP_13; target_base_x[12] = region_size*2; target_base_y[12]  = region_size*2;
	source_map[13] = WORLD_MAP_14; target_base_x[13] = region_size*3; target_base_y[13]  = region_size*2;
	source_map[14] = WORLD_MAP_15; target_base_x[14] = region_size*4; target_base_y[14]  = region_size*2;
	
	for (i=0; i<WORLD_SIZE_X; i++) {
		this.grid[i] = [];
		this.gridcol[i] = [];
		this.gridheight[i] = [];
		this.gridmob[i] = [];
	}
	
	for (k=0; k<15; k++) {
		for (j=0; j<region_size; j++) {
			for (i=0; i<region_size; i++) {
				
				this.gridmob[j][i] = null;
				var new_height;
				
				/* Get heightmap */
				ch = source_map[k].charAt(j*region_size+i);
				
				switch (ch.charCodeAt(0)) {
					case 126: new_height = 0; break;
					case 35: new_height = -1; break;
					case 42: new_height = -2; break;
					case 60: new_height = -3; break;
					default: new_height = ch.charCodeAt(0)-64; break;
				}
				
				/* Set new height */
				this.gridheight[target_base_y[k]+j][target_base_x[k]+i] = new_height;
				
				/* Set character based on height */
				this.grid[target_base_y[k]+j][target_base_x[k]+i] = this.get_map_char(new_height);
				
				/* Set color based on height */
				this.gridcol[target_base_y[k]+j][target_base_x[k]+i] = this.get_map_color(new_height);
			}	
		}
	}
};

/* Gets the character of the current tile based on height */
World.prototype.get_map_char = function(height)
{
	switch (height) {
		case -3: return "<"; break;
		case -2: return "*"; break;
		case -1: return "#"; break;
		case 0: return "="; break;
		case 1: return "~"; break; /* This is actually mapped to center-dot with our font */
		case 2: return "~"; break;
		case 3: return "~"; break;
		case 4: return "^"; break;
		case 5: return "^"; break;
		case 6: return "{"; break; /* Mapped to custom low-mountain font */
		case 7: return "{"; break;
		default: return "}"; break; /* Mapped to high-mountain font */
	}
}

/* Gets the color of the current tile based on height */
World.prototype.get_map_color = function(height)
{
	switch (height) {
		case -3: return COL_MAP_STAIRS; break;
		case -2: return COL_MAP_DOOR; break;
		case -1: return COL_MAP_BUILDING; break;
		case 0: return random_water_color(); break;
		case 1: return random_dirt_color(); break;
		case 2: return random_grass_color(); break;
		case 3: return random_grass_color(); break;
		case 4: return COL_MAP_HILL; break;
		case 5: return COL_MAP_HILL; break;
		case 6: return COL_MAP_LOW_MOUNTAIN; break;
		case 7: return COL_MAP_LOW_MOUNTAIN; break;
		default: return random_mountain_color(); break;
	}
}

/* In-game World editing methods below */
/* Export map as string */
World.prototype.save_map = function()
{
	/* Need to be in edit mode */
	if (!SETTING_EDIT_MODE) { return; }
	
	var target_base_x = [];
	var target_base_y = [];
	var region_size = 252;
	var line = ""
	var ch;
	
	target_base_x[14] = region_size*4; target_base_y[14]  = region_size*2;
	
	for (j=0; j<region_size; j++) {
		for (i=0; i<region_size; i++) {
			ch = this.gridheight[target_base_y[14]+j][target_base_x[14]+i];
			
			switch (ch) {
				case -3: ch = String.fromCharCode(60); break;
				case -2: ch = String.fromCharCode(42); break;
				case -1: ch = String.fromCharCode(35); break;
				case -0: ch = String.fromCharCode(126); break;
				default: ch = String.fromCharCode(ch+64); break;
			}

			line += ch
		}
	}
	console.log(line);
}

/* Adds a wall to the current location */
World.prototype.set_wall = function()
{
	/* Need to be in edit mode */
	if (!SETTING_EDIT_MODE) { return; }
	
	var xx = Player.map_x;
	var yy = Player.map_y;
	
	/* Make a wall if none exists */
	if (this.gridheight[yy][xx] != -1) {
		this.gridheight[yy][xx] = -1;
		this.grid[yy][xx] = "#";
		this.gridcol[yy][xx] = COL_MAP_BUILDING;
	} else { /* Remove a wall since one exists */
		this.gridheight[yy][xx] = 0;
		this.grid[yy][xx] = "=";
		this.gridcol[yy][xx] = COL_MAP_WATER;
	}
	
	this.dirty = true
}

/* Adds a door to the current location */
World.prototype.set_door = function()
{
	/* Need to be in edit mode */
	if (!SETTING_EDIT_MODE) { return; }
	
	var xx = Player.map_x;
	var yy = Player.map_y;
	
	/* Make a wall if none exists */
	if (this.grid[yy][xx] != "*") {
		this.gridheight[yy][xx] = -2;
		this.grid[yy][xx] = "*";
		this.gridcol[yy][xx] = COL_MAP_DOOR;
	} else { /* Remove a wall since one exists */
		this.gridheight[yy][xx] = -1;
		this.grid[yy][xx] = "#";
		this.gridcol[yy][xx] = COL_MAP_BUILDING;
	}
	
	this.dirty = true
}

/* Adds stairs to the current location */
World.prototype.set_stairs = function()
{
	/* Need to be in edit mode */
	if (!SETTING_EDIT_MODE) { return; }
	
	var xx = Player.map_x;
	var yy = Player.map_y;
	
	/* Make stairs */
	this.gridheight[yy][xx] = -3;
	this.grid[yy][xx] = "<";
	this.gridcol[yy][xx] = COL_MAP_STAIRS;
	
	this.dirty = true
}

/* Lowers the current terrain to as low as water level */
World.prototype.lower_terrain = function(xx, yy) {
	
	/* Need to be in edit mode */
	if (!SETTING_EDIT_MODE) { return; }
	
	/* Determines the new height */
	var new_height = this.gridheight[yy][xx]-1;
	
	/* Checks the bounds. Can't go lower than sea level during edit */
	if (new_height < 0) { return false; }
	
	/* Applies the new height */
	this.gridheight[yy][xx] = new_height;
	this.grid[yy][xx] = this.get_map_char(new_height);
	this.gridcol[yy][xx] = this.get_map_color(new_height);
	
	/* Force immediate redraw */
	World.dirty = true;
}

/* Raises the current terrain to a maximum of 25 */
World.prototype.raise_terrain = function(xx, yy) {
	
	/* Need to be in edit mode */
	if (!SETTING_EDIT_MODE) { return; }
	
	/* Determines the new height */
	var new_height = this.gridheight[yy][xx]+1;
	
	/* Checks the bounds. Height max is 25 during edit */
	if (new_height > 25) { return false; }
	
	/* Sets the new height and recalculates the character and color */
	this.gridheight[yy][xx] = new_height;
	this.grid[yy][xx] = this.get_map_char(new_height);
	this.gridcol[yy][xx] = this.get_map_color(new_height);
	
	/* Force immediate redraw */
	World.dirty = true;
}
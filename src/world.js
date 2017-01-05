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
 
/* The world object contains abstract data about the world. This is
 * essentially a singleton object that provides organization and access
 * for other objects. World generation will likely go here if we decide to
 * procedurally generate dungeons.
 */
 
/* Constructor for the region (map) */
function World()
{
	var i;
	
	/* These are all the data arrays indexed by world location.
	 * The default world is 1260x756 */
	this.dirty = true;
	this.grid = [[],[]]        /* Holds the 'symbol' for the world tile */
	this.gridcol = [[],[]];    /* Holds the color assigned to the tile */
	this.gridheight = [[],[]]; /* Holds the height value for the tile */
	this.gridmob=[[],[]];      /* Holds direct object refernces to mobs */
	this.gridobj=[[],[]];      /* Holds object references like chests/doors */
	
	/* Contains spawn points, which generate random monsters from classes */
	this.spawn_points = [];
	
	/* Buffer variable used during map edit */
	this.last_height = 0;

	/* Procedure to pull populate the arrays above from the world data files */
	this.load_map();
	
	/* Procedure to load the spawn points */
	this.init_spawn_points();
	
}

/* Renders the visible portion of the world. Although this function allows 
 * us to specify a context, by design this should be always base_context */
World.prototype.render = function(target_context = base_context)
{
	var i,j, ch, col;
	var px, py;
	
	/* Aliases to cut down inline space */
	var start_grid_x = View.view_grid_x;
	var start_grid_y = View.view_grid_y;
	var end_grid_x = Math.min(View.view_grid_x+View.view_grid_width,WORLD_SIZE_X);
	var end_grid_y = Math.min(View.view_grid_y+View.view_grid_height,WORLD_SIZE_Y);
	
	/* Set drawing mode prior to rendering the world */
	target_context.font = View.font_size+" clacon";
	target_context.textAlign = "left";
	
	/* Redraw the world row-major */
	for (j=start_grid_y; j<end_grid_y; j++) {
		for (i=start_grid_x; i<end_grid_x; i++) {
			
			/* Calculate exact pixel position */
			px = (i-View.view_grid_x)*View.grid_width;
			py = (j-View.view_grid_y)*View.grid_height+View.grid_height;
			/* Push the color and the character to the context */
			target_context.fillStyle = this.gridcol[j][i];
			target_context.fillText(this.grid[j][i],px,py);
		}
	}
	
	/* The world has been updated, remove dirty flag */
	this.dirty = false;
};

/* Checks if the target tile is movable. returns true or false */
World.prototype.is_clear = function(xx, yy)
{
	/* This tile isn't even on the map */
	if (xx < 0) { return false; }
	if (yy < 0) { return false; }
	if (xx >= WORLD_SIZE_X) { return false; }
	if (yy >= WORLD_SIZE_Y) { return false; }
	
	/* If the height is negative, then this is a special square (not movable
	 * For example: A door, dungeon entrance, or wall. Eventually fly
	 * will change things */
	if (this.gridheight[yy][xx] >= 0) { return true; } else { return false; }
};

/* Tests it's possible to move to the target based on height different
 * returns true or false with default to false. */
World.prototype.is_movable = function(from_x, from_y, to_x, to_y)
{
	/* Determine the height difference between tiles */
	var diff = this.gridheight[to_y][to_x] - this.gridheight[from_y][from_x];
	
	/* Future code for Flying/Jumping checks */
	
	/* Small differences will allow movement */
	if (diff < 3) { return true; }
	
	/* If we make it this far, then we we probably can't move there. */
	return false;
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
	
	/* This headache is to cover the face that each region is a subspace of the world
	 * We have to determine the starting coordinates before unrolling in to the flat map 
	 * Source the map file and find the top-left (x, y) coordinates */
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
	
	/* Make each column another list to simulate 2D arrays */
	for (i=0; i<WORLD_SIZE_X; i++) {
		this.grid[i] = [];
		this.gridcol[i] = [];
		this.gridheight[i] = [];
		this.gridmob[i] = [];
		this.gridobj[i] = [];
	}
	
	/* Outer is the region, middle is the row, inner is the column */
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
};

/* In-game World editing methods below */
/* Export map as string */
World.prototype.save_map = function()
{
	/* Need to be in edit mode */
	if (!SETTING_EDIT_MODE) { return; }
	
	var target_base_x = [];
	var target_base_y = [];
	var region_size = 252;
	var region_num = this.get_current_region();
	var line = ""
	var ch;
	
	/* Determine the (x,y) of the current region 
	 * The world is 5x3 in terms of region layout */
	target_base_x = region_size * (region_num % 5); 
	target_base_y  = region_size * Math.floor(region_num/5);
	
	for (j=0; j<region_size; j++) {
		for (i=0; i<region_size; i++) {
			ch = this.gridheight[target_base_y + j][target_base_x + i];
			
			switch (ch) {
				case -3: ch = String.fromCharCode(60); break;
				case -2: ch = String.fromCharCode(42); break;
				case -1: ch = String.fromCharCode(35); break;
				case -0: ch = String.fromCharCode(126); break;
				default: ch = String.fromCharCode(ch+64); break;
			}

			line += ch;
		}
	}
	
	/* This 'saving' routine is just a console log dump that I paste in to the 
	 * World contant */
	console.log(line);
	console.log("WORLD_MAP_"+(region_num+1));
};

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
};

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
};

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
};

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
	
	/* Save last height change */
	this.last_height = new_height;
	
	/* Force immediate redraw */
	World.dirty = true;
};

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
	
	/* Save last height change */
	this.last_height = new_height;
	
	/* Force immediate redraw */
	World.dirty = true;
};

/* Set specific terrain height */
World.prototype.set_terrain_height = function(xx, yy, new_height) {
	
	/* Need to be in edit mode */
	if (!SETTING_EDIT_MODE) { return; }
	
	/* Checks the bounds. Can't go lower than sea level during edit */
	if (new_height < 0) { return false; }
	
	/* Applies the new height */
	this.gridheight[yy][xx] = new_height;
	this.grid[yy][xx] = this.get_map_char(new_height);
	this.gridcol[yy][xx] = this.get_map_color(new_height);
	
	/* Force immediate redraw */
	World.dirty = true;
};

/* Returns the current region number - used in conjunction with map exporting */
World.prototype.get_current_region = function() {
	var gx = Player.map_x;
	var gy = Player.map_y;
	return Math.floor(gx/252) + Math.floor(gy/252)*5;
};

World.prototype.create_container = function(xx, yy, level) {
	var container = new Container();
	container.set_position(xx,yy);
	container.set_level(level);
	container.fill_container();
	this.gridobj[yy][xx] = container;
	return container;
};

/* Chest and other containers placed directly in the game world */
World.prototype.init_static_containers = function(container_ds) {
	
	/* New Sporigal town area containers */
	container_ds.push(this.create_container(898, 546, 2));
	container_ds.push(this.create_container(954, 542, 2));
	container_ds.push(this.create_container(962, 578, 2));
	container_ds.push(this.create_container(1124, 672, 0));
	container_ds.push(this.create_container(1060, 669, 0));
	container_ds.push(this.create_container(1067, 692, 0));
	container_ds.push(this.create_container(1073, 636, 0));
	container_ds.push(this.create_container(1049, 637, 0));
	container_ds.push(this.create_container(1048, 637, 1));
	container_ds.push(this.create_container(1170, 684, 1));
	container_ds.push(this.create_container(1170, 688, 1));
};

/* Place monster spawn points directly in the game world */
World.prototype.init_spawn_points = function() {
	
	/* NEW SPORIGAL */
	/* New Sporigal docks */
	this.spawn_points.push(new Monsterspawner(1123, 674, MTYPE_GOBLIN));
	/* New Sporigal Keep */
	this.spawn_points.push(new Monsterspawner(1063, 694, MTYPE_GOBLIN));
	this.spawn_points.push(new Monsterspawner(1059, 694, MTYPE_GOBLIN));
	/* New Sporigal Guild */
	this.spawn_points.push(new Monsterspawner(1079, 633, MTYPE_GOBLIN));
	/* New Sporigal Temple */
	this.spawn_points.push(new Monsterspawner(1055, 636, MTYPE_GOBLIN));
	this.spawn_points.push(new Monsterspawner(1052, 634, MTYPE_MAGE));
	this.spawn_points.push(new Monsterspawner(1049, 635, MTYPE_GOBLIN));
	/* New Sporigal South Bridge */
	this.spawn_points.push(new Monsterspawner(1061, 671, MTYPE_GOBLIN));
	this.spawn_points.push(new Monsterspawner(1062, 668, MTYPE_GOBLIN));
	/* New Sporigal eastern lowlands */
	this.spawn_points.push(new Monsterspawner(1117, 689, MTYPE_MAGE));
	
	/* CASTLE IRONFIST */
	/* Baa followers at entrance */
	this.spawn_points.push(new Monsterspawner(940, 659, MTYPE_BAA));
	this.spawn_points.push(new Monsterspawner(938, 653, MTYPE_BAA));
	this.spawn_points.push(new Monsterspawner(935, 661, MTYPE_BAA));
	this.spawn_points.push(new Monsterspawner(931, 665, MTYPE_BAA));
};
/**
 * Project Jakutos
 *
 *  Copyright 2016 by MaiZure <maizure@member.fsf.org>
 *
 * This file is part of the project Jakutos.
 * 
 * Some open source application is free software: you can redistribute 
 * it and/or modify it under the terms of the GNU General Public 
 * License as published by the Free Software Foundation, either 
 * version 3 of the License, or (at your option) any later version.
 * 
 * Some open source application is distributed in the hope that it will 
 * be useful, but WITHOUT ANY WARRANTY; without even the implied warranty 
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @license GPL-3.0+ <https://www.gnu.org/licenses/gpl.txt>
 */
 

/* Constructor for the region (map) */
function World()
{
	this.dirty = true;
	
	this.render = renderWorld;
	this.is_clear = _is_clear;
	this.grid = [[],[]]
	this.gridcol = [[],[]];
	this.gridheight = [[],[]];
	this.gridmob=[[],[]];
	this.build_map = _build_map;
	this.load_map = _load_map;

	this.load_map();
}

function renderWorld(target_context)
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
	
	
	for (j=start_grid_y; j<end_grid_y; j++)
	{
		for (i=start_grid_x; i<end_grid_x; i++)
		{
			px = (i-View.view_grid_x)*View.grid_width;
			py = (j-View.view_grid_y)*View.grid_height;
			target_context.fillStyle = this.gridcol[j][i];
			target_context.fillText(this.grid[j][i],px,py);
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
	if (this.grid[yy][xx] != '^') { return true; } else { return false; }
}

function _build_map()
{
	for (i=0; i<WORLD_SIZE_X; i++) 
	{
		this.grid[i] = [];
		this.gridcol[i] = [];
		this.gridheight[i]= [];
		this.gridmob[i] = [];
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
	
	var ch, i ,j, k;
	var source_map = [];
	var target_base_x = [];
	var target_base_y = [];
	var region_size = 252;
	
	source_map[0] = WORLD_MAP_1; target_base_x[0]  = 0; target_base_y[0]  = 0;
	source_map[1] = WORLD_MAP_2; target_base_x[1]  = region_size; target_base_y[1]  = 0;
	source_map[2] = WORLD_MAP_3; target_base_x[2]  = region_size*2; target_base_y[2]  = 0;
	source_map[3] = WORLD_MAP_4; target_base_x[3]  = region_size*3; target_base_y[3]  = 0;
	source_map[4] = WORLD_MAP_5; target_base_x[4]  = region_size*4; target_base_y[4]  = 0;
	source_map[5] = WORLD_MAP_6; target_base_x[5]  = 0; target_base_y[5]  = region_size;
	source_map[6] = WORLD_MAP_7; target_base_x[6]  = region_size; target_base_y[6] = region_size;
	source_map[7] = WORLD_MAP_8; target_base_x[7]  = region_size*2; target_base_y[7]  = region_size;
	source_map[8] = WORLD_MAP_9; target_base_x[8]  = region_size*3; target_base_y[8]  = region_size;
	source_map[9] = WORLD_MAP_10; target_base_x[9]  = region_size*4; target_base_y[9]  = region_size;
	source_map[10] = WORLD_MAP_11; target_base_x[10]  = 0; target_base_y[10]  = region_size*2;
	source_map[11] = WORLD_MAP_12; target_base_x[11]  = region_size; target_base_y[11]  = region_size*2;
	source_map[12] = WORLD_MAP_13; target_base_x[12]  = region_size*2; target_base_y[12]  = region_size*2;
	source_map[13] = WORLD_MAP_14; target_base_x[13]  = region_size*3; target_base_y[13]  = region_size*2;
	source_map[14] = WORLD_MAP_15; target_base_x[14]  = region_size*4; target_base_y[14]  = region_size*2;
	
	for (i=0; i<WORLD_SIZE_X; i++) 
	{
		this.grid[i] = [];
		this.gridcol[i] = [];
		this.gridheight[i] = [];
		this.gridmob[i] = [];
	}
	
	for (k=0; k<15; k++)
	{
		for (j=0; j<region_size; j++)
		{
			for (i=0; i<region_size; i++)
			{
				this.gridmob[j][i] = null;
				
				ch = source_map[k].charAt(j*region_size+i);
				/* Set heightmap */
				switch (ch.charCodeAt(0))
				{
					case 126: this.gridheight[target_base_y[k]+j][target_base_x[k]+i]=0; break;
					case 35: this.gridheight[target_base_y[k]+j][target_base_x[k]+i]=-1; break;
					default: this.gridheight[target_base_y[k]+j][target_base_x[k]+i]=ch.charCodeAt(0)-64; break;
				}
				
				/* Set character and color */
				switch (this.gridheight[target_base_y[k]+j][target_base_x[k]+i])
				{
					case -1: this.grid[target_base_y[k]+j][target_base_x[k]+i] = '#'; this.gridcol[target_base_y[k]+j][target_base_x[k]+i] = COL_MAP_BUILDING; break;
					case 0: this.grid[target_base_y[k]+j][target_base_x[k]+i] = '='; this.gridcol[target_base_y[k]+j][target_base_x[k]+i] = COL_MAP_WATER; break;
					case 1: this.grid[target_base_y[k]+j][target_base_x[k]+i] = '~'; this.gridcol[target_base_y[k]+j][target_base_x[k]+i] = COL_MAP_DIRT; break;
					case 2: 
					case 3: this.grid[target_base_y[k]+j][target_base_x[k]+i] = '~'; this.gridcol[target_base_y[k]+j][target_base_x[k]+i] = COL_MAP_GRASS; break;
					case 4: 
					case 5: this.grid[target_base_y[k]+j][target_base_x[k]+i] = '^'; this.gridcol[target_base_y[k]+j][target_base_x[k]+i] = COL_MAP_HILL; break;
					case 6: 
					case 7: this.grid[target_base_y[k]+j][target_base_x[k]+i] = '{'; this.gridcol[target_base_y[k]+j][target_base_x[k]+i] = COL_MAP_LOW_MOUNTAIN; break;
					default: this.grid[target_base_y[k]+j][target_base_x[k]+i] = '}'; this.gridcol[target_base_y[k]+j][target_base_x[k]+i] = COL_MAP_HIGH_MOUNTAIN; break;
				}
			}
		}
	}
}

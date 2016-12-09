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
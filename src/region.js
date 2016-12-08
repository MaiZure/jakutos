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
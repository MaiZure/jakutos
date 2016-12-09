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
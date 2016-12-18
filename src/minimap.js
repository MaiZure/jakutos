/**
 * Project Jakutos
 *
 *  Copyright 2016 by MaiZure <maizure/\member.fsf.org>
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
	this.active = false;
	this.minimap_world_dirty = true;
	this.minimap_viewbox_dirty = true;
	this.minimap_width = WORLD_SIZE_X/2;
	this.minimap_height = WORLD_SIZE_Y/2;
	
	this.base_x = 0;
	this.base_y = 0;
	
	this.render = renderMinimap;
	this.draw = drawMinimap;
	this.clear_minimap = clear_minimap;
	this._renderTerrain = renderTerrain;
	this._renderViewbox = renderViewbox;
	
	this._renderTerrain(overlay_context);
	this.minimap_image = overlay_context.getImageData(0,0,WORLD_SIZE_X,WORLD_SIZE_Y);
	//View.clear_world(overlay_context);
	View.clear_context(overlay_context);
}

function renderMinimap()
{
	if (this.active)
	{
		if (this.minimap_world_dirty) { this._renderTerrain(base_context); }
		if (this.minimap_viewbox_dirty) { this._renderViewbox(animation_context); }
	}
}

function renderTerrain(target_context)
{
	var i,j, px, py;
	for (j=0; j<WORLD_SIZE_Y; j+=2)
	{
		for (i=0; i<WORLD_SIZE_X; i+=2)
		{
			px = this.base_x+i;
			py = this.base_y+j;
			
			target_context.fillStyle = World.gridcol[j][i];
			target_context.fillRect(px/2,py/2,1,1);
		}
	}
	
	this.minimap_world_dirty = false;
}

function renderViewbox(target_context)
{
	clear_minimap(target_context);
	
	px = worldCanvas.width-WORLD_SIZE_X+View.view_grid_x+1;
	py = worldCanvas.height-WORLD_SIZE_Y+View.view_grid_y+1;
	target_context.strokeStyle = "rgb(255,255,0)";
	target_context.beginPath();
	target_context.lineTo(px,py);
	target_context.lineTo(px+View.view_grid_width,py);
	target_context.lineTo(px+View.view_grid_width,py+View.view_grid_height);
	target_context.lineTo(px,py+View.view_grid_height);
	target_context.lineTo(px,py);
	target_context.stroke();

	this.minimap_viewbox_dirty = false;
}

function drawMinimap(target_context)
{
	var screen_width = target_context.canvas.width;
	var screen_height = target_context.canvas.height;
	var player_x = Player.map_x;
	var player_y = Player.map_y;
	var minimap_x = (View.view_px_width-this.minimap_width)/2;
	var minimap_y = (View.view_px_height-this.minimap_height)/2;
	target_context.putImageData(this.minimap_image, minimap_x,minimap_y);
	target_context.fillStyle = "rgb(255,0,0)";
	target_context.fillRect(minimap_x+player_x/2-5, minimap_y+player_y/2-5, 10, 10);
	
}

function clear_minimap(target_context)
{
	var xx = target_context.canvas.width-WORLD_SIZE_X;
	var yy = target_context.canvas.height-WORLD_SIZE_Y;
	var ww = WORLD_SIZE_X;
	var hh = WORLD_SIZE_Y;
	target_context.clearRect(xx,yy,ww,hh);
}

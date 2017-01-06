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

/* The Minimap is rendered when the game starts and saved as an image.
 * When the View object toggles the minimap, the image is drawn from 
 * the initial runtime render with the character location overlaid 
 */

/* The constructor for the minimap. */
function Minimap() 
{
	this.active = false;
	
	/* We're actually only drawing every other square to save space */
	this.minimap_width = WORLD_SIZE_X/2;
	this.minimap_height = WORLD_SIZE_Y/2;
	
	/* When the Minimap is initialized at game start, we draw the whole map once and
	 * save it as an image before clearing the drawing */
	this.render(overlay_context);
	this.minimap_image = overlay_context.getImageData(0,0,WORLD_SIZE_X,WORLD_SIZE_Y);
	
	View.clear_context(overlay_context);
}

Minimap.prototype.render = function(target_context)
{
	var i,j, px, py;
	for (j=0; j<WORLD_SIZE_Y; j+=2) {
		for (i=0; i<WORLD_SIZE_X; i+=2) {
			
			/* We start the render at the top left */
			px = i;
			py = j;
			
			switch (World.gridheight[j][i]) {
				case -3: target_context.fillStyle = COL_MAP_STAIRS; break;
				case -2: target_context.fillStyle = COL_MAP_DOOR; break;
				case -1: target_context.fillStyle = COL_MAP_BUILDING; break;
				case 0:  target_context.fillStyle = COL_MAP_WATER; break;
				case 1:  target_context.fillStyle = COL_MAP_DIRT; break;
				case 2:  target_context.fillStyle = COL_MAP_GRASS; break;
				case 3:  target_context.fillStyle = COL_MAP_GRASS; break;
				case 4:  target_context.fillStyle = COL_MAP_HILL; break;
				case 5:  target_context.fillStyle = COL_MAP_HILL; break;
				case 6:  target_context.fillStyle = COL_MAP_LOW_MOUNTAIN; break;
				case 7:  target_context.fillStyle = COL_MAP_LOW_MOUNTAIN; break;
				default: target_context.fillStyle = COL_MAP_HIGH_MOUNTAIN; break;
			}
			/* Draw a 1x1 square (aka. a pixel) */
			target_context.fillRect(px/2,py/2,1,1);
		}
	}
};

Minimap.prototype.draw = function(target_context) 
{
	/* Calculate drawing locations */
	var screen_width = target_context.canvas.width;
	var screen_height = target_context.canvas.height;
	var player_x = Player.map_x;
	var player_y = Player.map_y;
	var minimap_x = (View.view_px_width-this.minimap_width)/2;
	var minimap_y = (View.view_px_height-this.minimap_height)/2;
	
	/* Draw our saved minimap centered in the world view */
	target_context.putImageData(this.minimap_image, minimap_x,minimap_y);
	
	/* Draw a red square where the player is currently located */
	target_context.fillStyle = "rgb(255,0,0)";
	target_context.fillRect(minimap_x+player_x/2-5, minimap_y+player_y/2-5, 10, 10);	
	
	/* Draw the map frame shadow */
	target_context.lineWidth = 4;
	target_context.strokeStyle = "rgb(0,0,0)";
    target_context.strokeRect(minimap_x, minimap_y, this.minimap_width, this.minimap_height);
	
	/* Draw the map frame */
	target_context.lineWidth = 3;
	target_context.strokeStyle = "rgb(180,60,60)";
    target_context.strokeRect(minimap_x, minimap_y, this.minimap_width, this.minimap_height);
};

/* Remove the minimap */
Minimap.prototype.clear_minimap = function(target_context) 
{
	var xx = target_context.canvas.width-WORLD_SIZE_X;
	var yy = target_context.canvas.height-WORLD_SIZE_Y;
	var ww = WORLD_SIZE_X;
	var hh = WORLD_SIZE_Y;
	target_context.clearRect(xx,yy,ww,hh);
};

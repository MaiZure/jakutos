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
 
/* This is the logical entitity for containers. It stores the contents
 * (equipment and items) and other metadata */
 
function Container()
{
	this.map_x = 0;
	this.map_y = 0;
	this.px = 0;
	this.py = 0;
	this.level = 0;
	this.gold = 0;
	this.dirty = true;
	
	this.contents = [];
}

/* Draw the contents of the container */
Container.prototype.render = function(target_context)
{
	/* Cull outside view port*/
	if (!this.is_visible()) { this.dirty = false; return; }
	
	/* Set where we draw to */
	this.update_pxpy();
	
	/* Set drawing properties for the target context */
	target_context.font = View.font_size+" clacon";
	target_context.textAlign = "left";
	target_context.fillStyle = "rgb(200,200,32)";
	
	/* Draw avatar*/
	target_context.fillText("_",this.px,this.py+View.grid_height);	
	
	this.dirty = false;
};

/* Determine if the container is visible */
Container.prototype.is_visible = function() 
{
	if (this.map_x < View.view_grid_x) {
		return false; 
	}
	if (this.map_x > View.view_grid_x + View.view_grid_width-1) {
		return false; 
	}
	if (this.map_y < View.view_grid_y) { 
		return false; 
	}
	if (this.map_y > View.view_grid_y + View.view_grid_height-1) { 
		return false; 
	}		

	return true;
};

/* Updates pixel position in the view */
Container.prototype.update_pxpy = function()
{
	var current_view_grid_x = this.map_x-View.view_grid_x;
	var current_view_grid_y = this.map_y-View.view_grid_y;
	this.px = current_view_grid_x*View.grid_width;
	this.py = current_view_grid_y*View.grid_height;
};

/* Remove provided item from the container */
Container.prototype.remove_from_container = function(item) { 
	var index = this.contents.indexOf(item);
	if (index !== -1) { this.contents.splice(index,1); }
	Hud.container_dirty = true;
};

/* Fill the container with random items */
Container.prototype.fill_container = function() {
	var i;
	for (i=0; i<this.level+1; i++) { this.contents.push(new Item()); }
	for (i=0; i<this.level*this.level; i++) { this.gold += Math.round(Math.random()*500);}
};

/* Changes the location of the container to provided map coordinates */
Container.prototype.set_position = function(xx, yy) {
	this.map_x = xx;
	this.map_y = yy;
	this.update_pxpy();
};

/* Set the 'level' of the container. The level determines the
 * quality of the items generated */
Container.prototype.set_level = function(level) {
	this.level = level;
};
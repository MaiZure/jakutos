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
 
/* This Object will almost always be inhereted by a more specific object (Player, Monster, NPC) */
function Actor(){ 
	this.world = World;
}

/* Properties */
Actor.prototype.map_x = 1
Actor.prototype.map_y = 1
Actor.prototype.next_x = this.map_x;
Actor.prototype.next_y = this.map_y;
Actor.prototype.offset_x = 0;
Actor.prototype.offset_y = 0;
Actor.prototype.color = "rgb(224,224,224)";
Actor.prototype.is_player = false;
Actor.prototype.dirty = true;
Actor.prototype.avatar = "%";
Actor.prototype.animating = false;

/* External Refs */
//Actor.prototype.world = World; //Doesn't exist at def time


/* Methods */
Actor.prototype.render = function(target_context)
{
	if (!this.is_visible()) { this.dirty = false; return; } /* culling */
	
	target_context.font = View.font_size+" Sans-Serif";
	target_context.fillStyle = this.color;
	target_context.textAlign = "center";
	
	var current_view_grid_x = this.map_x-View.view_grid_x;
	var current_view_grid_y = this.map_y-View.view_grid_y;
	var current_view_pixel_x = current_view_grid_x*View.grid_width+View.grid_width/2+this.offset_x;
	var current_view_pixel_y = current_view_grid_y*View.grid_height+this.offset_y;
	target_context.fillText(this.avatar,current_view_pixel_x,current_view_pixel_y);	
}

Actor.prototype.move_left = function() { if (this.can_move(this.map_x-1,this.map_y)) { this.next_x-=1; this.animating = true; this.dirty = true; }}
Actor.prototype.move_up = function() { if (this.can_move(this.map_x,this.map_y-1)) { this.next_y-=1; this.animating = true; this.dirty = true; }}
Actor.prototype.move_right = function() { if (this.can_move(this.map_x+1,this.map_y)) { this.next_x+=1; this.animating = true; this.dirty = true; }} 
Actor.prototype.move_down = function() { if (this.can_move(this.map_x,this.map_y+1)) { this.next_y+=1; this.animating = true; this.dirty = true; }}

Actor.prototype.is_visible = function()
{
	if (this.map_x < View.view_grid_x) {return false;}
	if (this.map_x > View.view_grid_x+View.view_grid_width-1) {return false;}
	if (this.map_y < View.view_grid_y) {return false;}
	if (this.map_y > View.view_grid_y+View.view_grid_height-1) {return false;}	
	return true;
}

Actor.prototype.can_move = function(xx,yy)
{
	if (this.animating) {return false;}
	return this.world.is_clear(xx,yy);
}

Actor.prototype.moveAnimate = function()
{
	if (this.next_x < this.map_x) { this.offset_x-=ANIMATION_STEPS;}
	if (this.next_x > this.map_x) { this.offset_x+=ANIMATION_STEPS;}
	if (this.next_y < this.map_y) { this.offset_y-=ANIMATION_STEPS;}
	if (this.next_y > this.map_y) { this.offset_y+=ANIMATION_STEPS;}
	
	if (Math.abs(this.offset_x) >= View.grid_width || Math.abs(this.offset_y) >= View.grid_height) 
	{
		this.offset_x = 0;
		this.offset_y = 0;
		this.map_x = this.next_x;
		this.map_y = this.next_y;
		this.animating = false;
	}
}
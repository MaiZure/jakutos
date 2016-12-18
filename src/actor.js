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
	this.die_num = 1;
	this.die_side = 1;
	this.die_bonus = 1;
	this.last_hit = 0;
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

Actor.prototype.check_action = function(direction)
{
	var xx, yy, move_check, mob_check, npc_check;
	switch (direction)
	{
		case DIR_N:  xx = this.map_x;     yy = this.map_y - 1; break;
		case DIR_NE: xx = this.map_x + 1; yy = this.map_y - 1; break;
		case DIR_E:  xx = this.map_x + 1; yy = this.map_y; break;
		case DIR_SE: xx = this.map_x + 1; yy = this.map_y + 1; break;
		case DIR_S:  xx = this.map_x;     yy = this.map_y + 1; break;
		case DIR_SW: xx = this.map_x - 1; yy = this.map_y + 1; break;
		case DIR_W:  xx = this.map_x - 1; yy = this.map_y; break;
		case DIR_NW: xx = this.map_x - 1; yy = this.map_y - 1; break;
	}
	
	move_check = this.can_move(xx,yy);
	
	if (move_check)
	{
		mob_check = World.gridmob[yy][xx];	
		if (mob_check) { this.execute_melee_attack(mob_check); }
		else
		{ this.next_x = xx; this.next_y = yy; }
	}
}

Actor.prototype.move_left = function() { if (this.can_move(this.map_x-1,this.map_y)) { this.next_x-=1; this.animating = true; this.dirty = true; }}
Actor.prototype.move_up = function() { if (this.can_move(this.map_x,this.map_y-1)) { this.next_y-=1; this.animating = true; this.dirty = true; }}
Actor.prototype.move_right = function() { if (this.can_move(this.map_x+1,this.map_y)) { this.next_x+=1; this.animating = true; this.dirty = true; }} 
Actor.prototype.move_down = function() { if (this.can_move(this.map_x,this.map_y+1)) { this.next_y+=1; this.animating = true; this.dirty = true; }}

Actor.prototype.is_visible = function()
{
	if (this.map_x < View.view_grid_x) { return false; }
	if (this.map_x > View.view_grid_x + View.view_grid_width-1) { return false; }
	if (this.map_y < View.view_grid_y) { return false; }
	if (this.map_y > View.view_grid_y + View.view_grid_height-1) { return false; }	
	
	if (this != Player)
	{
		if (this.status & STATUS_DEAD) { return false; }
	}
	
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

Actor.prototype.execute_move = function()
{
	World.gridmob[this.map_y][this.map_x] = null;
	World.gridmob[this.next_y][this.next_x] = this;
	this.map_x = this.next_x;
	this.map_y = this.next_y;
	this.animating = false;
}

Actor.prototype.execute_melee_attack = function(target)
{
	var i
	var damage = 0;
	for (i=0;i<this.die_num;i++)
		damage+=Math.round(Math.random()*(this.die_side-1)+1)+this.die_bonus;
	
	if (damage > 0)
	{
		target.last_hit = this;
		target.current_hp-=damage
		Hud.message.add_message(this.name + " hits the " + target.name + " for " + damage);
		if (target.current_hp < 1) { target.monster_die(); }
	}
}
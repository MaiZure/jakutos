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
 
/* This Object will almost always be inhereted by a more specific object (Player, Monster, NPC) */
function Actor() 
{ 
	this.world = World;
	this.die_num = 1;
	this.die_side = 1;
	this.die_bonus = 1;
	this.last_hit = 0;
}

/* Properties */
Actor.prototype.map_x = 1;
Actor.prototype.map_y = 1;
Actor.prototype.px = 1;
Actor.prototype.py = 1;
Actor.prototype.next_x = this.map_x;
Actor.prototype.next_y = this.map_y;
Actor.prototype.offset_x = 0;
Actor.prototype.offset_y = 0;
Actor.prototype.color = "rgb(224,224,224)";
Actor.prototype.is_player = false;
Actor.prototype.player_distance = 1000;
Actor.prototype.dirty = true;
Actor.prototype.avatar = "%";
Actor.prototype.animating = false;

/* Methods */

/* Default renderer for actors in the game 
   Actors include Player, Monsters, and NPCs *
   @target_context is the ContextFunction2D to draw to */
Actor.prototype.render = function(target_context) 
{	
	/* Cull actors not visible on the screen */
	if (!this.is_visible()) { this.dirty = false; return; }
	
	/* Set where we draw to */
	this.update_pxpy();
	
	/* Set drawing properties for the target context */
	target_context.font = View.font_size+" Sans-Serif";
	target_context.fillStyle = this.color;
	target_context.textAlign = "center";
	target_context.textBaseline = "alphabetic";
	
	/* Draw debug rectangle */
	/*
	var debug_x = View.get_px(this.map_x);
	var debug_y = View.get_py(this.map_y);
	var debug_w = View.grid_width;
	var debug_h = View.grid_height;
	
	target_context.fillRect(debug_x, debug_y, debug_w, debug_h);*/
	
	/* Draw avatar*/
	target_context.fillText(this.avatar,this.px,this.py+View.grid_height);	
};

Actor.prototype.check_action = function(direction) 
{
	var xx, yy, move_check, mob_check, npc_check;
	
	switch (direction) {
		case DIR_NA: xx = this.map_x;     yy = this.map_y; break;
		case DIR_N:  xx = this.map_x;     yy = this.map_y - 1; break;
		case DIR_NE: xx = this.map_x + 1; yy = this.map_y - 1; break;
		case DIR_E:  xx = this.map_x + 1; yy = this.map_y; break;
		case DIR_SE: xx = this.map_x + 1; yy = this.map_y + 1; break;
		case DIR_S:  xx = this.map_x;     yy = this.map_y + 1; break;
		case DIR_SW: xx = this.map_x - 1; yy = this.map_y + 1; break;
		case DIR_W:  xx = this.map_x - 1; yy = this.map_y; break;
		case DIR_NW: xx = this.map_x - 1; yy = this.map_y - 1; break;
	}
	
	move_check = this.can_move(this.map_x, this.map_y, xx,yy);
	
	if (move_check) {
		mob_check = World.gridmob[yy][xx];	
		if (mob_check) { this.execute_melee_attack(mob_check); }
		else { 
			this.next_x = xx; this.next_y = yy; }
	}
};

Actor.prototype.move_left = function() 
{ 
	if (this.can_move(this.map_x, this.map_y, this.map_x-1,this.map_y)) { 
		this.next_x-=1; this.animating = true; this.dirty = true; }
};

Actor.prototype.move_up = function() 
{ 
	if (this.can_move(this.map_x, this.map_y, this.map_x,this.map_y-1)) { 
		this.next_y-=1; this.animating = true; this.dirty = true; }
};

Actor.prototype.move_right = function() 
{ 
	if (this.can_move(this.map_x, this.map_y, this.map_x+1,this.map_y)) { 
		this.next_x+=1; this.animating = true; this.dirty = true; }
};
 
Actor.prototype.move_down = function() 
{ 
	if (this.can_move(this.map_x, this.map_y, this.map_x,this.map_y+1)) { 
		this.next_y+=1; this.animating = true; this.dirty = true; }
};

Actor.prototype.is_visible = function() 
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
	if (this != Player) {
		if (this.status & STATUS_DEAD) { 
			return false; 
		}
	}
	
	return true;
};

Actor.prototype.can_move = function(from_x,from_y,to_x,to_y) 
{	
	if (this.animating) {
		return false; }
	return (this.world.is_clear(to_x,to_y) && this.world.is_movable(from_x,from_y,to_x,to_y));	
};

Actor.prototype.moveAnimate = function() 
{	
	if (this.next_x < this.map_x) { this.offset_x-=ANIMATION_STEPS;}
	if (this.next_x > this.map_x) { this.offset_x+=ANIMATION_STEPS;}
	if (this.next_y < this.map_y) { this.offset_y-=ANIMATION_STEPS;}
	if (this.next_y > this.map_y) { this.offset_y+=ANIMATION_STEPS;}
	
	if (Math.abs(this.offset_x) >= View.grid_width || Math.abs(this.offset_y) >= View.grid_height) {
		this.offset_x = 0;
		this.offset_y = 0;
		this.map_x = this.next_x;
		this.map_y = this.next_y;
		this.animating = false;
	}
};

Actor.prototype.execute_move = function() 
{	
	World.gridmob[this.map_y][this.map_x] = null;
	World.gridmob[this.next_y][this.next_x] = this;
	
	/* Fall damage (refactor this to calc height difference only once per move) */
	if (this == Player) {
		var height_diff = World.gridheight[this.next_y][this.next_x] - World.gridheight[this.map_y][this.map_x];
		
		if (height_diff < -2) { Party.fall_damage(height_diff); }
	}
	
	/* Move to new grid position */
	this.map_x = this.next_x;
	this.map_y = this.next_y;
	
	/* Calculate the screen position */
	this.update_pxpy();
	
	this.animating = false;
	
};

Actor.prototype.update_pxpy = function()
{
	var current_view_grid_x = this.map_x-View.view_grid_x;
	var current_view_grid_y = this.map_y-View.view_grid_y;
	this.px = current_view_grid_x*View.grid_width+View.grid_width/2;
	this.py = current_view_grid_y*View.grid_height;
};

Actor.prototype.damage_actor = function(damage_amount, attacker = "", damage_type = DAM_PHYSICAL)
{
	this.current_hp -= damage_amount;
		
	if (this.current_hp < 1) { this.monster_die(); }
	
	if (attacker != -1) { 
		this.last_hit = attacker;
		Hud.message.add_message(attacker + this.get_damage_action(damage_type) + this.name + " for " + damage_amount); 
	}
}

Actor.prototype.get_damage_action = function(damage_type)
{
	switch (damage_type) {
		case DAM_PHYSICAL: return " hits "; break;
		case DAM_MAGIC: return " blasts "; break;
		case DAM_FIRE: return " burns "; break;
		case DAM_EARTH: return " smashes "; break;
		case DAM_WATER: return " chills "; break;
		case DAM_AIR: return " slashes "; break;
		case DAM_DARK: return " blasts "; break;
		case DAM_LIGHT: return " blasts "; break;
		case DAM_RANGED: return " shoots "; break;
		case DAM_ANCIENT: return " blasts "; break;
	}
};

Actor.prototype.get_player_distance = function() { return Math.abs(this.map_x-Player.map_x)+Math.abs(this.map_y-Player.map_y); };

Actor.prototype.update_player_distance = function() 
{ 
	this.player_distance = this.get_player_distance();
};
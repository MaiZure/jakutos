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
 
function initActor(ch)
{
	/* Properties */
	this.map_x = Math.round(Math.random()*WORLD_SIZE_X-4)+2;
	this.map_y = Math.round(Math.random()*WORLD_SIZE_Y-4)+2;
	this.next_x = this.map_x;
	this.next_y = this.map_y;
	this.offset_x = 0;
	this.offset_y = 0;
	this.color = "rgb(224,224,224)";
	this.is_player = false;
	this.dirty = true;
	this.avatar = ch;
	this.animating = false;
	
	/* Methods */
	this.render = renderActor;
	this.move_left = _move_left;
	this.move_up = _move_up;
	this.move_right = _move_right;
	this.move_down = _move_down;
	this.ai_move = _ai_move;
	this.is_visible = _is_visible;
	this.can_move = _can_move;
	this.moveAnimate = _moveAnimate;
	
	/* Externs */
	this.world = Region;
}

function renderActor(target_context)
{
	if (!this.is_visible()) { this.dirty = false; return; } /* culling */
	
	target_context.font = (Camera.font_size+" Sans-Serif");
	target_context.fillStyle = this.color;
	target_context.textAlign = "center";
	var current_view_grid_x = this.map_x-Camera.view_grid_x;
	var current_view_grid_y = this.map_y-Camera.view_grid_y;
	var current_view_pixel_x = 32+current_view_grid_x*Camera.grid_size+this.offset_x;
	var current_view_pixel_y = 32+current_view_grid_y*Camera.grid_size+this.offset_y;
	target_context.fillText(this.avatar,current_view_pixel_x,current_view_pixel_y);
	
}

function _move_left() { if (this.can_move(this.map_x-1,this.map_y)) { this.next_x-=1; this.animating = true; this.dirty = true; }}
function _move_up() { if (this.can_move(this.map_x,this.map_y-1)) { this.next_y-=1; this.animating = true; this.dirty = true; }}
function _move_right() { if (this.can_move(this.map_x+1,this.map_y)) { this.next_x+=1; this.animating = true; this.dirty = true; }}
function _move_down() { if (this.can_move(this.map_x,this.map_y+1)) { this.next_y+=1; this.animating = true; this.dirty = true; }}

function _moveAnimate()
{
	if (this.next_x < this.map_x) { this.offset_x-=ANIMATION_STEPS;}
	if (this.next_x > this.map_x) { this.offset_x+=ANIMATION_STEPS;}
	if (this.next_y < this.map_y) { this.offset_y-=ANIMATION_STEPS;}
	if (this.next_y > this.map_y) { this.offset_y+=ANIMATION_STEPS;}
	
	if (Math.abs(this.offset_x) == Camera.grid_size || Math.abs(this.offset_y) == Camera.grid_size) 
	{
		this.offset_x = 0;
		this.offset_y = 0;
		this.map_x = this.next_x;
		this.map_y = this.next_y;
		this.animating = false;
	}
}

function _ai_move()
{
	switch (Math.floor(Math.random()*4))
	{
		case 0: this.move_left(); break;
		case 1: this.move_up(); break;
		case 2: this.move_right(); break;
		case 3: this.move_down(); break;
	}
}

function _can_move(xx, yy)
{
	if (this.animating) {return false;}
	return this.world.is_clear(xx,yy);
}

function _is_visible()
{
	if (this.map_x < Camera.view_grid_x) {return false;}
	if (this.map_x > Camera.view_grid_x+Camera.view_grid_width-1) {return false;}
	if (this.map_y < Camera.view_grid_y) {return false;}
	if (this.map_y > Camera.view_grid_y+Camera.view_grid_height-1) {return false;}	
	return true;
}
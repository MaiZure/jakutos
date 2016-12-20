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

function Animator()
{
	/* Animators are added to the Animations global array for processing */
	Animations.push(this);
	
	this.ttl *= (Math.random()+1);
	this.world = World;
}

/* All animators have world visibility */
Animator.prototype.world = 0;
Animator.prototype.ttl = 15;
Animator.prototype.direction = 0;
Animator.prototype.speed = 8;
Animator.prototype.px = 0;
Animator.prototype.py = 0;
Animator.prototype.grid_x = 0;
Animator.prototype.grid_y = 0;
Animator.prototype.unit_x = 0;
Animator.prototype.unit_y = 0;
Animator.prototype.color = "rgb(255,0,255)";
Animator.prototype.destroyed = false;

/* Finished animations manually call this method */
Animator.prototype.destroy = function()
{
	Animations.splice(Animations.indexOf(this),1);
	this.destroyed = true;
};

/* Start the animation at the center of it's starting grid */
Animator.prototype.start = function()
{
	/* determine the pixel value of the start location */
	var current_view_grid_x = this.grid_x-View.view_grid_x;
	var current_view_grid_y = this.grid_y-View.view_grid_y-1;
	this.px = current_view_grid_x*View.grid_width+View.grid_width/2;
	this.py = current_view_grid_y*View.grid_height+View.grid_height/2;
	
	/* Determine the unit vector components */
	this.unit_x = Math.cos(Math.deg_to_rad(this.direction));
	this.unit_y = Math.sin(Math.deg_to_rad(this.direction));
}

Animator.prototype.clear = function()
{
	overlay_context.clearRect(this.px-2, this.py-2, 4, 4);
};

Animator.prototype.update = function()
{
	this.px += Math.round(this.unit_x * this.speed);
	this.py -= Math.round(this.unit_y * this.speed);
	this.grid_x = View.get_grid_x(this.px);
	this.grid_y = View.get_grid_y(this.py);
	
	this.ttl--;
	
	/* Check hit */
	if (this.world.gridmob[this.grid_y][this.grid_x]) {
		console.log("hit");
	}
	
	/* Check dead */
	if (this.ttl < 1) { this.destroy(); }
}

/* Default renderer. This will likely be overriden by derived object */
Animator.prototype.render = function()
{
	overlay_context.fillStyle = this.color;
	overlay_context.fillRect(this.px-2, this.py-2, 4, 4);
	overlay_context.fillRect(this.px-2, this.py-2, 4, 4);
};

Animator.prototype.animate_step = function()
{
	this.clear();
	this.update();
	if (!this.destroyed) { this.render(); }
};

/* Arrow object which is derived from the Animator object */
function Arrow(xx, yy, dir = 0)
{
	Animator.call(this);
	this.grid_x = xx;
	this.grid_y = yy;
	this.direction = dir;
	this.color = COL_ARROW;
	
	/* This animation prep must happen after setting position and direction */
	this.start();
}

Arrow.prototype = Object.create(Animator.prototype);
Arrow.prototype.constructor = Animator;

Arrow.prototype.render = function()
{
	overlay_context.fillStyle = this.color;
	overlay_context.fillRect(this.px-2, this.py-2, 4, 4);
	overlay_context.fillRect(this.px-2, this.py-2, 4, 4);
}

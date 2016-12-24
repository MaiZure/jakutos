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
	
	this.ttl = 30;
	this.world = World;
	this.damage = Math.round(Math.random()*3)+1;
	this.shooter = null;
	this.from_player = false;
	this.damage_type = DAM_RANGED;
}

/* All animators have world visibility */
Animator.prototype.world = 0;
Animator.prototype.ttl = 30;
Animator.prototype.direction = 0;
Animator.prototype.speed = 10;
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
	this.px = View.get_px(this.grid_x)+View.grid_width/2;
	this.py = View.get_py(this.grid_y)+View.grid_height/2
	
	/* Determine the unit vector components */
	this.unit_x = Math.cos(Math.deg_to_rad(this.direction));
	this.unit_y = Math.sin(Math.deg_to_rad(this.direction));
}

Animator.prototype.clear = function()
{
	overlay_context.clearRect(this.px-10, this.py-10, 20, 20);
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
		var hit;
		hit = this.world.gridmob[this.grid_y][this.grid_x];
		
		if (this.from_player && hit != Player) {
			hit.damage_actor(this.damage, Player, this.shooter, this.damage_type)
			hit.stunned += 1;
			this.destroy();
		}
			
		if (!this.from_player && hit === Player) {
			Party.damage_party(this.shooter, this.damage, -1, this.damage_type)
			this.destroy();
		}
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
	this.ttl = 30;
	
	/* This animation prep must happen after setting position and direction */
	this.start();
}

Arrow.prototype = Object.create(Animator.prototype);
Arrow.prototype.constructor = Animator;
Arrow.prototype.render = function()
{	
	overlay_context.strokeStyle = this.color;
	overlay_context.beginPath();
	overlay_context.lineWidth="2";
	overlay_context.moveTo(this.px-this.unit_x*5,this.py+this.unit_y*5);
	overlay_context.lineTo(this.px+this.unit_x*5,this.py-this.unit_y*5);
	overlay_context.stroke();
};

/* Flame Arrow Spell and mechanics */
function Flamearrow(xx, yy, dir = 0)
{
	Animator.call(this);
	this.grid_x = xx;
	this.grid_y = yy;
	this.direction = dir;
	this.color = COL_FLAME_ARROW;
	this.damage_type = DAM_FIRE;
	this.speed = 12;
	this.ttl = 30;
	
	/* This animation prep must happen after setting position and direction */
	this.start();
}

Flamearrow.prototype = Object.create(Animator.prototype);
Flamearrow.prototype.constructor = Animator;
Flamearrow.prototype.render = function()
{	
	overlay_context.strokeStyle = this.color;
	overlay_context.beginPath();
	overlay_context.lineWidth="3";
	overlay_context.moveTo(this.px-this.unit_x*5,this.py+this.unit_y*5);
	overlay_context.lineTo(this.px+this.unit_x*5,this.py-this.unit_y*5);
	overlay_context.stroke();
};

/* Spirit Arrow Spell and mechanics */
function Spiritarrow(xx, yy, dir = 0)
{
	Animator.call(this);
	this.grid_x = xx;
	this.grid_y = yy;
	this.direction = dir;
	this.color = COL_SPIRIT_ARROW;
	this.damage_type = DAM_MAGIC;
	this.speed = 12;
	this.ttl = 30;
	
	/* This animation prep must happen after setting position and direction */
	this.start();
}

Spiritarrow.prototype = Object.create(Animator.prototype);
Spiritarrow.prototype.constructor = Animator;
Spiritarrow.prototype.render = function()
{	
	overlay_context.strokeStyle = this.color;
	overlay_context.beginPath();
	overlay_context.lineWidth="3";
	overlay_context.moveTo(this.px-this.unit_x*5,this.py+this.unit_y*5);
	overlay_context.lineTo(this.px+this.unit_x*5,this.py-this.unit_y*5);
	overlay_context.stroke();
};

/* Mind blast Spell and mechanics */
function Mindblast(xx, yy, dir = 0)
{
	Animator.call(this);
	this.grid_x = xx;
	this.grid_y = yy;
	this.direction = dir;
	this.color = COL_MIND_BLAST;
	this.damage_type = DAM_MAGIC;
	this.speed = 12;
	this.ttl = 30;
	
	/* This animation prep must happen after setting position and direction */
	this.start();
}

Mindblast.prototype = Object.create(Animator.prototype);
Mindblast.prototype.constructor = Animator;
Mindblast.prototype.render = function()
{
	overlay_context.beginPath();
    overlay_context.fillStyle = "rgb(240,240,0)";
	overlay_context.strokeStyle = this.color;
    overlay_context.lineWidth = 2;
	overlay_context.arc(this.px, this.py, 4, 0, 2*Math.PI, false);
	overlay_context.fill();
    overlay_context.stroke();
};
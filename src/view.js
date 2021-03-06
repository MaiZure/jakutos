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

/* Constructor for the view. This manages the dimensions of screen usage
 * to include the size of the world, zoom levels, and font */
function View() 
{
	this.dirty = false;
	
	this.view_grid_x = 0;
	this.view_grid_y = 0;
	this.grid_width = 14;
	this.grid_height = 18;
	this.view_px_x = 0;
	this.view_px_y = 0;
	
	this.target_view_x = 0;
	this.target_view_y = 0;
	this.px_offset_x = 0;
	this.px_offset_y = 0;
	
	this.calculate_view();
	
	this.animate_camera = _animate_camera;
}

View.prototype.calculate_view = function() 
{
	this.view_px_width = Math.round(base_canvas.width*0.62); this.view_px_width+=this.view_px_width % this.grid_width;
	this.view_px_height = Math.round(base_canvas.height*0.97); this.view_px_height+=this.view_px_height % this.grid_height;
	this.font_size = (this.grid_height*2)+"px";
	this.view_grid_width = Math.round(this.view_px_width/this.grid_width)+1;
	this.view_grid_height = Math.round(this.view_px_height/this.grid_height)+1;	
};

/* Conversion helpers from exact screen position to grid square */
View.prototype.get_grid_x = function(pixel_x) { return Math.floor(pixel_x/View.grid_width)+View.view_grid_x; };
View.prototype.get_grid_y = function(pixel_y) { return Math.floor(pixel_y/View.grid_height)+View.view_grid_y; };
View.prototype.get_px = function(grid_x) { return (grid_x-View.view_grid_x)*View.grid_width; };
View.prototype.get_py = function(grid_y) { return (grid_y-View.view_grid_y)*View.grid_height; };
View.prototype.get_pxc = function(grid_x) { return (grid_x-View.view_grid_x)*View.grid_width+View.grid_width/2; };
View.prototype.get_pyc = function(grid_y) { return (grid_y-View.view_grid_y)*View.grid_height+View.grid_height/2; };

/* This was function was written in the first few hours of the project and it needs
   a lot more love. (It's a disaster) */
View.prototype.render = function (world_context, actor_context) 
{	
	var i;
	if (Minimap.active) {
		Minimap.draw(overlay_context);
	} else {
		if (Player.animating) {
			if (SETTING_ANIMATE) {
				var count = 0;
				var timer = setTimeout(function() {
					var interval = setInterval(function() {
						count++;
						Player.moveAnimate();
					
						for (i=0; i<Monsters.length; i++) { 
							Monsters[i].moveAnimate(); 
						}
			
						View.clear_world(actor_context);
						Player.render(actor_context);
						
						for (i=0; i<Monsters.length; i++) { 
							Monsters[i].render(actor_context); 
						}
						
						if (count > (View.grid_height/ANIMATION_STEPS)) { 
							clearInterval(interval); 
							clearTimeout(timer);
						}
					}, 0)
				}, 24);
			}
		}
		
		/* Scroll the map view when the player gets too close to the edge */
		if (Player.map_x - this.view_grid_x < 5 || this.view_grid_x+this.view_grid_width-Player.map_x < 5) {
				this.refocus(Player.map_x, Player.map_y);
		}
		
		/* Scroll the map view when the player gets too close to the edge */	
		if (Player.map_y - this.view_grid_y < 5 || this.view_grid_y+this.view_grid_height-Player.map_y < 5) {
			this.refocus(Player.map_x, Player.map_y);
		}
		
		if (World.dirty) { 
			this.clear_world(world_context); World.render(world_context); 
		}
		
		if (Player.dirty) { 
			this.clear_world(actor_context); Player.render(actor_context); 
		}
		
		Hud.render();
		
		for (i=0; i<Monsters.length; i++) {
			if (Monsters[i].dirty) { 
				Monsters[i].render(actor_context); 
			}
		}
		
		for (i=0; i<Containers.length; i++) {
			if (Containers[i].dirty) { 
				Containers[i].render(base_context); 
			}
		}
	}
};


View.prototype.render_animations = function()
{
	if (Animations.length === 0) { return; }
	
	var animation_index, obj, count, delay;
	
	count = 0;
	
	delay = setInterval(function() {
		count++
		for (animation_index=0; animation_index<Animations.length; animation_index++) {
			obj = Animations[animation_index];
			obj.animate_step();
		}
		
		if (count > 8) { clearInterval(delay); }
		
		},24);
};

/* Zooms out */
View.prototype.world_rescale_down = function() 
{
	if (this.grid_height > 8) {
		World.dirty = true;
		this.grid_width/=2;
		this.grid_height/=2;
		this.recalculate_view_scale();
		this.refocus(Player.map_x, Player.map_y, true);
	}
};

/* Zooms in */
View.prototype.world_rescale_up = function() 
{
	if (this.grid_height < 128) {
		World.dirty = true;
		this.grid_width*=2;
		this.grid_height*=2;
		this.recalculate_view_scale();
		this.refocus(Player.map_x, Player.map_y, true);
	}
};

/* Recalculates the size of a grid with respect to the view */
View.prototype.recalculate_view_scale = function() 
{
	this.font_size = (this.grid_height*2)+"px";
	this.view_grid_width = Math.round(this.view_px_width/this.grid_width)+1;
	this.view_grid_height = Math.round(this.view_px_height/this.grid_height)+1;
};

/* Changes the draw position of the world with respect to the view */
View.prototype.refocus = function(xx, yy, immediate = false) 
{
	var i;
	var old_x = this.view_grid_x;
	var old_y = this.view_grid_y;
	
	if (!SETTING_ANIMATE || immediate) {
		this.view_grid_x = Math.round(xx-this.view_grid_width/2);
		this.view_grid_y = Math.round(yy-this.view_grid_height/2);
		
		this.view_grid_x = Math.max(this.view_grid_x,0);
		this.view_grid_y = Math.max(this.view_grid_y,0);
		
		this.view_grid_x = Math.min(WORLD_SIZE_X-this.view_grid_width,this.view_grid_x);
		this.view_grid_y = Math.min(WORLD_SIZE_Y-this.view_grid_height,this.view_grid_y);
		
		if (this.view_grid_x != old_x || this.view_grid_y != old_y)
		{
			this.dirty = true;
			World.dirty = true;
			Player.dirty = true;
			for (i=0; i<Monsters.length; i++) { Monsters[i].dirty = true; }
			for (i=0; i<Containers.length; i++) { Containers[i].dirty = true; }
		}
	} else {
		this.dirty = true;
		
		this.target_view_x = Math.round(xx-View.view_grid_width/2);
		this.target_view_y = Math.round(yy-View.view_grid_height/2);
		this.target_view_x = Math.max(View.target_view_x,0);
		this.target_view_y = Math.max(View.target_view_y,0);
		this.target_view_x = Math.min(WORLD_SIZE_X-View.view_grid_width,View.target_view_x);
		this.target_view_y = Math.min(WORLD_SIZE_Y-View.view_grid_height,View.target_view_y);
		
		if (View.dirty) {
			View.animate_camera();
		}
	}
};

/* Deprecated */
View.prototype.toggle_animate = function() 
{
	World.dirty = true;
	Hud.dirty = true;
	SETTING_ANIMATE = !SETTING_ANIMATE;
};

/* Turns the minimap on and off */
View.prototype.toggle_minimap = function() 
{
	Minimap.active = !Minimap.active;
	
	/* We just turned off the Minimap - so clear the overlay */
	if (!Minimap.active) { View.clear_context(overlay_context); }
	
	World.dirty = true;
};

/* Clears the world draw area */
View.prototype.clear_world = function(target_context) 
{
	var xx = this.view_px_x;
	var yy = this.view_px_y;
	var ww = this.view_px_width + 16;
	var hh = target_context.canvas.height;
	target_context.clearRect(xx, yy, ww, hh);
};

/* Clears the entire context */
View.prototype.clear_context = function(target_context) 
{
	target_context.clearRect(0,0,target_context.canvas.width,target_context.canvas.height);
};

/* Triggered by window resizing */
View.prototype.resizeWindow = function() 
{
	set_canvas_size();
	View.calculate_view();
	Hud.resize();
	
	World.dirty = true;
	Hud.dirty = true;
	
	View.refocus(Player.map_x, Player.map_y, true);
	View.render(base_context,animation_context);
};

function _animate_camera() 
{	
	if (this.view_grid_x == this.target_view_x && this.view_grid_y == this.target_view_y) {
		this.dirty = false;
		return;
	}
	
	var timer = setTimeout(function() {
		var interval = setInterval(function(){
			
			if (View.view_grid_x < View.target_view_x) { View.view_grid_x++; }
			if (View.view_grid_x > View.target_view_x) { View.view_grid_x--; }
			if (View.view_grid_y < View.target_view_y) { View.view_grid_y++; }
			if (View.view_grid_y > View.target_view_y) { View.view_grid_y--; }
			
			if (View.view_grid_x == View.target_view_x && View.view_grid_y == View.target_view_y) {
				View.dirty = false;
			}
			
			View.clear_world(animation_context);
			View.clear_world(base_context);
			
			Player.render(animation_context);
			World.render(base_context);
			for (i=0; i<Containers.length; i++) { Containers[i].render(base_context); }
			Hud.render();
			for (i=0; i<Monsters.length; i++) { Monsters[i].render(animation_context); }
		
			if (!View.dirty) { clearInterval(interval); clearTimeout(timer);}
		}, 0)
	}, 24);
}

/* Global function used during init and resize */
function set_canvas_size() 
{
	/* Set the three canvas dimensions on load and divisible by 8 (may help future calcs)*/
	base_canvas.width = Math.round(window.innerWidth*0.96); base_canvas.width -= base_canvas.width % 8;
	base_canvas.height = Math.round(window.innerHeight*0.96); base_canvas.height -= base_canvas.height % 8;
	
	animation_canvas.width = Math.round(window.innerWidth*0.96); animation_canvas.width -= animation_canvas.width % 8;
	animation_canvas.height = Math.round(window.innerHeight*0.96); animation_canvas.height -= animation_canvas.height % 8;
	
	overlay_canvas.width = Math.round(window.innerWidth*0.96); overlay_canvas.width -= overlay_canvas.width % 8;
	overlay_canvas.height = Math.round(window.innerHeight*0.96); overlay_canvas.height -= overlay_canvas.height % 8;
}
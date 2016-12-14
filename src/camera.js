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

function initCamera()
{
	this.dirty = false;
	this.view_grid_x = 0;
	this.view_grid_y = 0;
	this.grid_width = 14;
	this.grid_height = 18;
	this.view_px_x = 0;
	this.view_px_y = 0;
	this.view_px_width = Math.round(baseCanvas.width*0.62); this.view_px_width+=this.view_px_width % this.grid_width; //768;
	this.view_px_height = Math.round(baseCanvas.height*0.97); this.view_px_height+=this.view_px_height % this.grid_height; //576;
	this.font_size = (this.grid_height*2)+"px";//(this.grid_width*2)+"px";
	this.view_grid_width = Math.round(this.view_px_width/this.grid_width)+1;
	this.view_grid_height = Math.round(this.view_px_height/this.grid_height)+1;
	
	
	this.target_view_x = 0;
	this.target_view_y = 0;
	this.px_offset_x = 0;
	this.px_offset_y = 0;
	
	this.animate_camera = _animate_camera;
	this.zoom_in = world_rescale_up;
	this.zoom_out = world_rescale_down;
	this.refocus = refocus_view;
	this.render = renderWorld;
	this.rescale = recalculate_view_scale;
	this.clear_world = clear_world;
	this.clear_context = clear_context;
}

function renderWorld(world_context, actor_context)
{	
	var i;
	if (Minimap.active)
	{
		Minimap.draw(overlay_context);
	}
	else
	{
		if (Player.animating)
		{
			if (SETTING_ANIMATE)
			{
				var count = 0;
				var timer = setTimeout(function() {
					var interval = setInterval(function(){
					count++;
					Player.moveAnimate();
					
					for (i=0; i<Monsters.length; i++) { Monsters[i].moveAnimate(); }
		
					Camera.clear_world(actor_context);
					Player.render(actor_context);
					
					for (i=0; i<Monsters.length; i++) { Monsters[i].render(actor_context); }
					
					if (count > (Camera.grid_height/ANIMATION_STEPS)) { clearInterval(interval); clearTimeout(timer);}
					}, 0)
				}, 24);
			}
			else
			{
				Player.map_x = Player.next_x;
				Player.map_y = Player.next_y;
				Player.animating = false;
				for (i=0; i<Monsters.length; i++) 
				{ 
					Monsters[i].map_x = Monsters[i].next_x;
					Monsters[i].map_y = Monsters[i].next_y;
					Monsters[i].animating = false;
				}
			}
			
			if (Player.map_x - this.view_grid_x < 5 || this.view_grid_x+this.view_grid_width-Player.map_x < 5)
				this.refocus(Player.map_x, Player.map_y);
			
			if (Player.map_y - this.view_grid_y < 5 || this.view_grid_y+this.view_grid_height-Player.map_y < 5)
				this.refocus(Player.map_x, Player.map_y);
			
		}
		
		if (Region.dirty) { this.clear_world(world_context); Region.render(world_context); }
		if (Player.dirty) { this.clear_world(actor_context); Player.render(actor_context); }
		Hud.render();
		
		for (i=0; i<Monsters.length; i++)
		{
			if (Monsters[i].dirty) 
			{ 
				Monsters[i].render(actor_context); 
			}
		}
	}
}
 
function world_rescale_down()
{
	if (this.grid_height > 8)
	{
		Region.dirty = true;
		this.grid_width/=2;
		this.grid_height/=2;
		this.rescale();
		this.refocus(Player.map_x, Player.map_y, true);
	}
}

function world_rescale_up()
{
	if (this.grid_height < 128)
	{
		Region.dirty = true;
		this.grid_width*=2;
		this.grid_height*=2;
		this.rescale();
		this.refocus(Player.map_x, Player.map_y, true);
	}
}

function recalculate_view_scale()
{
	this.font_size = (this.grid_height*2)+"px";
	this.view_grid_width = Math.round(this.view_px_width/this.grid_width)+1;
	this.view_grid_height = Math.round(this.view_px_height/this.grid_height)+1;
}

function refocus_view(xx, yy, immediate = false)
{
	var i;
	var old_x = this.view_grid_x;
	var old_y = this.view_grid_y;
	
	if (!SETTING_ANIMATE || immediate)
	{
		this.view_grid_x = Math.round(xx-this.view_grid_width/2);
		this.view_grid_y = Math.round(yy-this.view_grid_height/2);
		
		this.view_grid_x = Math.max(this.view_grid_x,0);
		this.view_grid_y = Math.max(this.view_grid_y,0);
		
		this.view_grid_x = Math.min(WORLD_SIZE_X-this.view_grid_width,this.view_grid_x);
		this.view_grid_y = Math.min(WORLD_SIZE_Y-this.view_grid_height,this.view_grid_y);
		
		if (this.view_grid_x != old_x || this.view_grid_y != old_y)
		{
			this.dirty = true;
			Region.dirty = true;
			Player.dirty = true;
			for (i=0; i<Monsters.length; i++) { Monsters[i].dirty = true; }
		}
	}
	else
	{
		this.dirty = true;
		
		this.target_view_x = Math.round(xx-Camera.view_grid_width/2);
		this.target_view_y = Math.round(yy-Camera.view_grid_height/2);
		this.target_view_x = Math.max(Camera.target_view_x,0);
		this.target_view_y = Math.max(Camera.target_view_y,0);
		this.target_view_x = Math.min(WORLD_SIZE_X-Camera.view_grid_width,Camera.target_view_x);
		this.target_view_y = Math.min(WORLD_SIZE_Y-Camera.view_grid_height,Camera.target_view_y);
		
		if (Camera.dirty) {Camera.animate_camera();}
	}
}

function toggle_animate()
{
	Region.dirty = true;
	Hud.dirty = true;
	SETTING_ANIMATE = !SETTING_ANIMATE;
}

function toggle_minimap()
{
	Minimap.active = !Minimap.active
	if (Minimap.active)
	{
		Minimap.minimap_world_dirty = true;
		Minimap.minimap_viewbox_dirty = true;
	}
	else
	{
		Camera.clear_context(overlay_context);
	}
	Region.dirty = true;
}

function _animate_camera()
{
	
	if (this.view_grid_x == this.target_view_x && this.view_grid_y == this.target_view_y)
	{
		this.dirty = false;
		return;
	}
	
	var timer = setTimeout(function() {
		var interval = setInterval(function(){
			
			if (Camera.view_grid_x < Camera.target_view_x) { Camera.view_grid_x++; }
			if (Camera.view_grid_x > Camera.target_view_x) { Camera.view_grid_x--; }
			if (Camera.view_grid_y < Camera.target_view_y) { Camera.view_grid_y++; }
			if (Camera.view_grid_y > Camera.target_view_y) { Camera.view_grid_y--; }
			
			if (Camera.view_grid_x == Camera.target_view_x && Camera.view_grid_y == Camera.target_view_y)
			{
				Camera.dirty = false;
				//Hud.Minimap.minimap_viewbox_dirty = true;
			}
			
			Camera.clear_world(animation_context);
			Camera.clear_world(base_context);
			
			Player.render(animation_context);
			Region.render(base_context);
			Hud.render();
			for (i=0; i<Monsters.length; i++) { Monsters[i].render(animation_context); }
		
			if (!Camera.dirty) { clearInterval(interval); clearTimeout(timer);}
		}, 0)
	}, 24);
}

function clear_world(target_context)
{
	var xx = this.view_px_x;
	var yy = this.view_px_y;
	var ww = this.view_px_width + 16;
	var hh = target_context.canvas.height;
	target_context.clearRect(xx, yy, ww, hh);
}

function clear_context(target_context) 
{
	target_context.clearRect(0,0,target_context.canvas.width,target_context.canvas.height);
}
	
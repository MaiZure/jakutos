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

function renderWorld(world_context, actor_context)
{	
	var i;
	
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
			
				actor_context.clearRect(0,0,actor_context.canvas.width,actor_context.canvas.height);
				Player.render(actor_context);
				
				for (i=0; i<Monsters.length; i++) { Monsters[i].render(actor_context); }
				
				if (count > (GRID_SIZE/ANIMATION_STEPS)) { clearInterval(interval); clearTimeout(timer);}
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
		
		if (Player.map_x - VIEW_GRID_X < 5 || VIEW_GRID_X+VIEW_GRID_WIDTH-Player.map_x < 5)
			refocus_view(Player.map_x, Player.map_y);
		
		if (Player.map_y - VIEW_GRID_Y < 5 || VIEW_GRID_Y+VIEW_GRID_HEIGHT-Player.map_y < 5)
			refocus_view(Player.map_x, Player.map_y);
		
	}
	
	actor_context.clearRect(0,0,actorCanvas.width,actorCanvas.height);
	if (Region.dirty) { world_context.clearRect(0,0,worldCanvas.width,worldCanvas.height); Region.render(world_context); Hud.render(world_context);}
	if (Player.dirty) { Player.render(actor_context); }
	
	for (i=0; i<Monsters.length; i++)
	{
		if (Monsters[i].dirty) 
		{ 
			Monsters[i].render(actor_context); 
		}
	}
}
 
function world_rescale_down()
{
	if (GRID_SIZE > 8)
	{
		Region.dirty = true;
		GRID_SIZE/=2;
		recalculate_view_scale();
		refocus_view(Player.map_x, Player.map_y);
	}
}

function world_rescale_up()
{
	if (GRID_SIZE < 128)
	{
		Region.dirty = true;
		GRID_SIZE*=2;
		recalculate_view_scale();
		refocus_view(Player.map_x, Player.map_y);
	}
}

function recalculate_view_scale()
{
	FONT_SIZE = GRID_SIZE+"px";
	VIEW_GRID_WIDTH = VIEW_PIXEL_WIDTH/GRID_SIZE;
	VIEW_GRID_HEIGHT = VIEW_PIXEL_HEIGHT/GRID_SIZE;	
}

function refocus_view(xx, yy)
{
	var i;
	var old_x = VIEW_GRID_X;
	var old_y = VIEW_GRID_Y;
	
	VIEW_GRID_X = Math.round(xx-VIEW_GRID_WIDTH/2);
	VIEW_GRID_Y = Math.round(yy-VIEW_GRID_HEIGHT/2);
	
	VIEW_GRID_X = Math.max(VIEW_GRID_X,0);
	VIEW_GRID_Y = Math.max(VIEW_GRID_Y,0);
	
	VIEW_GRID_X = Math.min(WORLD_SIZE_X-VIEW_GRID_WIDTH,VIEW_GRID_X);
	VIEW_GRID_Y = Math.min(WORLD_SIZE_Y-VIEW_GRID_HEIGHT,VIEW_GRID_Y);
	
	if (VIEW_GRID_X != old_x || VIEW_GRID_Y != old_y)
	{
		Region.dirty = true;
		Player.dirty = true;
		for (i=0; i<Monsters.length; i++) { Monsters[i].dirty = true; }
	}
}

function toggle_animate()
{
	Region.dirty = true;
	Hud.dirty = true;
	SETTING_ANIMATE = !SETTING_ANIMATE;
}
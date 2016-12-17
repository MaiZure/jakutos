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
 
 
mouse_x = 0;
mouse_y = 0;
mouse_gx = 0;
mouse_gy = 0;
last_mouse_gx = 0;
last_mouse_gy = 0;

function doMouseMove(event)
{
	mouse_x = event.clientX;
	mouse_y = event.clientY;
	mouse_gx = Math.floor(mouse_x/View.grid_width)+View.view_grid_x;
	mouse_gy = Math.floor(mouse_y/View.grid_height)+View.view_grid_y+1;
	
	/* Mouse hit a new grid position */
	if (last_mouse_gx != mouse_gx || last_mouse_gy != mouse_gy ) 
	{
		last_mouse_gx = mouse_gx;
		last_mouse_gy = mouse_gy;
		//Hud.hover.add_message("X:"+mouse_gx+", Y:"+mouse_gy);
		Hud.hover.add_message(Hud.hover.get_hover_message(mouse_gx,mouse_gy));
		Hud.dirty = true;
		Hud.render();
	}
}

function doMouseClick(event)
{
	
}
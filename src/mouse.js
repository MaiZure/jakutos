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
 
/* Globals for mouse interface is just easy */
mouse_x = 0;
mouse_y = 0;
mouse_gx = 0;
mouse_gy = 0;
last_mouse_gx = 0;
last_mouse_gy = 0;

function doMouseMove(event) 
{
	/* Pixel location with respect to the canvas */
	mouse_x = event.clientX;
	mouse_y = event.clientY;
	
	/* World grid location */
	mouse_gx = Math.floor(mouse_x/View.grid_width)+View.view_grid_x;
	mouse_gy = Math.floor(mouse_y/View.grid_height)+View.view_grid_y;
	
	/* Handle mouse movement in the world */
	if (mouse_in_world()) {
		/* Mouse hit a new grid position */
		if (last_mouse_gx != mouse_gx || last_mouse_gy != mouse_gy ) {
			last_mouse_gx = mouse_gx;
			last_mouse_gy = mouse_gy;
			
			Hud.hover.add_message(Hud.hover.get_hover_mob(mouse_gx,mouse_gy));
		}
	/* Handle mouse movement in the HUD */
	} else { 
	
		if (Hud.inventory.selected_item) { Hud.render_selected_item(mouse_x, mouse_y, Hud.inventory.selected_item); }
		if (Hud.container.selected_item) { Hud.render_selected_item(mouse_x, mouse_y, Hud.container.selected_item); }
		/* Avatar box hovers (refactor this to the basic 4-corners check after HUD is finalized) */
		if ( mouse_y > Hud.avatar_box_y ) {
			     if ( mouse_x < Hud.avatar_box_x[1] ) { Hud.hover.add_message(Hud.hover.get_hover_avatar(0)); }
			else if ( mouse_x < Hud.avatar_box_x[2] ) { Hud.hover.add_message(Hud.hover.get_hover_avatar(1)); }
			else if ( mouse_x < Hud.avatar_box_x[3] ) { Hud.hover.add_message(Hud.hover.get_hover_avatar(2)); }
			else                                      { Hud.hover.add_message(Hud.hover.get_hover_avatar(3)); }
		/* Handle message box widget hovers */
		} else { Hud.mouse_handler_hover(mouse_x, mouse_y); }
	}
}

function doMouseClick(event)
{
	/* Handle mouse click in the world */
	if (mouse_in_world()) {
		/* Future movement by click code will go here */
	
	/* Handle mouse click in the HUD */
	} else { Hud.mouse_handler_click(mouse_x, mouse_y); }	
	
	View.render(base_context,animation_context,overlay_context);
}

function doMouseRelease(event)
{
	/* Handle mouse release in the world */
	if (mouse_in_world()) {
	
	/* Handle mouse release in the HUD */
	} else { Hud.mouse_handler_release(mouse_x, mouse_y); }	
	
	View.render(base_context,animation_context,overlay_context);
}

/* Returns true if te mouse is currently in the game world area */
function mouse_in_world() { return (mouse_x < View.view_px_width); }
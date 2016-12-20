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

function gameInit() 
{
	var i;
	
	/* from Math.js source */
	add_math_utilities();
	
	/* Capture key presses in the document and mouse movements on the highest canvas */
	document.addEventListener("keydown", doKeyDown, false);
	overlay_canvas.addEventListener("mousemove", doMouseMove, false);
	overlay_canvas.addEventListener("mousedown", doMouseClick, false);
	
	View = new View();
	World = new World();
	Player = create_player();
	Party = new Party();
	
	Monsters = [];
	Animations = [];
	
	for (i=0; i<NUMBER_OF_MONSTERS; i++) { Monsters[i] = create_monster(); }
	
	Hud = new Hud();
	
	Minimap = new initMinimap();
	
	View.refocus(Player.map_x, Player.map_y, true);
	View.render(base_context,animation_context);
	
	/* Can't add this listener until View has been instantiated */
	window.addEventListener("resize", View.resizeWindow, false);
	
}

function create_player() 
{
	var actor = new Player();
	actor.is_player = true;
	actor.map_x = 1096;
	actor.map_y = 671;
	actor.next_x = 1096;
	actor.next_y = 671;
	
	var current_view_grid_x = actor.map_x-View.view_grid_x;
	var current_view_grid_y = actor.map_y-View.view_grid_y;
	actor.px = current_view_grid_x*View.grid_width+View.grid_width/2
	actor.py = current_view_grid_y*View.grid_height
	
	return actor;
}

function create_monster(type = MTYPE_GOBLIN, level=MLEVEL_RANDOM, xx=0, yy=0) 
{
	var monster = new Monster(type, level, xx, yy);
	return monster;
}
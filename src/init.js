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

function gameInit() 
{
	var i;
	
	/* from Math.js source */
	add_math_utilities();
	
	/* Capture key presses in the document and mouse movements on the highest canvas */
	document.addEventListener("keydown", doKeyDown, false);
	overlay_canvas.addEventListener("mousemove", doMouseMove, false);
	overlay_canvas.addEventListener("mousedown", doMouseClick, false);
	overlay_canvas.addEventListener("mouseup", doMouseRelease, false);
	
	/* Make the game-level objects */
	View = new View();
	World = new World();
	Player = create_player();
	Party = new Party();
	
	/* Make game-level data accessor arrays */
	Monsters = [];
	Containers = [];
	Animations = [];
	
	/* populator world containers (chests) */
	World.init_static_containers(Containers);
	
	/* Generate monsters from spawn points */
	for (i=0; i<World.spawn_points.length; i++) {
		World.spawn_points[i].spawn_monsters();
	}
	
	/* Create the Hud */
	Hud = new Hud();
	
	/* Create the minimap */
	Minimap = new Minimap();
	
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
	
	actor.update_pxpy();
	
	return actor;
}
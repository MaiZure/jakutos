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

/* gameInit() is the first function called, which kicks off the game start. This
 * happens from main.js when the browser window finishes loading the DOM elements.
 * Note that everything here has global scope within the browser window. I'll keep
 * this scope as clear as practically possible and try to rely on object namespaces
 * and interfaces. This is an ongoing evolution.
 */
function gameInit() 
{
	var i;
	
	/* from Math.js source */
	add_math_utilities();
	
	/* Capture key presses in the document and mouse movements on the highest canvas.
	 * These listeners are the input entry points in to our asynchronous "engine" */
	document.addEventListener("keydown", doKeyDown, false);
	overlay_canvas.addEventListener("mousemove", doMouseMove, false);
	overlay_canvas.addEventListener("mousedown", doMouseClick, false);
	overlay_canvas.addEventListener("mouseup", doMouseRelease, false);
	
	/* Make the game-level objects */
	View = new View();
	World = new World();
	Player = new Player();
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
	
	/* Calculate the initial view area and perform the first render */
	View.refocus(Player.map_x, Player.map_y, true);
	View.render(base_context,animation_context);
	
	/* Can't add this listener until View has been instantiated */
	window.addEventListener("resize", View.resizeWindow, false);
	
}

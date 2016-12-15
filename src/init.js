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

function gameInit()
{
	var i;
	
	/* Set the three canvas dimensions on load and divisible by 8 (may help future calcs)*/
	baseCanvas.width = Math.round(window.innerWidth*0.96); baseCanvas.width -= baseCanvas.width % 8;
	baseCanvas.height = Math.round(window.innerHeight*0.96); baseCanvas.height -= baseCanvas.height % 8;
	animationCanvas.width = Math.round(window.innerWidth*0.96); animationCanvas.width -= animationCanvas.width % 8;
	animationCanvas.height = Math.round(window.innerHeight*0.96); animationCanvas.height -= animationCanvas.height % 8;
	overlayCanvas.width = Math.round(window.innerWidth*0.96); overlayCanvas.width -= overlayCanvas.width % 8;
	overlayCanvas.height = Math.round(window.innerHeight*0.96); overlayCanvas.height -= overlayCanvas.height % 8;
	
	/* Capture key presses in the document and mouse movements on the highest canvas */
	document.addEventListener("keydown", doKeyDown, false);
	overlayCanvas.addEventListener("mousemove", doMouseMove, false);
	overlayCanvas.addEventListener("mousedown", doMouseClick, false);
	
	Camera = new initCamera();
	Region = new initRegion();
	Player = create_player();
	Party = new Party();
	
	Monsters = [];
	for (i=0; i<NUMBER_OF_MONSTERS; i++) { Monsters[i] = create_monster(); }
	
	Hud = new Hud();
	
	Minimap = new initMinimap();
	
	Camera.refocus(Player.map_x, Player.map_y, true);
	Camera.render(base_context,animation_context);
	
}

function create_player()
{
	var actor = new Actor();
	actor.is_player = true;
	actor.map_x = 1096;
	actor.map_y = 671;
	actor.next_x = 1096;
	actor.next_y = 671;
	actor.avatar = "@";
	return actor;
}

function create_monster(type, level=MLEVEL_RANDOM, xx=0, yy=0)
{
	var monster = new Monster(type, level, xx, yy);
	//monster.map_x = Math.round(Math.random()*WORLD_SIZE_X-4)+2;
	//monster.map_y = Math.round(Math.random()*WORLD_SIZE_Y-4)+2;
	//monster.next_x = monster.map_x
	//monster.next_y = monster.map_y
	//monster.avatar = "s";
	//monster.color = "rgb(224,224,0)";
	return monster;
}
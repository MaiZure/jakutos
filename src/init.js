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
	
	Region = new initRegion();
	Hud = new initHud();
	Player = create_player();
	
	Monsters = [];
	for (i=0; i<NUMBER_OF_MONSTERS; i++) { Monsters[i] = create_monster(); }
	
	worldCanvas.width = Math.round(window.innerWidth*0.96);
	worldCanvas.height = Math.round(window.innerHeight*0.96);
	actorCanvas.width = Math.round(window.innerWidth*0.96);
	actorCanvas.height = Math.round(window.innerHeight*0.96);
	
	refocus_view(Player.map_x, Player.map_y);
	renderWorld(wctx,actx);
}

function create_player()
{
	var actor = new initActor("@");
	actor.is_player = true;
	return actor;
}

function create_monster()
{
	var actor = new initActor("s");
	actor.color = "rgb(224,224,0)";
	return actor;
}
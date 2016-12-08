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

function doKeyDown(event)
{
	var i;
	
	/* In lieu of a formal game loop (async-type state-machine), I'll trigger updates based on all key presses */
	switch (event.keyCode)
	{	
		case KB_LEFT: Player.move_left(); break;
		case KB_UP: Player.move_up(); break;
		case KB_RIGHT: Player.move_right(); break;
		case KB_DOWN: Player.move_down(); break;
		case KB_A: toggle_animate(); break;
		case KB_C: refocus_view(Player.map_x, Player.map_y); break;
		case KB_MINUS: world_rescale_down(); break;
		case KB_PLUS: world_rescale_up(); break;
	}
	
	for (i=0; i<Monsters.length; i++) { Monsters[i].ai_move(); }
	
	renderWorld(wctx,actx);
}
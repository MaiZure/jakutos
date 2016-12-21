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


/* Poor man's engine for now. Not really a good idea to build the game
   Loop around the keyboard event */
function doKeyDown(event) 
{
	var i;
	
	/* In lieu of a formal game loop (async-type state-machine), I'll trigger updates based on all key presses */
	
	switch (event.keyCode) {	
		case KB_LEFT: Player.check_action(DIR_W); break;
		case KB_UP: Player.check_action(DIR_N); break;
		case KB_RIGHT: Player.check_action(DIR_E); break;
		case KB_DOWN: Player.check_action(DIR_S); break;
		case KB_1:
		case KB_2:
		case KB_3:
		case KB_4: Party.change_active_party_member(event.keyCode-KB_1); break;
		case KB_A: Player.execute_ranged_attack(); break;
		case KB_C: View.refocus(Player.map_x, Player.map_y); break;
		case KB_M: View.toggle_minimap(); break;
		case KB_MINUS: View.world_rescale_down(); break;
		case KB_PLUS: View.world_rescale_up(); break;
	}
	
	/* perform the player action */
	Player.execute_move();
	
	/* Animate stuff */
	View.render_animations();
	
	/* Determine monster actions (When there's a lot of monsters, this should be
		refactored to something better than O(n). Such as a PQ that looks just
		beyond the interesting rate */
	for (i=0; i<Monsters.length; i++) {
		Monsters[i].ai_action(); 
	}
	
	/* Do some more updates */
	Player.update_tick();
	
	/* Render the world */
	View.render(base_context,animation_context,overlay_context);
}
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


/* Poor man's engine for now. Not really a good idea to build the game
   Loop around the keyboard event */
function doKeyDown(event) 
{
	var i;
	
	/* In lieu of a formal game loop (async-type state-machine), I'll trigger updates based on all key presses
	   This should eventually be abstracted by an 'Engine' object that separates listening and execution of all world objects
	   I'll deal with this when I've made enough '2% rules' that justify separate execution order buckets */
	
	handle_active_events(event.keyCode);
	handle_passive_events(event.keyCode);	
	
	/* Render the world */
	View.render(base_context,animation_context,overlay_context);
}

/* These keyboard events cause time to pass */
function handle_active_events(key) {
	
	switch (key) {
		case KB_LEFT: Player.check_action(DIR_W); break;
		case KB_UP: Player.check_action(DIR_N); break;
		case KB_RIGHT: Player.check_action(DIR_E); break;
		case KB_DOWN: Player.check_action(DIR_S); break;
		case KB_A: Player.execute_auto_attack(); break;
		case KB_C: Player.execute_cast_attack(); break;
		
		case KB_9: World.save_map(); break;
		case KB_W: World.set_wall(); break;
		case KB_D: World.set_door(); break;
		case KB_E: World.set_stairs(); break;
		case KB_H: console.log(World.gridheight[Player.map_y][Player.map_x]); break;
		case KB_TILDE: SETTING_EDIT_MODE = !SETTING_EDIT_MODE; break;
		case KB_LBRACKET: World.lower_terrain(Player.map_x, Player.map_y); break;
		case KB_RBRACKET: World.raise_terrain(Player.map_x, Player.map_y); break;
		default: return false; break;
	}
	
	/* perform the player action */
	Player.execute_move();
	
	/* Animate stuff - limited rendering */
	View.render_animations();
	
	/* Do some more updates */
	Player.update_tick();
	
	/* Determine monster actions (When there's a lot of monsters, this should be
		refactored to something better than O(n). Such as a PQ that segments time
		slots. */
	for (i=0; i<Monsters.length; i++) {
		Monsters[i].ai_action(); 
	}
}

function handle_passive_events(key) {
	
	switch (key) {
		case KB_1:
		case KB_2:
		case KB_3:
		case KB_4: Party.activate_party_member(event.keyCode-KB_1); break;
		case KB_8: console.log(World.get_current_region()); break;
		case KB_X: View.refocus(Player.map_x, Player.map_y); break;
		case KB_M: View.toggle_minimap(); break;
		case KB_MINUS: View.world_rescale_down(); break;
		case KB_PLUS: View.world_rescale_up(); break;
	}
}
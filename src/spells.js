/**
 * Project Jakutos
 *
 *  Copyright 2016 by MaiZure <maizure/\member.fsf.org>
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
 
/* Takes a spell and actor (monster or player) and returns a damage */
function get_spell_damage(spell, caster)
{
	var skill_level, damage;
	
	/* Fix the reference between monster and player
	if (caster === Player)
	*/
	damage = 0;
	
	switch (spell) {
		case SPELL_FLAME_ARROW: {
			
			skill_level = caster.skill_fire_magic;
			
			damage += Math.roll_die(1,8,0);
			
		}; break;
		case SPELL_MAGIC_ARROW: {
			
		}; break;
		case SPELL_MIND_BLAST: {
			
			skill_level = caster.skill_mind_magic;
			damage = Math.roll_die(1,2,0);
			
		}; break;
		case SPELL_STATIC_CHARGE: {
			
		}; break;
		case SPELL_COLD_BEAM: {
			
		}; break;
		case SPELL_SPIRIT_ARROW: {
			
			skill_level = caster.skill_spirit_magic;
			
			damage += Math.roll_die(1,6,0);
			
		}; break;
	}
	
	return damage;
}

function get_spell_cost(spell, caster)
{
{
	var skill_level, cost;
	
	cost = 0;
	
	switch (spell) {
		case SPELL_FLAME_ARROW: {
			cost = 2;
		}; break;
		case SPELL_MAGIC_ARROW: {
			cost = 2;
		}; break;
		case SPELL_MIND_BLAST: {
			cost = 3;
		}; break;
		case SPELL_STATIC_CHARGE: {
			cost = 2;
		}; break;
		case SPELL_COLD_BEAM: {
			cost = 2;
		}; break;
		case SPELL_SPIRIT_ARROW: {
			cost = 1;
		}; break;
	}
	
	return cost;
}	
}

function get_spell_shot(spell, caster, target = 0)
{
	var source_gx, source_gy;
	var source_px, source_py;
	var target_px, target_py;
	var target_direction;
	
	source_gx = caster.map_x;
	source_gy = caster.map_y;
	source_px = View.get_pxc(caster.map_x);
	source_py = View.get_pyc(caster.map_y);
	
	if (target) {
		target_px = View.get_pxc(target.map_x);
		target_py = View.get_pyc(target.map_y);
	}
	
	if (!target) {
		target_px = mouse_x;
		target_py = mouse_y;
	}
	
	target_direction = Math.point_direction(source_px, source_py, target_px, target_py);
	
	switch (spell) {
		case SPELL_FLAME_ARROW: {
			return new Flamearrow(source_gx, source_gy, target_direction);
		}; break;
		case SPELL_MAGIC_ARROW: {
			
		}; break;
		case SPELL_MIND_BLAST: {
			return new Mindblast(source_gx, source_gy, target_direction);
		}; break;
		case SPELL_STATIC_CHARGE: {
			
		}; break;
		case SPELL_COLD_BEAM: {
			
		}; break;
		case SPELL_SPIRIT_ARROW: {
			return new Spiritarrow(source_gx, source_gy, target_direction);
		}; break;
	}
}
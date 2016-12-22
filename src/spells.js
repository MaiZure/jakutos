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
 
/* Takes a spell and actor (monster or player) and returns a damage */
function get_spell_damage(spell, caster)
{
	var skill_level, damage;
	
	damage = 0;
	
	switch (spell) {
		case SPELL_FLAME_ARROW: {
			
			skill_level = caster.skill_fire_magic;
			
			for (i=0; i<skill_level; i++) {
				damage += Math.floor(Math.random()*8+1);
			}
			
		}; break;
		case SPELL_MAGIC_ARROW: {
			
		}; break;
		case SPELL_MIND_BLAST: {
			
		}; break;
		case SPELL_STATIC_CHARGE: {
			
		}; break;
		case SPELL_COLD_BEAM: {
			
		}; break;
	}
	
	return damage;
}

function get_spell_shot(spell, caster)
{
	switch (spell) {
		case SPELL_FLAME_ARROW: {
			return new Flamearrow(caster.map_x, caster.map_y, Math.point_direction(View.get_px(caster.map_x), View.get_py(caster.map_y), View.get_px(Player.map_x), View.get_py(Player.map_y)))
		}; break;
		case SPELL_MAGIC_ARROW: {
			
		}; break;
		case SPELL_MIND_BLAST: {
			
		}; break;
		case SPELL_STATIC_CHARGE: {
			
		}; break;
		case SPELL_COLD_BEAM: {
			
		}; break;
	}
}
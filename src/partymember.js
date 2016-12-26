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

/* Holds all the data for a single party member */
function Partymember(party, id) 
{
	var i;
	
	this.party = party;
	this.id = id;
	
	this.status = 0 /* Status flags */
	this.xp = 0;
	this.level = 1;
	this.age = 20;
	this.spell_book = [];
	
	/* Skill arrays including separate modifier arrays
	   base is permanent, modifiers are temporary (spells/items) */
    this.skill= [];  this.skill_mods = [];
	this.stat = [];   this.stat_mods = [];
	this.resist = []; this.resist_mods = [];
	
	for (i=0; i<30; i++) {
		this.skill[i] = 0;  this.skill_mods[i] = 0;
		this.stat[i] = 0;   this.stat_mods[i] = 0;
		this.resist[i] = 0; this.resist_mods[i] = 0;
	}
	
	this.armor = 0;   this.armor_mods = 0;
	
	this.job = CLASS_ARCHERER;
	this.name = "Locke";
	
	this.max_hp = 10;
	this.current_hp = this.max_hp;
	this.max_mp = 10;
	this.current_mp = this.max_mp;
	
	this.base_delay = 10;
	this.current_delay = 0;
	
	this.melee_die_num = 2;
	this.melee_die_side = 3;
	this.melee_die_bonus = 1;
	
	this.ranged_die_num = 1;
	this.ranged_die_side = 3;
	this.ranged_die_bonus = 1;
	
	this.quick_spell = SPELL_NONE;
	
	for (i=0; i<30; i++) { this.skill[i] = 0; }
	for (i=0; i<6; i++) { this.stat[i] = 0; }
	for (i=0; i<6; i++) { this.resist[i] = 0; }
	
	this.inventory = new Inventory(this);
}


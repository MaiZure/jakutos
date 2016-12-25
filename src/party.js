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
 
function Party() 
{
	var i;
	
	/* Set basic party stats */
	for (i=0; i<4; i++) {
		this.status[i] = 0;
		this.xp[i] = 0;
		this.level[i] = 1;
		this.spell_book[i] = [];
		
		this.skill_fire_magic[i] = 0;
		this.skill_earth_magic[i] = 0;
		this.skill_wind_magic[i] = 0;
		this.skill_water_magic[i] = 0;
		this.skill_mind_magic[i] = 10;
		this.skill_body_magic[i] = 0;
		this.skill_spirit_magic[i] = 0;
		this.skill_light_magic[i] = 0;
		this.skill_dark_magic[i] = 0;
		this.resist_fire[i] = 0;
		this.resist_electric[i] = 0;
		this.resist_cold[i] = 0;
		this.resist_poison[i] = 0;
		this.resist_magic[i] = 0;
		this.resist_physical[i] = 0;
	}
	
	/* Temporary constructor for a default party */
	this.job[0] = CLASS_KNIGHT; this.name[0] = "Cyan";
	this.job[1] = CLASS_PALADIN; this.name[1] = "Cecil";
	this.job[2] = CLASS_CLERIC; this.name[2] = "Celes";
	this.job[3] = CLASS_SORCERER; this.name[3] = "Rydia";
	
	this.max_hp[0] = 30; this.current_hp[0]=this.max_hp[0];
	this.max_hp[1] = 25; this.current_hp[1]=this.max_hp[1];
	this.max_hp[2] = 15; this.current_hp[2]=this.max_hp[2];
	this.max_hp[3] = 12; this.current_hp[3]=this.max_hp[3];
	
	this.max_mp[0] = 0; this.current_mp[0]=this.max_mp[0];
	this.max_mp[1] = 6; this.current_mp[1]=this.max_mp[1];
	this.max_mp[2] = 12; this.current_mp[2]=this.max_mp[2];
	this.max_mp[3] = 15; this.current_mp[3]=this.max_mp[3];
	
	this.base_delay[0] = 9; this.current_delay[0] = 0;
	this.base_delay[1] = 10; this.current_delay[1] = 0;
	this.base_delay[2] = 11; this.current_delay[2] = 0;
	this.base_delay[3] = 12; this.current_delay[3] = 0;
	
	this.melee_die_num[0] = 2; this.melee_die_side[0] = 4; this.melee_die_bonus[0] = 1;
	this.melee_die_num[1] = 2; this.melee_die_side[1] = 3; this.melee_die_bonus[1] = 1;
	this.melee_die_num[2] = 1; this.melee_die_side[2] = 3; this.melee_die_bonus[2] = 0;
	this.melee_die_num[3] = 1; this.melee_die_side[3] = 2; this.melee_die_bonus[3] = 0;
	
	this.ranged_die_num[0] = 1; this.ranged_die_side[0] = 3; this.ranged_die_bonus[0] = 1;
	this.ranged_die_num[1] = 1; this.ranged_die_side[1] = 3; this.ranged_die_bonus[1] = 1;
	this.ranged_die_num[2] = 1; this.ranged_die_side[2] = 3; this.ranged_die_bonus[2] = 1;
	this.ranged_die_num[3] = 1; this.ranged_die_side[3] = 3; this.ranged_die_bonus[3] = 1;
	
	this.quick_spell[0]= SPELL_NONE;
	this.quick_spell[1]= SPELL_SPIRIT_ARROW;
	this.quick_spell[2]= SPELL_MIND_BLAST;
	this.quick_spell[3]= SPELL_FLAME_ARROW;
	
	this.active_partymember = 0;
}

Party.prototype.job = [];
Party.prototype.max_hp = [];
Party.prototype.max_mp = [];
Party.prototype.current_hp = [];
Party.prototype.current_mp = [];
Party.prototype.status = [];
Party.prototype.level = [];
Party.prototype.xp = [];
Party.prototype.name = [];
Party.prototype.base_delay = [];
Party.prototype.current_delay = [];
Party.prototype.melee_die_num = [];
Party.prototype.melee_die_side = [];
Party.prototype.melee_die_bonus = [];
Party.prototype.ranged_die_num = [];
Party.prototype.ranged_die_side = [];
Party.prototype.ranged_die_bonus = [];
Party.prototype.spell_book = [];
Party.prototype.quick_spell = [];
Party.prototype.skill_fire_magic = [];
Party.prototype.skill_earth_magic = [];
Party.prototype.skill_wind_magic = [];
Party.prototype.skill_water_magic = [];
Party.prototype.skill_mind_magic = [];
Party.prototype.skill_body_magic = [];
Party.prototype.skill_spirit_magic = [];
Party.prototype.skill_light_magic = [];
Party.prototype.skill_dark_magic = [];
Party.prototype.resist_fire = [];
Party.prototype.resist_electric = [];
Party.prototype.resist_cold = [];
Party.prototype.resist_poison = [];
Party.prototype.resist_magic = [];
Party.prototype.resist_physical = [];



Party.prototype.is_incapacitated = function(party_member) 
{ 
	return (this.status[party_member] & (STATUS_DEAD | STATUS_UNCONCIOUS | STATUS_ASLEEP | STATUS_PARALYZED | STATUS_ERADICATED)); 
};

Party.prototype.is_ready = function(party_member) 
{
	return (this.current_delay[party_member] === 0 && !this.is_incapacitated(party_member)); 
};
	
Party.prototype.is_party_dead = function() 
{
	if (this.is_incapacitated(0) && this.is_incapacitated(1) && this.is_incapacitated(2) && this.is_incapacitated(3)) {
		return true; 
	}
	
	return false;
};


/* Interface to add experience to party members */
Party.prototype.add_xp = function(xp_amount) 
{
	var i;
	
	for (i=0; i<4; i++) {
		if (!this.is_incapacitated(i)) {
			this.xp[i] += xp_amount; 
		}
	}
};
	
/* Interface to damage party members */
Party.prototype.damage_party = function(attacker, damage_amount, target = -1, damage_type = DAM_PHYSICAL) 
{
	if (this.is_party_dead()) { return false; }
	
	/* Pick a party member at random */
	if (target == -1) {
		target = Math.floor(Math.random()*3.99);
		
		while (this.is_incapacitated(target)) {
			target = Math.floor(Math.random()*3.99); 
		}
	}
	
	this.current_hp[target] -= damage_amount;
	
	if (this.current_hp[target] <= 0) { 
		this.status[target] |= STATUS_UNCONCIOUS; 
	}
		
	if (this.current_hp[target] <= -25) {
		this.status[target] |= STATUS_DEAD; 
	}
		
	if (this.current_hp[target] <= -100) {
		this.status[target] |= STATUS_ERADICATED; 
	}
	
	Hud.partymember[target].dirty = true;
	
	if (attacker != -1) { 
		Hud.message.add_message(attacker.name + Player.get_damage_action(damage_type) + this.name[target] + " for " + damage_amount); 
	}
};

/* Tick the party delay counter */
Party.prototype.reduce_delay = function(amount = 1)
{
	var i;
	
	for (i=0; i<4; i++)
	{
		Party.current_delay[i] -= amount;
		if (Party.current_delay[i] === 0) {
			Hud.partymember[i].dirty = true; 
		}
		Party.current_delay[i] = Math.max(Party.current_delay[i],0);
	}
};

/* Find a ready party member */
Party.prototype.find_ready_party_member = function() 
{
	var i;
	var current = Party.active_partymember;
	
	/* Check if active party member is legit */
	if (current != -1 && !this.is_ready(current)) { 
		current = -1; 
	}
	
	/* If someone is already active, keep them active */
	if (current != -1) { return current; }
	
	/* Find new party member */
	for (i=0; i<4; i++) {
		if (this.is_ready(i) && !this.is_incapacitated(i)) {
			Hud.partymember[i].dirty = true;
			return i;
		}
	}
	/* If you get here, nobody must be ready */
	return -1;
};

/* Procedurally changes active party member and functionally returns the slot */
Party.prototype.change_active_party_member = function(next)
{	
	last = this.active_partymember;
	delay = this.current_delay[next];
	status = this.status[next];
	
	if (last == next) { return last; }
	
	if (this.is_ready(next) && !this.is_incapacitated(next)) { 
		this.active_partymember = next;
		if (last >= 0) { Hud.partymember[last].dirty = true; }
		Hud.partymember[next].dirty = true;		
		return next;
	}
	return last;
};

Party.prototype.get_xp_requirement = function (level) 
{
	if (level == 1) { return 0; }
	return 1000 * (level-1) + this.xp_requirement(level-1);
};

Party.prototype.fall_damage = function (height_difference) 
{
	var i, damage;
	for (i=0; i<4; i++) {
		damage = Math.round(-(height_difference+2)*Math.random()*0.25*Party.max_hp[i])+1;
		this.damage_party(-1, damage, i);
	}
	
	Hud.message.add_message("Waaaa...!");
};

Party.prototype.get_class = function(party_class)
{
	switch (party_class) {
		case CLASS_KNIGHT: return "Knight"; return;
		case CLASS_PALADIN:  return "Paladin"; return;
		case CLASS_ARCHERER: return "Archerer"; return;
		case CLASS_DRUID: return "Druid"; return;
		case CLASS_CLERIC: return "Cleric"; return;
		case CLASS_SORCERER: return "Sorcerer"; return;
	}
}
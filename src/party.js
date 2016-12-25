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
	this.active_partymember = 0;
	
	var i;
	
	for (i=0;i<4;i++) {
		this.member[i] = new Partymember(this,i);
	}
	
	/* Temporary constructor for a default party */
	this.member[0].name = "Cyan";
	this.member[1].name = "Cecil";
	this.member[2].name = "Celes";
	this.member[3].name = "Rydia";
	
	this.member[0].job = CLASS_KNIGHT; 
	this.member[1].job = CLASS_PALADIN; 
	this.member[2].job = CLASS_CLERIC; 
	this.member[3].job = CLASS_SORCERER; 
	
	this.member[0].max_hp = 30; this.member[0].current_hp = this.member[0].max_hp;
	this.member[1].max_hp = 25; this.member[1].current_hp = this.member[1].max_hp;
	this.member[2].max_hp = 15; this.member[2].current_hp = this.member[2].max_hp;
	this.member[3].max_hp = 12; this.member[3].current_hp = this.member[3].max_hp;
	
	this.member[0].max_mp = 0; this.member[0].current_mp = this.member[0].max_mp;
	this.member[1].max_mp = 6; this.member[1].current_mp = this.member[1].max_mp;
	this.member[2].max_mp = 12; this.member[2].current_mp = this.member[2].max_mp;
	this.member[3].max_mp = 15; this.member[3].current_mp = this.member[3].max_mp;
	
	this.member[0].base_delay = 9; this.member[0].current_delay = 0;
	this.member[1].base_delay = 10; this.member[1].current_delay = 0;
	this.member[2].base_delay = 11; this.member[2].current_delay = 0;
	this.member[3].base_delay = 12; this.member[3].current_delay = 0;
	
	this.member[0].melee_die_num = 2; this.member[0].melee_die_side = 4; this.member[0].melee_die_bonus = 1;
	this.member[1].melee_die_num = 2; this.member[1].melee_die_side = 3; this.member[1].melee_die_bonus = 1;
	this.member[2].melee_die_num = 1; this.member[2].melee_die_side = 3; this.member[2].melee_die_bonus = 0;
	this.member[3].melee_die_num = 1; this.member[3].melee_die_side = 2; this.member[3].melee_die_bonus = 0;
	
	this.member[0].ranged_die_num = 1; this.member[0].ranged_die_side = 3; this.member[0].ranged_die_bonus = 1;
	this.member[1].ranged_die_num = 1; this.member[1].ranged_die_side = 3; this.member[1].ranged_die_bonus = 1;
	this.member[2].ranged_die_num = 1; this.member[2].ranged_die_side = 3; this.member[2].ranged_die_bonus = 1;
	this.member[3].ranged_die_num = 1; this.member[3].ranged_die_side = 3; this.member[3].ranged_die_bonus = 1;
	
	this.member[0].quick_spell = SPELL_NONE;
	this.member[1].quick_spell = SPELL_SPIRIT_ARROW;
	this.member[2].quick_spell = SPELL_MIND_BLAST;
	this.member[3].quick_spell = SPELL_FLAME_ARROW;
}

Party.prototype.member = [];

Party.prototype.is_incapacitated = function(party_member) 
{
	return (this.member[party_member].status & (STATUS_DEAD | STATUS_UNCONCIOUS | STATUS_ASLEEP | STATUS_PARALYZED | STATUS_ERADICATED)); 
};

Party.prototype.is_ready = function(party_member) 
{
	return (this.member[party_member].current_delay === 0 && !this.is_incapacitated(party_member)); 
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
			this.member[i].xp += xp_amount; 
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
	
	this.member[target].current_hp -= damage_amount;
	
	if (this.member[target].current_hp <= 0) { 
		this.member[target].status |= STATUS_UNCONCIOUS; 
	}
		
	if (this.member[target].current_hp <= -25) {
		this.member[target].status |= STATUS_DEAD; 
	}
		
	if (this.member[target].current_hp <= -100) {
		this.member[target].status |= STATUS_ERADICATED; 
	}
	
	Hud.partywidget[target].dirty = true;
	
	if (attacker != -1) { 
		Hud.message.add_message(attacker.name + Player.get_damage_action(damage_type) + this.member[target].name + " for " + damage_amount); 
	}
};

/* Tick the party delay counter */
Party.prototype.reduce_delay = function(amount = 1)
{
	var i;
	
	for (i=0; i<4; i++)
	{
		Party.member[i].current_delay -= amount;
		if (Party.member[i].current_delay === 0) {
			Hud.partywidget[i].dirty = true; 
		}
		Party.member[i].current_delay = Math.max(Party.member[i].current_delay, 0);
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
			Hud.partywidget[i].dirty = true;
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
	delay = this.member[next].current_delay;
	status = this.member[next].status;
	
	if (last == next) { return last; }
	
	if (this.is_ready(next) && !this.is_incapacitated(next)) { 
		this.active_partymember = next;
		if (last >= 0) { Hud.partywidget[last].dirty = true; }
		Hud.partywidget[next].dirty = true;		
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
		damage = Math.round(-(height_difference+2)*Math.random()*0.25*Party.member[i].max_hp)+1;
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
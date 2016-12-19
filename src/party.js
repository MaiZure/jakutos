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
	
	this.base_delay[0] = 5; this.current_delay[0] = 0;
	this.base_delay[1] = 6; this.current_delay[1] = 0;
	this.base_delay[2] = 7; this.current_delay[2] = 0;
	this.base_delay[3] = 8; this.current_delay[3] = 0;
	
	this.die_num[0] = 2; this.die_side[0] = 4; this.die_bonus[0] = 1;
	this.die_num[1] = 2; this.die_side[1] = 3; this.die_bonus[1] = 1;
	this.die_num[2] = 1; this.die_side[2] = 3; this.die_bonus[2] = 0;
	this.die_num[3] = 1; this.die_side[3] = 2; this.die_bonus[3] = 0;
	
	for (i=0;i<4;i++)
	{
		this.status[i] = 0;
		this.xp[i] = 0;
		this.level[i] = 1;
	}
	
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
Party.prototype.die_num = [];
Party.prototype.die_side = [];
Party.prototype.die_bonus = [];


Party.prototype.is_incapacitated = function(party_member)
	{ return (this.status[party_member] & (STATUS_DEAD | STATUS_UNCONCIOUS | STATUS_ASLEEP | STATUS_PARALYZED | STATUS_ERADICATED)); }

Party.prototype.is_ready = function(party_member)
	{ return (this.current_delay[party_member] == 0 && !this.is_incapacitated(party_member)); }
	
Party.prototype.is_party_dead = function()
{
	if (this.is_incapacitated(0) && this.is_incapacitated(1) && this.is_incapacitated(2) && this.is_incapacitated(0))
		{ return true; }
	return false;
}


/* Interface to add experience to party members */
Party.prototype.add_xp = function(xp_amount)
{
	var i;
	for (i=0;i<4;i++)
	{
		if (!this.is_incapacitated(i)) { this.xp[i] += xp_amount; }
	}
}
	
/* Interface to damage party members */
Party.prototype.damage_party = function(attacker, damage_amount, target = -1, damage_type = DAM_PHYSICAL)
{
	if (this.is_party_dead()) { return false; }
	
	if (target == -1)
	{
		var target = Math.floor(Math.random()*3.99);
		
		/* Definite bug here if everyone is dead/knocked out */
		while (this.is_incapacitated(target))
			{ target = Math.floor(Math.random()*3.99); }
	}
	
	this.current_hp[target] -= damage_amount;
	
	if (this.current_hp[target] <= 0)
		{ this.status[target] |= STATUS_UNCONCIOUS; }
		
	if (this.current_hp[target] <= -25)
		{ this.status[target] |= STATUS_DEAD; }
		
	if (this.current_hp[target] <= -100)
		{ this.status[target] |= STATUS_ERADICATED; }
	
	Hud.partymember[target].dirty = true;
	
	if (attacker != -1) { Hud.message.add_message(attacker.name + " hits "+ this.name[target] + " for " + damage_amount); }
}

/* Tick the party delay counter */
Party.prototype.reduce_delay = function(amount = 1)
{
	var i;
	
	for (i=0; i<4; i++)
	{
		Party.current_delay[i]-= amount;
		if (Party.current_delay[i] == 0) { Hud.partymember[i].dirty = true; }
		Party.current_delay[i] = Math.max(Party.current_delay[i],0);
	}
}

/* Find a ready party member */
Party.prototype.find_ready_party_member = function()
{
	var i;
	var current = Party.active_partymember;
	
	/* Check if active party member is legit */
	if (current != -1 && !this.is_ready(current))
		{ current = -1; }
	
	/* If someone is already active, keep them active */
	if (current != -1) { return current; }
	
	/* Find new party member */
	for (i=0; i<4; i++)
	{
		if (this.is_ready(i) && !this.is_incapacitated(i))
		{
			Hud.partymember[i].dirty = true;
			return i;
		}
	}
	/* If you get here, nobody must be ready */
	return -1;
}

/* Procedurally changes active party member and functionally returns the slot */
Party.prototype.change_active_party_member = function(next)
{	
	last = this.active_partymember;
	delay = this.current_delay[next];
	status = this.status[next];
	
	if (last == next) { return last; }
	
	if (this.is_ready(next) && !this.is_incapacitated(next))
	{ 
		this.active_partymember = next;
		if (last >= 0) { Hud.partymember[last].dirty = true; }
		Hud.partymember[next].dirty = true;		
		return next;
	}
	return last;
}

Party.prototype.get_xp_requirement = function (level)
{
	if (level == 1) { return 0; }
	return 1000 * (level-1) + this.xp_requirement(level-1)
}

Party.prototype.fall_damage = function (height_difference)
{
	var i, damage;
	for (i=0; i<4; i++)
	{
		damage = Math.round(-(height_difference+2)*Math.random()*0.25*Party.max_hp[i])+1;
		console.log(height_difference+"/"+damage);
		this.damage_party(-1, damage, i);
	}
	
	Hud.message.add_message("Waaaa...!");
}
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
	
	this.base_delay[0] = 5; this.current_delay[0] = this.base_delay[0];
	this.base_delay[1] = 6; this.current_delay[1] = this.base_delay[1];
	this.base_delay[2] = 7; this.current_delay[2] = this.base_delay[2];
	this.base_delay[3] = 8; this.current_delay[3] = this.base_delay[3];
	
	this.die_num[0] = 2; this.die_side[0] = 4; this.die_bonus[0] = 1;
	this.die_num[1] = 2; this.die_side[1] = 3; this.die_bonus[1] = 1;
	this.die_num[2] = 1; this.die_side[2] = 3; this.die_bonus[2] = 0;
	this.die_num[3] = 1; this.die_side[3] = 2; this.die_bonus[3] = 0;
	
	for (i=0;i<4;i++)
	{
		this.status[i] = 0;
		this.xp[i] = 0;
	}
	
	this.active_partymember = 0;
}

Party.prototype.job = [];
Party.prototype.max_hp = [];
Party.prototype.max_mp = [];
Party.prototype.current_hp = [];
Party.prototype.current_mp = [];
Party.prototype.status = [];
Party.prototype.xp = [];
Party.prototype.name = [];
Party.prototype.base_delay = [];
Party.prototype.current_delay = [];
Party.prototype.die_num = [];
Party.prototype.die_side = [];
Party.prototype.die_bonus = [];


Party.prototype.add_xp = function(xp_amount)
{
	var i;
	for (i=0;i<4;i++)
	{
		if (!((this.status[i] & STATUS_DEAD) | (this.status[i] & STATUS_UNCONCIOUS)))
			this.xp[i] += xp_amount
	}
}

Party.prototype.damage_party = function(attacker, damage_amount, damage_type = DAM_PHYSICAL)
{
	var target = Math.floor(Math.random()*3.99);
	
	/* Definite bug here if everyone is dead/knocked out */
	while (Party.status[target] & (STATUS_DEAD | STATUS_UNCONCIOUS))
	{
		target = Math.floor(Math.random()*3.99);
	}
	
	Party.current_hp[target] -= damage_amount;
	Hud.partymember[target].dirty = true;
	
	Hud.message.add_message(attacker.name + " hits "+ this.name[target] + " for " + damage_amount);
}

Party.prototype.reduce_delay = function(amount = 1)
{
	Party.current_delay[0] = Math.max(Party.current_delay[0]-amount, 0);
	Party.current_delay[1] = Math.max(Party.current_delay[1]-amount, 0); 
	Party.current_delay[2] = Math.max(Party.current_delay[2]-amount, 0);
	Party.current_delay[3] = Math.max(Party.current_delay[3]-amount, 0);
}

Party.prototype.find_ready_party_member = function()
{
	var i;
	var current = Party.active_partymember;
	/* Check if active party member is legit */
	if (current != -1)
	{
		if (Party.status[current] & (STATUS_DEAD | STATUS_UNCONCIOUS | STATUS_ASLEEP | STATUS_PARALYZED))
		{
			current = -1;
		}
	}
	
	/* If someone is already active, keep them active */
	if (current != -1) { return current; }
	
	/* Find new party member */
	for (i=0; i<4; i++)
	{
		if (Party.current_delay[i] == 0)
		{
			if (!(Party.status[i] & (STATUS_DEAD | STATUS_UNCONCIOUS | STATUS_ASLEEP | STATUS_PARALYZED)))
			{
				return i;
			}
		}
	}
	
	return -1;
}
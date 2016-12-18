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
 
function Player()
{
	Actor.call(this);
	
	this.name = "Your Party";
	this.avatar = "@";
	this.die_num = 2;
	this.die_side = 4;
	this.die_bonus = 1;
}

Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;

Player.prototype.execute_melee_attack = function(target)
{
	if (Party.active_partymember == -1) { return false; }
	
	var i
	var damage = 0;
	var party_member = Party.active_partymember;
	var die_num = Party.die_num[party_member];
	var die_side = Party.die_side[party_member];
	var die_bonus = Party.die_bonus[party_member];
	var attacker = Party.name[party_member];
	var attack_type = DAM_PHYSICAL;
	
	for (i=0;i<die_num;i++)
		damage+=Math.round(Math.random()*(die_side-1)+1)+die_bonus;
	
	if (damage > 0)
	{
		target.last_hit = this;
		target.current_hp-=damage
		Hud.message.add_message(attacker + " hits the " + target.name + " for " + damage);
		if (target.current_hp < 1) { target.monster_die(); }
	}
	Party.current_delay[party_member] = Party.base_delay[party_member];
	Party.active_partymember = -1;
}

Player.prototype.update_tick = function()
{	
	Party.reduce_delay();	
	Party.active_partymember = Party.find_ready_party_member();
}
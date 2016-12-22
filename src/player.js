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
	if (Party.active_partymember === -1) { return false; }
	
	var i;
	var damage = 0;
	var party_member = Party.active_partymember;
	var die_num = Party.melee_die_num[party_member];
	var die_side = Party.melee_die_side[party_member];
	var die_bonus = Party.melee_die_bonus[party_member];
	var attacker = Party.name[party_member];
	var attack_type = DAM_PHYSICAL;
	
	for (i=0; i<die_num; i++) {
		damage += Math.round(Math.random()*(die_side-1)+1)+die_bonus;
	}
	
	if (damage > 0) { target.damage_actor(damage, this, attacker); }
	
	Party.current_delay[party_member] = Party.base_delay[party_member];
	Hud.partymember[party_member].dirty = true;
	Party.active_partymember = -1;
};

Player.prototype.execute_ranged_attack = function()
{
	if (Party.active_partymember === -1) { return false; }
	
	var i, shot;
	var damage = 0;
	var party_member = Party.active_partymember;
	var die_num = Party.ranged_die_num[party_member];
	var die_side = Party.ranged_die_side[party_member];
	var die_bonus = Party.ranged_die_bonus[party_member];
	var attacker = Party.name[party_member];
	var attack_type = DAM_PHYSICAL;
	
	for (i=0; i<die_num; i++) {
		damage += Math.round(Math.random()*(die_side-1)+1)+die_bonus;
	}
	
	shot = new Arrow(Player.map_x, Player.map_y, Math.point_direction(View.get_px(Player.map_x), View.get_py(Player.map_y), mouse_x, mouse_y))
	shot.from_player = true;
	shot.shooter = attacker;
	
	Party.current_delay[party_member] = Party.base_delay[party_member];
	Hud.partymember[party_member].dirty = true;
	Party.active_partymember = -1;
};

Player.prototype.execute_cast_attack = function()
{
	if (Party.active_partymember === -1) { return false; }
	
	var i, cost;
	var shot = 0;
	var damage = 0;
	
	var party_member = Party.active_partymember;
	var attacker = Party.name[party_member];
	
	var spell, i, shot, damage;
	
	/* Pull readied spell*/
	spell = Party.quick_spell[party_member];
	
	/* If no spell, skip turn */
	if (!spell) { return; }
	
	/* Check MP cost */
	cost = get_spell_cost(spell, this);
	
	if (Party.current_mp[party_member] >= cost) {
		
		/* Get damage of spell from this caster */
		damage = get_spell_damage(spell, this);
		
		/* Make spell projectile and apply stats */
		shot = get_spell_shot(spell, this);
		
		if (shot) {
			shot.shooter = this;
			shot.damage = damage;
			
			Party.current_mp[party_member] -= cost;
			Party.current_delay[party_member] = Party.base_delay[party_member];
			Hud.partymember[party_member].dirty = true;
			Party.active_partymember = -1;
		}
	}
};

Player.prototype.update_tick = function() 
{	
	Party.reduce_delay();
	Party.active_partymember = Party.find_ready_party_member();
};
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
 
/* Contains Player specific properties and methods. Derived from the ACTOR prototype
   Check ACTOR for most of the movement-related interactions */
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
Player.prototype.threats = [];

/* Melee attack */
Player.prototype.execute_melee_attack = function(target) 
{
	if (Party.active_partymember === -1) { return false; }
	
	var i;
	var damage = 0;
	var party_member = Party.active_partymember;
	var die_num = Party.member[party_member].melee_die_num;
	var die_side = Party.member[party_member].melee_die_side;
	var die_bonus = Party.member[party_member].melee_die_bonus;
	var attacker = Party.member[party_member].name;
	var attack_type = DAM_PHYSICAL;
	
	for (i=0; i<die_num; i++) {
		damage += Math.round(Math.random()*(die_side-1)+1)+die_bonus;
	}
	
	if (damage > 0) { target.damage_actor(damage, this, attacker); }
	
	Party.member[party_member].current_delay = Party.member[party_member].base_delay;
	Hud.partywidget[party_member].dirty = true;
	Party.active_partymember = -1;
};

/* Ranged attack (bows) */
Player.prototype.execute_ranged_attack = function(target = 0)
{
	/* If nobody in the party is active, there is no attack */
	if (Party.active_partymember === -1) { return false; }
	
	/* Shortened property references from the Party objects */
	var i, shot;
	var damage = 0;
	var party_member = Party.active_partymember;
	var die_num = Party.member[party_member].ranged_die_num;
	var die_side = Party.member[party_member].ranged_die_side;
	var die_bonus = Party.member[party_member].ranged_die_bonus;
	var attacker = Party.member[party_member].name;
	var attack_type = DAM_PHYSICAL;
	
	/* Makes the die calculation */
	for (i=0; i<die_num; i++) {
		damage += Math.round(Math.random()*(die_side-1)+1)+die_bonus;
	}
	
	if (target) {
		shot = new Arrow(Player.map_x, Player.map_y, Math.point_direction(View.get_pxc(Player.map_x), View.get_pyc(Player.map_y), View.get_pxc(target.map_x), View.get_pyc(target.map_y)));
	} else {
		shot = new Arrow(Player.map_x, Player.map_y, Math.point_direction(View.get_pxc(Player.map_x), View.get_pyc(Player.map_y), mouse_x, mouse_y));
	}
	shot.from_player = true;
	shot.shooter = attacker;
	
	Party.member[party_member].current_delay = Party.member[party_member].base_delay;
	Hud.partywidget[party_member].dirty = true;
	Party.active_partymember = -1;
};

/* Cast attack spells */
Player.prototype.execute_cast_attack = function(target = 0)
{
	/* If nobody in the party is active, there is no attack */
	if (Party.active_partymember === -1) { return false; }
	
	var i, cost;
	var shot = 0;
	var damage = 0;
	
	var party_member = Party.active_partymember;
	var attacker = Party.member[party_member].name;
	
	var spell, i, shot, damage;
	
	/* Pull readied spell*/
	spell = Party.member[party_member].quick_spell;
	
	/* If no spell, skip turn */
	if (!spell) { return; }
	
	/* Check MP cost */
	cost = get_spell_cost(spell, this);
	
	if (Party.member[party_member].current_mp >= cost) {
		
		/* Get damage of spell from this caster */
		damage = get_spell_damage(spell, this);
		
		/* Make spell projectile and apply stats */
		shot = get_spell_shot(spell, this, target);
		
		if (shot) {
			shot.from_player = true;
			shot.shooter = attacker;
			shot.damage = damage;
			
			Party.member[party_member].current_mp -= cost;
			Party.member[party_member].current_delay = Party.member[party_member].base_delay;
			Hud.partywidget[party_member].dirty = true;
			Party.active_partymember = -1;
		}
	}
};

/* Auto-attack decision maker (A-key)*/
Player.prototype.execute_auto_attack = function()
{
	/* If nobody in the party is active, there is no attack */
	if (Party.active_partymember === -1) { return false; }
	
	/* If there's no threats nearby then there is no auto attack */
	if (!Player.threats.length) { return; }
	
	var i;
	var closest_enemy;
	var closest_distance = 20;
	
	/* Cycle through threat list and find the closest */
	/* This list is populated when monsters move every turn in the ACTOR object */
	for (i=0; i<this.threats.length; i++){
		if (this.threats[i].player_distance <= closest_distance) {
			closest_enemy = this.threats[i];
			closest_distance = closest_enemy.player_distance;
		}
	}
	
	/* Monsters adjacent to the player get a Melee attack */
	if (closest_distance < 2) {
		this.execute_melee_attack(closest_enemy);
	} else { 
		/* Check the current spell */
		var current_spell = Party.member[Party.active_partymember].quick_spell;
		var current_cost = get_spell_cost(current_spell, this)
		var current_mp = Party.member[Party.active_partymember].current_mp;
		
		/* If there is a ready and castable spell - use it, otherwise bow */
		if (current_spell && current_cost <= current_mp) {
			this.execute_cast_attack(closest_enemy);
		} else {
			this.execute_ranged_attack(closest_enemy);
		}
	}
		
}

/* Run a few fixed turn checks
   This happens after the player turn, but before monster turn */
Player.prototype.update_tick = function() 
{	
	/* Update delay values */
	Party.reduce_delay();
	
	/* Update active partywidget */
	Party.active_partymember = Party.find_ready_party_member();
	
	/* Clear current threats */
	Player.threats = [];
};
/**
 * Project Jakutos
 *
 *  Copyright 2016 by MaiZure <maizure/|\member.fsf.org>
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

/* All of our monster-specific functions go here. This object is derived
 * From the ACTOR object */ 
function Monster(type, level, xx, yy) 
{
	Actor.call(this);
	
	/* Set monster world location as provided */
	this.map_x = xx;
	this.map_y = yy;
	
	/* If either input is invalid, then randomize monster position */
	if (xx === 0) { this.map_x = Math.round(Math.random()*(WORLD_SIZE_X-4))+2; }	
	if (yy === 0) { this.map_y = Math.round(Math.random()*(WORLD_SIZE_Y-4))+2; }
	
	/* match a second set of location variable so that intended location and 
	 * actual match on init */
	this.next_x = this.map_x;
	this.next_y = this.map_y;

	/* Update the screen view based on logical world location set above */
	this.update_pxpy();
	
	/* random difficulty level if it was provided directly */
	this.level = level == MLEVEL_RANDOM ? 
		level+=Math.round(Math.random()*2+1) : 
		level;
	
	/* Set monster world color */
	switch (this.level) {
		case MLEVEL_EASY: this.color = COL_MOB_EASY; break;
		case MLEVEL_MEDIUM: this.color = COL_MOB_MEDIUM; break;
		case MLEVEL_HARD: this.color = COL_MOB_HARD; break;
		case MLEVEL_UNIQUE: this.color = COL_MOB_UNIQUE; break;
	}	
	
	/* Default monster stats that should be overwritten by load_monster() */
	this.name = "NoName";
	this.avatar = "?";
	this.max_hp = 1; this.current_hp = this.max_hp;
	this.xp_reward = 0;
	this.gold_reward = 0;
	this.status = 0; /* flags variable */
	this.mode = AISTATE_WAIT;
	
	this.load_monster(this, type, level);
	
	/* Load actor in to the world grid */
	World.gridmob[this.map_y][this.map_x]=this;
}

/* Inheritance in JavaScript */
Monster.prototype = Object.create(Actor.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.is_active = function() 
{
	if (this.mode & AISTATE_WAIT) { return false; }
	if (this.status & STATUS_DEAD) { return false; }
	
	return true;
};

/* This is executed when a monster dies */
Monster.prototype.monster_die = function() 
{
	/* Sets status flag to include dead */
	this.status |= STATUS_DEAD;
	/* Removes the monster from the map */
	World.gridmob[this.map_y][this.map_x] = null;
	/* Adds the messge */
	Hud.message.add_message(this.name + " dies");
	
	/* Add expereince (eligibility is handled in the add_xp method) */
	if (this.last_hit == Player) {
		Party.add_xp(this.xp_reward);
	}
};

Monster.prototype.execute_melee_attack = function(target) 
{
	/* Right now, monsters will only attack the player */
	if (target != Player) { return false; }
	
	var i;
	var damage = 0;
	
	/* For each die, roll a random side and add it to the damage */
	damage = Math.roll_die(this.melee_die_num, this.melee_die_side, this.melee_die_bonus);
	
	/* If there is damage, apply it */
	if (damage > 0) {
		target.last_hit = this;
		Party.damage_party(this, damage, -1, DAM_PHYSICAL);
	}
};

Monster.prototype.execute_cast_attack = function()
{	
	var spell, i, shot, damage;
	
	/* Pull a spell from the book */
	spell = this.spell_book[Math.floor(Math.random()*this.spell_book.length)];
	
	/* If no spell, skip turn */
	if (!spell) { return; }
	
	/* Get damage of spell from this caster */
	damage = get_spell_damage(spell, this);
	
	/* Make spell projectile and apply stats */
	shot = get_spell_shot(spell, this, Player);
	shot.shooter = this;
	shot.damage = damage;
};

Monster.prototype.ai_action = function() 
{
	/* Find the distance to the player */
	this.update_player_distance();
	
	/* If the player is nearby (20 steps), chase the player */
	if (this.player_distance <= 20) { this.mode = AISTATE_CHASE; }
	
	/* if the monster isn't ready to move, skip turn */
	if (!this.is_active()) { return false; }
	if (this.stunned) { this.stunned--; return false; }
	
	/* If the monster is weak, then run */
	if (this.current_hp/this.max_hp < 0.25) { this.mode = AISTATE_FLEE; }
	
	/* Perform the appropriate move depending on the AI state */
	switch (this.mode) {
		case AISTATE_WANDER: this.ai_move_random(); break;
		case AISTATE_CHASE: this.ai_move_approach(); break;
		case AISTATE_FLEE: this.ai_move_run(); break;
	} 
	
	/* Do the actual move */
	this.execute_move();
};

/* Monsters move in random directions */
Monster.prototype.ai_move_random = function() 
{	
	/* Random movement in cardinal directions */
	switch (Math.floor(Math.random()*4)) {
		case 0: this.check_action(DIR_W); break;
		case 1: this.check_action(DIR_N); break;
		case 2: this.check_action(DIR_E); break;
		case 3: this.check_action(DIR_S); break;
	} 
};

/* Monsters generally move toward the player */
Monster.prototype.ai_move_approach = function() 
{	
	/* Create an array to hold candidate movements */
	var candidates = [DIR_NA];
	
	/* Add candidate movements based on player bearing */
	if (this.map_x < Player.map_x) { candidates.push(DIR_E, DIR_NE, DIR_SE); }
	if (this.map_x > Player.map_x) { candidates.push(DIR_W, DIR_NW, DIR_SW); }	
	if (this.map_y < Player.map_y) { candidates.push(DIR_S, DIR_SE, DIR_SW); }
	if (this.map_y > Player.map_y) { candidates.push(DIR_N, DIR_NW, DIR_NE); }
	
	/* Pick a random direction from the candidates */
	var action = Math.floor(Math.random()*candidates.length);
	
	/* Check the validity of the action */
	this.check_action(candidates[action]);
	
	/* Sometimes the monster will ranged attack rather than move */
	if (action === DIR_NA && Math.random() < 0.5) { 
		this.execute_cast_attack(); 
	}
	
	/* Not sure if this helps the garbage collector in JavaScript or not */
	candidates = null;
};

/* Monsters generally move away from the player */
Monster.prototype.ai_move_run = function() 
{
	/* Create an array to hold candidate movements */
	var candidates = [DIR_NA];
	
	/* Add candidate movements based on player bearing */
	if (this.map_x < Player.map_x) { candidates.push(DIR_W, DIR_NW, DIR_SW); }
	if (this.map_x > Player.map_x) { candidates.push(DIR_E, DIR_NE, DIR_SE); }	
	if (this.map_y < Player.map_y) { candidates.push(DIR_N, DIR_NE, DIR_NW); }
	if (this.map_y > Player.map_y) { candidates.push(DIR_S, DIR_SW, DIR_SE); }
	
	/* Pick a random direction from the candidates */
	var action = Math.floor(Math.random()*candidates.length);
	
	/* Check the validity of the action */
	this.check_action(candidates[action]);
	
	/* This might help the garbage collector */
	candidates = null;
};

/* load_monster contains all the monster data and allows for polymorphism 
 * Wach monster type defines three levels of difficulty.
 * Eventually this should be moved in to a more compact form */
Monster.prototype.load_monster = function(m, type, level) 
{
	/* Pull basic stats from data in monster_data.js */
	m.name             = this.data[monster_index(type, level, MSTAT_NAME)];
	m.avatar           = this.data[monster_index(type, level, MSTAT_AVATAR)];
	m.xp_reward        = this.data[monster_index(type, level, MSTAT_XP)];
	m.max_hp           = this.data[monster_index(type, level, MSTAT_MAX_HP)];
	m.melee_die_num    = this.data[monster_index(type, level, MSTAT_MELEE_DIE_NUM)];
	m.melee_die_side   = this.data[monster_index(type, level, MSTAT_MELEE_DIE_SIDE)];
	m.melee_die_bonus  = this.data[monster_index(type, level, MSTAT_MELEE_DIE_BONUS)];
	m.skill_fire_magic = this.data[monster_index(type, level, MSTAT_SKILL_FIRE)];
	m.skill_mind_magic = this.data[monster_index(type, level, MSTAT_SKILL_MIND)];
	
	/* If the monster has a spell - push it to the spell book */
	if (this.data[monster_index(type, level, MSTAT_SPELL)])
		m.spell_book.push(this.data[monster_index(type, level, MSTAT_SPELL)]);
	
	/* Match hitpoints to the polymorphed maximum stat */
	m.current_hp = m.max_hp;
};

/* Monster data array populated in monster_data.js */
Monster.prototype.data = new Array(4500);
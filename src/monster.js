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
 
function Monster(type, level, xx, yy)
{
	Actor.call(this);
	
	/* Set monster world location */
	if (xx == 0) { this.map_x = Math.round(Math.random()*(WORLD_SIZE_X-4))+2; } else { this.map_x = xx;}
	if (yy == 0) { this.map_y = Math.round(Math.random()*(WORLD_SIZE_Y-4))+2; } else { this.map_y = yy;}
	this.next_x = this.map_x;
	this.next_y = this.map_y;
	this.level = level == MLEVEL_RANDOM ? level+=Math.round(Math.random()*2+1) : level;
	
	/* Set monster world color */
	switch (this.level)
	{
		case MLEVEL_EASY: this.color = COL_MOB_EASY; break;
		case MLEVEL_MEDIUM: this.color = COL_MOB_MEDIUM; break;
		case MLEVEL_HARD: this.color = COL_MOB_HARD; break;
		case MLEVEL_UNIQUE: this.color = COL_MOB_UNIQUE; break;
	}	
	
	/* Monster Stats */
	this.name = "NoName";
	this.avatar = "?";
	this.max_hp = 1; this.current_hp = this.max_hp;
	this.xp_reward = 0;
	this.gold_reward = 0;
	this.status = 0; /* flags variable */
	this.mode = 0
	
	this.load_monster(this, type, level);
	
	/* Load actor in to the logic grid */
	World.gridmob[this.map_y][this.map_x]=this;
	
}

Monster.prototype = Object.create(Actor.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.ai_move = function() 
{
	if (!this.is_active()) { return false; }
	
	switch (Math.floor(Math.random()*4))
	{
		case 0: this.check_action(DIR_W); break;
		case 1: this.check_action(DIR_N); break;
		case 2: this.check_action(DIR_E); break;
		case 3: this.check_action(DIR_S); break;
	} 
	
	this.execute_move();
}

Monster.prototype.load_monster = function(m, type, level)
{
	switch (type)
	{
		case MTYPE_GOBLIN:
		{
			switch(level)
			{
				case MLEVEL_EASY: 
				{
					m.name = "Goblin";
					m.max_hp = 13;
					m.avatar = "g";
					m.die_num = 1; m.die_side = 9; m.die_bonus = 0;
					m.xp_reward = 56;
				} break;
				case MLEVEL_MEDIUM: 
				{
					m.name = "Goblin Shaman"; 
					m.max_hp = 21; 
					m.avatar = "g"; 
					m.die_num = 1; m.die_side = 9; m.die_bonus = 2;
					m.xp_reward = 96;
				} break;
				case MLEVEL_HARD: 
				{
					m.name = "Goblin King"; 
					m.max_hp = 40; 
					m.avatar = "g"; 
					m.die_num = 1; m.die_side = 9; m.die_bonus = 4;
					m.xp_reward = 200;
				} break;
			}
		} break;
	}
	
	m.current_hp = m.max_hp;
}

Monster.prototype.is_active = function()
{
	if (this.status & STATUS_DEAD) { return false; }
	
	return true;
}

Monster.prototype.monster_die = function()
{
	this.status |= STATUS_DEAD;
	World.gridmob[this.map_y][this.map_x] = null;
	Hud.message.add_message(this.name + " dies");
	
	if (this.last_hit == Player)
	{
		Party.add_xp(this.xp_reward);
	}
}

Monster.prototype.execute_melee_attack = function(target)
{
	/* Right now, monsters will only attack the player */
	if (target != Player) { return false; }
	
	var i
	var damage = 0;
	for (i=0; i<this.die_num; i++)
		damage+=Math.round(Math.random()*(this.die_side-1)+1)+this.die_bonus;
	
	if (damage > 0)
	{
		target.last_hit = this;
		Party.damage_party(this, damage, DAM_PHYSICAL);
	}
}
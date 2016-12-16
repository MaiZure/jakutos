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
 
function Monster(type, level, xx, yy)
{
	Actor.call(this);
	
	/* Set monster world location */
	if (xx == 0) { this.map_x = Math.round(Math.random()*WORLD_SIZE_X-4)+2; } else { this.map_x = xx;}
	if (yy == 0) { this.map_y = Math.round(Math.random()*WORLD_SIZE_Y-4)+2; } else { this.map_y = yy;}
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
	
	this.load_monster(this, type, level);
	
}

Monster.prototype = Object.create(Actor.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.ai_move = function() 
{
	switch (Math.floor(Math.random()*4))
	{
		case 0: this.move_left(); break;
		case 1: this.move_up(); break;
		case 2: this.move_right(); break;
		case 3: this.move_down(); break;
	}
}

Monster.prototype.load_monster = function(m, type, level)
{
	switch (type)
	{
		case MTYPE_GOBLIN:
		{
			switch(level)
			{
				case MLEVEL_EASY: m.name = "Goblin"; m.max_hp = 13; m.avatar = "g"; break;
				case MLEVEL_MEDIUM: m.name = "Goblin Shaman"; m.max_hp = 21; m.avatar = "g"; break;
				case MLEVEL_HARD: m.name = "Goblin King"; m.max_hp = 40; m.avatar = "g"; break;
			}
		} break;
	}
	
	m.current_hp = m.max_hp;
}
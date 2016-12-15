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
	
	this.avatar = "g";
	
	if (xx == 0) { this.map_x = Math.round(Math.random()*WORLD_SIZE_X-4)+2; } else { this.map_x = xx;}
	if (yy == 0) { this.map_y = Math.round(Math.random()*WORLD_SIZE_Y-4)+2; } else { this.map_y = yy;}
	this.next_x = this.map_x;
	this.next_y = this.map_y;
	
	this.level = level == MLEVEL_RANDOM ? level+=Math.round(Math.random()*2+1) : level;
	
	switch (this.level)
	{
		case MLEVEL_EASY: this.color = "rgb(128,224,128)"; break;
		case MLEVEL_MEDIUM: this.color = "rgb(128,128,224)"; break;
		case MLEVEL_HARD: this.color = "rgb(224,128,128)"; break;
		case MLEVEL_UNIQUE: this.color = "rgb(224,224,0)"; break;
	}
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
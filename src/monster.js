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
 
function Monster()
{
	Actor.call(this);
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
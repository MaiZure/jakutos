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
	this.job[0] = CLASS_KNIGHT;
	this.job[1] = CLASS_PALADIN;
	this.job[2] = CLASS_CLERIC;
	this.job[3] = CLASS_SORCERER;
	
	this.max_hp[0] = 30; this.current_hp[0]=this.max_hp[0];
	this.max_hp[1] = 25; this.current_hp[1]=this.max_hp[1];
	this.max_hp[2] = 15; this.current_hp[2]=this.max_hp[2];
	this.max_hp[3] = 12; this.current_hp[3]=this.max_hp[3];
	
	this.max_mp[0] = 0; this.current_mp[0]=this.max_mp[0];
	this.max_mp[1] = 6; this.current_mp[1]=this.max_mp[1];
	this.max_mp[2] = 12; this.current_mp[2]=this.max_mp[2];
	this.max_mp[3] = 15; this.current_mp[3]=this.max_mp[3];
}

Party.prototype.job = [];
Party.prototype.max_hp = [];
Party.prototype.max_mp = [];
Party.prototype.current_hp = [];
Party.prototype.current_mp = [];
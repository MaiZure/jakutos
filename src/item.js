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
 
function Item()
{
	this.name = "Test Cloak"
	this.wearable = WEAR_CLOAK
	
	this.stat_modifier = [];
	this.skill_modifier = [];
	this.resist_modifier = [];
	this.armor = 0;
	
	this.add_item_stat_modifier(STAT_SPEED, 3);
	
}

Item.prototype.add_item_stat_modifier = function(modifier, amount) {
	this.stat_modifier.push([modifier,amount]);
}

Item.prototype.add_item_skill_modifier = function(modifier, amount) {
	this.stat_skill.push([modifier,amount]);
}

Item.prototype.add_item_resist_modifier = function(modifier, amount) {
	this.stat_resist.push([modifier,amount]);
}
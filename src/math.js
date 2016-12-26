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
 
/* Adding various functions to the built in Math object as I need them */
function add_math_utilities()
{
	/* Degrees to radians */
	Math.deg_to_rad = function(degrees) {
		return degrees * Math.PI / 180;
	};
	
	/* Radians to degrees */
	Math.rad_to_deg = function(radians) {
		return radians * 180 / Math.PI;
	};
	
	/* dot product of two 2D position vectors */
	Math.dot = function(x1, y1, x2, y2) {
		return x1*x2+y1*y2;
	};
	
	/* 2D vector length 
	arity of 2 assumes position vector
	arity of 4 assumes arbitrary vector (start, end)*/
	Math.vlength = function(x1, y1, x2=0, y2=0) {
		return Math.sqrt( Math.pow(x2-x1,2) + Math.pow(y2-y1,2) );
	};
	
	/* angle between two position vectors in degrees */
	Math.vangle = function (x1, y1, x2, y2) {
		return Math.acos(Math.dot(x1, y1, x2, y2)/(Math.vlength(x1,y1) * Math.vlength(x2, y2)));
	};
	
	/* Direction from point 1 to point 2 (Like vector angle except (x1, y1) is translated to origin) */
	Math.point_direction = function (x1, y1, x2, y2) {
		var arctan = Math.atan2((y2-y1),(x2-x1));
		return Math.rad_to_deg(-arctan);
	};
	
	/* Rolls a die taking the two classic die values plus a fixed bonus */
	Math.roll_die = function(number, side, bonus) {
		var i;
		var damage = 0;
		for (i=0; i<number; i++) { damage += Math.round(Math.random()*(side-1)+1); }
		damage += bonus;
		return damage;
	}
}
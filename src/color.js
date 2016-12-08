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
 
function random_grass_color()
{
	var r,g,b;
	r = Math.round(Math.random()*40)+0;
	g = Math.round(Math.random()*100)+100;
	b = Math.round(Math.random()*40)+20;
	return "rgb("+r+","+g+","+b+")";
}

function random_dirt_color()
{
	var r,g,b;
	r = Math.round(Math.random()*40)+150;
	g = Math.round(Math.random()*40)+80;
	b = Math.round(Math.random()*40)+20;
	return "rgb("+r+","+g+","+b+")";
}

function random_mountain_color()
{
	var r,g,b;
	r = Math.round(Math.random()*30)+160;
	g = Math.round(Math.random()*10)+r;
	b = Math.round(Math.random()*60)+170;
	return "rgb("+r+","+g+","+b+")";
}
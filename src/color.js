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

const COL_MAP_BUILDING = 'rgb(200,180,100)';
const COL_MAP_WATER = 'rgb(100,100,175)';
const COL_MAP_DIRT = 'rgb(170,100,50)';
const COL_MAP_GRASS = 'rgb(20,150,50)';
const COL_MAP_HILL = 'rgb(160,180,160)';
const COL_MAP_LOW_MOUNTAIN = 'rgb(175,185,195)';
const COL_MAP_HIGH_MOUNTAIN = 'rgb(185,195,200)';
const COL_MOB_EASY = "rgb(128,240,128)";
const COL_MOB_MEDIUM = "rgb(128,128,240)";
const COL_MOB_HARD = "rgb(240,128,128)";
const COL_MOB_UNIQUE = "rgb(240,240,128)";
const COL_ARROW = "rgb(245,222,179)";
const COL_FLAME_ARROW = "rgb(240,96,32)";
const COL_SPIRIT_ARROW = "rgb(32,240,32)";
const COL_MIND_BLAST = "rgb(240,160,32)";
 
function random_grass_color()
{
	var r,g,b;
	r = Math.round(Math.random()*40)+0;
	g = Math.round(Math.random()*100)+100;
	b = Math.round(Math.random()*40)+20;
	return "rgb("+r+","+g+","+b+")";
}

function random_water_color()
{
	var r,g,b;
	r = Math.round(Math.random()*20)+90;
	g = Math.round(Math.random()*20)+90;
	b = Math.round(Math.random()*50)+150;
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

function height_to_color(height)
{
	var r,g,b;
	if (height == 0) return COL_MAP_WATER
	if (height == 1) return COL_MAP_DIRT
	else
	{
		r = Math.min(height*10,175);
		g = Math.min(100+Math.round(height*5),185);
		b = Math.min(20+Math.round(height*10),195);
	}
	return "rgb("+r+","+g+","+b+")";
}

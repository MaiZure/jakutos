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

/* Everything here is global. There may be some value to moving the functions
 * to a separate namespace if this grows too large */
 
/* RGB color constants that we'll use throughout the game */
const COL_MAP_BUILDING = 'rgb(170,150,70)';
const COL_MAP_DOOR = 'rgb(220,220,120)';
const COL_MAP_STAIRS = 'rgb(220,60,60)';
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
 
/* Just to be interesting, we'll randomize some of the colors */
function random_grass_color()
{
	var r,g,b;
	r = Math.round(Math.random()*20)+10;
	g = Math.round(Math.random()*50)+125;
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
	g = Math.round(Math.random()*20)+90;
	b = Math.round(Math.random()*20)+40;
	return "rgb("+r+","+g+","+b+")";
}

function random_mountain_color()
{
	var r,g,b;
	r = Math.round(Math.random()*30)+160;
	g = Math.round(Math.random()*10)+r;
	b = Math.round(Math.random()*30)+170;
	return "rgb("+r+","+g+","+b+")";
}
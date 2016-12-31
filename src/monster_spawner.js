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

/* An invisible point in the world that monsters spawn around */
function Monsterspawner(xx, yy, type, easy = 50, medium = 40, hard = 10) {
	/* The type of monster the spawner creates */
	this.type = type;
	
	/* The probability distribution between easy/medium/hard spawns */
	this.easy_dist = easy;
	this.medium_dist = medium;
	this.hard_dist = hard;
	
	this.map_x = xx;
	this.map_y = yy;
}

/* Spawns a set of monsters around the spawn point */
Monsterspawner.prototype.spawn_monsters = function() {
	var i, level, random, xrand, yrand;
	/* Choose 5 random points around spawn
	 * Points are random and not discinct - usually only 3,4 will spawn */
	for (i=0; i<5; i++) {
		/* Roll a die between 1 and 100 */
		random = Math.round(Math.random()*100);
		/* Assume we we're creating the highest level monster */
		level = MLEVEL_HARD;
		/* count down the probability ladder with our random roll */
		if (random <= this.easy_dist + this.medium_dist) { level = MLEVEL_MEDIUM; }
		if (random <= this.easy_dist) { level = MLEVEL_EASY; }
		/* Choose spots around the spawner */
		xrand = Math.round(Math.random()*2)-1;
		yrand = Math.round(Math.random()*2)-1
		/* Spawn the monster */;
		this.spawn_single_monster(this.type, level, this.map_x + xrand, this.map_y + yrand);
	}
};

/* Spawns a single monster */
Monsterspawner.prototype.spawn_single_monster = function(type, level, xx, yy) {
	/* Exclude invalid spaces and spaces that monsters already exist */
	if (World.gridheight[yy][xx] < 1) { return false; }
	if (World.gridmob[yy][xx]) { return false; }
	var monster = new Monster(type, level, xx, yy);
	Monsters.push(monster);
	return true;
};
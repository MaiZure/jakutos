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
 
/* All the monster data you never wanted is in this file */

/* Calculate array position of contants */
monster_index = function(type, level, stat) {
	return (type*80)+(level*20)+stat;
};

/* Variables to alias the array population below - Beware this pollutes
 * the global namespace (REFACTOR MORE) */
var monster_data = Monster.prototype.data;

/* GOBLINS */
var type = MTYPE_GOBLIN; 
var level = MLEVEL_EASY;
monster_data[ monster_index(type, level, MSTAT_NAME) ]            = "Goblin";
monster_data[ monster_index(type, level, MSTAT_AVATAR) ]          = "g";
monster_data[ monster_index(type, level, MSTAT_XP) ]              = 56;
monster_data[ monster_index(type, level, MSTAT_MAX_HP) ]          = 13;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_NUM) ]   = 1;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_SIDE) ]  = 9;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_BONUS) ] = 0;
var level = MLEVEL_MEDIUM;
monster_data[ monster_index(type, level, MSTAT_NAME) ]            = "Goblin Shamen";
monster_data[ monster_index(type, level, MSTAT_AVATAR) ]          = "g";
monster_data[ monster_index(type, level, MSTAT_XP) ]              = 96;
monster_data[ monster_index(type, level, MSTAT_MAX_HP) ]          = 21;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_NUM) ]   = 1;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_SIDE) ]  = 9;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_BONUS) ] = 2;
monster_data[ monster_index(type, level, MSTAT_SPELL) ]           = SPELL_FLAME_ARROW;
monster_data[ monster_index(type, level, MSTAT_SKILL_FIRE) ]      = 1;
var level = MLEVEL_HARD;
monster_data[ monster_index(type, level, MSTAT_NAME) ]            = "Goblin King";
monster_data[ monster_index(type, level, MSTAT_AVATAR) ]          = "g";
monster_data[ monster_index(type, level, MSTAT_XP) ]              = 200;
monster_data[ monster_index(type, level, MSTAT_MAX_HP) ]          = 40;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_NUM) ]   = 1;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_SIDE) ]  = 9;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_BONUS) ] = 4;
monster_data[ monster_index(type, level, MSTAT_SPELL) ]           = SPELL_FLAME_ARROW;
monster_data[ monster_index(type, level, MSTAT_SKILL_FIRE) ]      = 2;

/* MAGES */
var type = MTYPE_MAGE; 
var level = MLEVEL_EASY;
monster_data[ monster_index(type, level, MSTAT_NAME) ]            = "Apprentice Mage";
monster_data[ monster_index(type, level, MSTAT_AVATAR) ]          = "m";
monster_data[ monster_index(type, level, MSTAT_XP) ]              = 24;
monster_data[ monster_index(type, level, MSTAT_MAX_HP) ]          = 6;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_NUM) ]   = 2;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_SIDE) ]  = 4;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_BONUS) ] = 0;
monster_data[ monster_index(type, level, MSTAT_SPELL) ]           = SPELL_FLAME_ARROW;
monster_data[ monster_index(type, level, MSTAT_SKILL_FIRE) ]      = 1;
var level = MLEVEL_MEDIUM;
monster_data[ monster_index(type, level, MSTAT_NAME) ]            = "Journeyman Mage";
monster_data[ monster_index(type, level, MSTAT_AVATAR) ]          = "m";
monster_data[ monster_index(type, level, MSTAT_XP) ]              = 96;
monster_data[ monster_index(type, level, MSTAT_MAX_HP) ]          = 21;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_NUM) ]   = 2;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_SIDE) ]  = 4;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_BONUS) ] = 2;
monster_data[ monster_index(type, level, MSTAT_SPELL) ]           = SPELL_FLAME_ARROW; //Cold Beam
monster_data[ monster_index(type, level, MSTAT_SKILL_FIRE) ]      = 2;
var level = MLEVEL_HARD;
monster_data[ monster_index(type, level, MSTAT_NAME) ]            = "Mage";
monster_data[ monster_index(type, level, MSTAT_AVATAR) ]          = "m";
monster_data[ monster_index(type, level, MSTAT_XP) ]              = 200;
monster_data[ monster_index(type, level, MSTAT_MAX_HP) ]          = 40;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_NUM) ]   = 2;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_SIDE) ]  = 4;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_BONUS) ] = 6;
monster_data[ monster_index(type, level, MSTAT_SPELL) ]           = SPELL_FLAME_ARROW; //Lightening Bolt
monster_data[ monster_index(type, level, MSTAT_SKILL_FIRE) ]      = 3;

/* BAA FOLLOWERS*/
var type = MTYPE_BAA; 
var level = MLEVEL_EASY;
monster_data[ monster_index(type, level, MSTAT_NAME) ]            = "Follower of Baa";
monster_data[ monster_index(type, level, MSTAT_AVATAR) ]          = "b";
monster_data[ monster_index(type, level, MSTAT_XP) ]              = 39;
monster_data[ monster_index(type, level, MSTAT_MAX_HP) ]          = 9;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_NUM) ]   = 2;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_SIDE) ]  = 4;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_BONUS) ] = 0;
monster_data[ monster_index(type, level, MSTAT_SPELL) ]           = SPELL_FLAME_ARROW;
var level = MLEVEL_MEDIUM;
monster_data[ monster_index(type, level, MSTAT_NAME) ]            = "Mystic of Baa";
monster_data[ monster_index(type, level, MSTAT_AVATAR) ]          = "b";
monster_data[ monster_index(type, level, MSTAT_XP) ]              = 75;
monster_data[ monster_index(type, level, MSTAT_MAX_HP) ]          = 17;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_NUM) ]   = 2;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_SIDE) ]  = 4;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_BONUS) ] = 2;
monster_data[ monster_index(type, level, MSTAT_SPELL) ]           = SPELL_MIND_BLAST;
monster_data[ monster_index(type, level, MSTAT_SKILL_MIND) ]      = 1;
var level = MLEVEL_HARD;
monster_data[ monster_index(type, level, MSTAT_NAME) ]            = "Fanatic of Baa";
monster_data[ monster_index(type, level, MSTAT_AVATAR) ]          = "m";
monster_data[ monster_index(type, level, MSTAT_XP) ]              = 119;
monster_data[ monster_index(type, level, MSTAT_MAX_HP) ]          = 25;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_NUM) ]   = 2;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_SIDE) ]  = 4;
monster_data[ monster_index(type, level, MSTAT_MELEE_DIE_BONUS) ] = 4;
monster_data[ monster_index(type, level, MSTAT_SPELL) ]           = 0;
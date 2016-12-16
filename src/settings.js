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
 
 /* Game Constants */
const WORLD_SIZE_X = 252*5;
const WORLD_SIZE_Y = 252*3;
const BASE_FONT_SIZE = 24;
const VERSION_MAJOR = 0;
const VERSION_MINOR = 1;

/* Game Settings */
var SETTING_ANIMATE = false;
var NUMBER_OF_MONSTERS = 500;
var ANIMATION_STEPS = 2; /* 1 = slow, 2 = medium, 4 = fast */
var FG_COLOR = "rgb(170,170,170)"
var GRASSLAND = Math.round(Math.random());

/* ENUM TYPES (sort of)*/
/* classes */ 
var CLASS_KNIGHT = 1 << 0;
var CLASS_PALADIN = 1 << 1;
var CLASS_ARCHER = 1 << 2;
var CLASS_DRUID = 1 << 3;
var CLASS_CLERIC = 1 << 4;
var CLASS_SORCERER = 1 << 5;

/* status effects */
var STATUS_CURSED = 1 << 0;
var STATUS_WEAK = 1 << 1;
var STATUS_AFRAID = 1 << 2;
var STATUS_DRUNK = 1 << 3;
var STATUS_INSANE = 1 << 4;
var STATUS_POISONED = 1 << 5;
var STATUS_DISEASED = 1 << 6;
var STATUS_ASLEEP = 1 << 7;
var STATUS_PARALYZED = 1 << 8;
var STATUS_UNCONCIOUS = 1 << 9;
var STATUS_STONED = 1 << 10;
var STATUS_ZOMBIE = 1 << 11;
var STATUS_DEAD = 1 << 12;
var STATUS_ERADICATED = 1 << 13;

/* Monster Levels */
var MLEVEL_RANDOM = 0;
var MLEVEL_EASY = 1;
var MLEVEL_MEDIUM = 2;
var MLEVEL_HARD = 3;
var MLEVEL_UNIQUE = 4;

/* Monster Types */
var MTYPE_ARCHER = 1;
var MTYPE_BARBARIAN = 2;
var MTYPE_BAT = 3;
var MTYPE_BEHOLDER = 4;
var MTYPE_BLOODSUCKER = 5;
var MTYPE_CLERIC = 6;
var MTYPE_COBRA = 7;
var MTYPE_COCKATRICE = 8;
var MTYPE_DEMONFLY = 9;
var MTYPE_DEMON = 10;
var MTYPE_DRAGONCAVE = 11;
var MTYPE_DRAGONFLY = 12;
var MTYPE_DRAGONLAND = 13;
var MTYPE_DRAGONCOVER = 14;
var MTYPE_DRUIDESS = 15;
var MTYPE_DWARF = 16;
var MTYPE_ELEMAIR = 17;
var MTYPE_ELEMEARTH = 18;
var MTYPE_ELEMFIRE = 19;
var MTYPE_ELEMWATER = 20;
var MTYPE_FIGHTERCHAIN = 21;
var MTYPE_FIGHTERLEATHER = 22;
var MTYPE_GARGOYLE = 23;
var MTYPE_GENIE = 24;
var MTYPE_GHOST = 25;
var MTYPE_GOBLIN = 26;
var MTYPE_GUARD = 27;
var MTYPE_HARPY = 28;
var MTYPE_HYDRA = 29;
var MTYPE_JACKALMAN = 30;
var MTYPE_KNIGHTPLATE = 31;
var MTYPE_LICH = 32;
var MTYPE_LIZARDARCH = 33;
var MTYPE_MAGE = 34;
var MTYPE_MEDUSA = 35;
var MTYPE_MERCHANT = 36;
var MTYPE_MINOTAUR = 37;
var MTYPE_MONK = 38;
var MTYPE_NOBLEMAN = 39;
var MTYPE_OOZE = 40;
var MTYPE_OGRE = 41;
var MTYPE_RAT = 42;
var MTYPE_ROBOT = 43;
var MTYPE_SEASERPENT = 44;
var MTYPE_SKELETON = 45;
var MTYPE_SORCERER = 46;
var MTYPE_SPIDER = 47;
var MTYPE_THIEF = 48;
var MTYPE_TITAN = 49;
var MTYPE_WEREWOLF = 50;
var MTYPE_DEMONQUEEN = 51;
var MTYPE_REACTOR = 52;
var MTYPE_BAA = 53;

/* Monster AI */
var AISTATE_WAITING = 0;
var AISTATE_CHASING = 1;
var AISTATE_RUNNING = 2;
var AISTATE_DEAD = 3;


/* Keyboard Codes */
const KB_LEFT = 37;
const KB_UP = 38;
const KB_RIGHT = 39;
const KB_DOWN = 40;
const KB_A = 65;
const KB_C = 67;
const KB_M = 77;
const KB_MINUS = 189;
const KB_PLUS = 187;
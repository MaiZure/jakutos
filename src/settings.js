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
const SETTING_ANIMATE = false;
const NUMBER_OF_MONSTERS = 500;
const ANIMATION_STEPS = 2; /* 1 = slow, 2 = medium, 4 = fast */
const FG_COLOR = "rgb(170,170,170)"
const GRASSLAND = Math.round(Math.random());

/* ENUM TYPES (sort of)*/
/* classes */ 
const CLASS_KNIGHT = 1 << 0;
const CLASS_PALADIN = 1 << 1;
const CLASS_ARCHER = 1 << 2;
const CLASS_DRUID = 1 << 3;
const CLASS_CLERIC = 1 << 4;
const CLASS_SORCERER = 1 << 5;

/* status effects */
const STATUS_CURSED = 1 << 0;
const STATUS_WEAK = 1 << 1;
const STATUS_AFRAID = 1 << 2;
const STATUS_DRUNK = 1 << 3;
const STATUS_INSANE = 1 << 4;
const STATUS_POISONED = 1 << 5;
const STATUS_DISEASED = 1 << 6;
const STATUS_ASLEEP = 1 << 7;
const STATUS_PARALYZED = 1 << 8;
const STATUS_UNCONCIOUS = 1 << 9;
const STATUS_STONED = 1 << 10;
const STATUS_ZOMBIE = 1 << 11;
const STATUS_DEAD = 1 << 12;
const STATUS_ERADICATED = 1 << 13;

/* Monster Levels */
const MLEVEL_RANDOM = 0;
const MLEVEL_EASY = 1;
const MLEVEL_MEDIUM = 2;
const MLEVEL_HARD = 3;
const MLEVEL_UNIQUE = 4;

/* Monster Types */
const MTYPE_ARCHER = 1;
const MTYPE_BARBARIAN = 2;
const MTYPE_BAT = 3;
const MTYPE_BEHOLDER = 4;
const MTYPE_BLOODSUCKER = 5;
const MTYPE_CLERIC = 6;
const MTYPE_COBRA = 7;
const MTYPE_COCKATRICE = 8;
const MTYPE_DEMONFLY = 9;
const MTYPE_DEMON = 10;
const MTYPE_DRAGONCAVE = 11;
const MTYPE_DRAGONFLY = 12;
const MTYPE_DRAGONLAND = 13;
const MTYPE_DRAGONCOVER = 14;
const MTYPE_DRUIDESS = 15;
const MTYPE_DWARF = 16;
const MTYPE_ELEMAIR = 17;
const MTYPE_ELEMEARTH = 18;
const MTYPE_ELEMFIRE = 19;
const MTYPE_ELEMWATER = 20;
const MTYPE_FIGHTERCHAIN = 21;
const MTYPE_FIGHTERLEATHER = 22;
const MTYPE_GARGOYLE = 23;
const MTYPE_GENIE = 24;
const MTYPE_GHOST = 25;
const MTYPE_GOBLIN = 26;
const MTYPE_GUARD = 27;
const MTYPE_HARPY = 28;
const MTYPE_HYDRA = 29;
const MTYPE_JACKALMAN = 30;
const MTYPE_KNIGHTPLATE = 31;
const MTYPE_LICH = 32;
const MTYPE_LIZARDARCH = 33;
const MTYPE_MAGE = 34;
const MTYPE_MEDUSA = 35;
const MTYPE_MERCHANT = 36;
const MTYPE_MINOTAUR = 37;
const MTYPE_MONK = 38;
const MTYPE_NOBLEMAN = 39;
const MTYPE_OOZE = 40;
const MTYPE_OGRE = 41;
const MTYPE_RAT = 42;
const MTYPE_ROBOT = 43;
const MTYPE_SEASERPENT = 44;
const MTYPE_SKELETON = 45;
const MTYPE_SORCERER = 46;
const MTYPE_SPIDER = 47;
const MTYPE_THIEF = 48;
const MTYPE_TITAN = 49;
const MTYPE_WEREWOLF = 50;
const MTYPE_DEMONQUEEN = 51;
const MTYPE_REACTOR = 52;
const MTYPE_BAA = 53;

/* Monster AI */
const AISTATE_WAIT = 0;
const AISTATE_CHASE = 1;
const AISTATE_FLEE = 2;

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

/* Direction Enum */
const DIR_N = 1;
const DIR_NE = 2;
const DIR_E = 3;
const DIR_SE = 4;
const DIR_S = 5;
const DIR_SW = 6;
const DIR_W = 7;
const DIR_NW = 8;
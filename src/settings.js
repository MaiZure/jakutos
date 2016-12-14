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
const BASE_FONT_SIZE = "24px";
const VERSION_MAJOR = 0;
const VERSION_MINOR = 1;

/* Game Settings */
var SETTING_ANIMATE = false;
var NUMBER_OF_MONSTERS = 100;
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
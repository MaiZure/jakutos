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
const WORLD_SIZE_X = 100;
const WORLD_SIZE_Y = 100;
const BASE_FONT_SIZE = "32px";
const VERSION_MAJOR = 0;
const VERSION_MINOR = 1;

/* Game Settings */
var SETTING_ANIMATE = true;
var NUMBER_OF_MONSTERS = 16;
var ANIMATION_STEPS = 4; /* 1 = slow, 2 = medium, 4 = fast */
var GRID_SIZE = 32;
var FONT_SIZE = GRID_SIZE+"px";
var VIEW_PIXEL_WIDTH = 768;
var VIEW_PIXEL_HEIGHT = 576;
var VIEW_GRID_WIDTH = VIEW_PIXEL_WIDTH/GRID_SIZE;
var VIEW_GRID_HEIGHT = VIEW_PIXEL_HEIGHT/GRID_SIZE;
var VIEW_GRID_X = 0;
var VIEW_GRID_Y = 0;
var FG_COLOR = "rgb(170,170,170)"
var GRASSLAND = Math.round(Math.random());

/* Keyboard Codes */
const KB_LEFT = 37;
const KB_UP = 38;
const KB_RIGHT = 39;
const KB_DOWN = 40;
const KB_A = 65;
const KB_C = 67;
const KB_MINUS = 189;
const KB_PLUS = 187;
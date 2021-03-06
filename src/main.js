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

/* Kick off the game when the window loads 
 * Other events are added after init */
window.addEventListener("load", gameInit, false);
 
/* Grab DOM objects */
base_canvas = document.getElementById("Base");
animation_canvas = document.getElementById("Animation");
overlay_canvas = document.getElementById("Overlay");

/* Make global access for basic drawing */
base_context = base_canvas.getContext("2d");
animation_context = animation_canvas.getContext("2d");
overlay_context = overlay_canvas.getContext("2d");

/* Sizes the drawing canvas - function located in view.js */
set_canvas_size();

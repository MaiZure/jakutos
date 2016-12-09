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

function initHud()
{
	this.dirty = true;
	this.minimap_world_dirty = true;
	this.minimap_viewbox_dirty = true;
	
	this.render_hud_text = render_hud_text;
	this.render = renderHud;
	
	this.Minimap = new initMinimap();
	
	this.render();
}

function renderHud()
{
	if (this.dirty) { this.render_hud_text(wctx); }
	this.Minimap.render();
	this.dirty = false;
}

function render_hud_text(target_context)
{
	/* Old stuff
	target_context.font = BASE_FONT_SIZE+" Sans-Serif";
	target_context.fillStyle = FG_COLOR;
	target_context.textAlign = "right";
	var animateOut = SETTING_ANIMATE ? "Animations ON" : "Animations OFF";
	target_context.fillText(animateOut,target_context.canvas.width,50);	
	*/
}

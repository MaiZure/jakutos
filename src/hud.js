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
	this.world = Region;
	this.dirty = true;
	this.minimap = renderMinimap;
	this.render = renderHud;
}

function renderHud(target_context)
{
	target_context.font = BASE_FONT_SIZE+" Sans-Serif";
	target_context.fillStyle = FG_COLOR;
	target_context.textAlign = "right";
	var animateOut = SETTING_ANIMATE ? "Animations ON" : "Animations OFF";
	target_context.fillText(animateOut,target_context.canvas.width,50);
	this.minimap(target_context);
	this.dirty = false;
}

function renderMinimap(target_context)
{
	var i,j, px, py;
	for (j=WORLD_SIZE_Y-1;j>0;j--)
	{
		for (i=WORLD_SIZE_X-1;i>0;i--)
		{
			px = worldCanvas.width-i-1;
			py = worldCanvas.height-j-1;
			
			target_context.fillStyle = this.world.gridcol[j][i]
			target_context.fillRect(px,py,1,1);
		}
	}
	
	/* View Area */
	px = worldCanvas.width-WORLD_SIZE_X+VIEW_GRID_X;
	py = worldCanvas.height-WORLD_SIZE_Y+VIEW_GRID_Y;
	target_context.strokeStyle = "rgb(255,255,0)";
	target_context.beginPath();
	target_context.lineTo(px,py);
	target_context.lineTo(px+VIEW_GRID_WIDTH,py);
	target_context.lineTo(px+VIEW_GRID_WIDTH,py+VIEW_GRID_HEIGHT);
	target_context.lineTo(px,py+VIEW_GRID_HEIGHT);
	target_context.lineTo(px,py);
	target_context.stroke();
}
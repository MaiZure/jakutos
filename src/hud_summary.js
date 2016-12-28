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

function Summarywidget(hud_instance)
{
	this.hud = hud_instance;
	this.party = Party;
	this.active = false;
	this.current_party_member = -1;
	this.font_size = Math.max(Math.round(this.hud.status_bar_height*0.60),12);
	this.max_line = (this.hud.message_box_height / this.font_size);
	
}

Summarywidget.prototype.render = function()
{
	this.render_line(1, this.party.member[this.party.active_partymember].name + ":");
	this.render_line(3, "Future summary statistics");
}

Summarywidget.prototype.render_line = function(line, message) {
	animation_context.font = this.font_size+"px Courier";
	animation_context.fillStyle = FG_COLOR;
	animation_context.textAlign = "left";
	animation_context.fillText(message,this.hud.message_box_x+5,this.hud.message_box_y+line*this.font_size);
};

Summarywidget.prototype.activate = function() { this.active = true; }
Summarywidget.prototype.deactivate = function() { this.active = false; }
/**
 * Project Jakutos
 *
 *  Copyright 2016 by MaiZure <maizure/\member.fsf.org>
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
 
function Hover(hud_instance) {
	this.hud = hud_instance;
	this.dirty = true;
	this.message = "";
}

Hover.prototype.render = function() {
	if (this.dirty) {
		var font_size = Math.round(this.hud.hover_bar_height*0.80);
		this.clear_hover_bar();
		animation_context.font = font_size+"px Courier";
		animation_context.fillStyle = "rgb(224,224,0)";
		animation_context.textAlign = "center";
		animation_context.fillText(this.message,this.hud.hover_bar_x+this.hud.hover_bar_width/2,this.hud.hover_bar_y+font_size);
		this.dirty = false;
	}
};

Hover.prototype.clear_hover_bar = function() {
	animation_context.clearRect(this.hud.hover_bar_x,this.hud.hover_bar_y,this.hud.hover_bar_width,this.hud.hover_bar_height);
};

Hover.prototype.add_message = function(msg) {
	if (msg != this.message) { 
		this.message = msg;	
		this.dirty = true;
		this.hud.dirty = true;
		Hud.render();
	}
};

Hover.prototype.get_hover_mob = function(xx, yy) {
	var pos = World.gridmob[yy][xx];
	if (pos) { return pos.name; }
	
	return "";
};

Hover.prototype.get_hover_avatar = function(party_member) {
	return Party.member[party_member].name + " the " + Party.get_class(Party.member[party_member].job);
};
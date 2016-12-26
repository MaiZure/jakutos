/**
 * Project Jakutos
 *
 *  Copyright 2016 by MaiZure <maizure/\member.fsf.org>
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
 
function Partywidget(hud_id, new_id) 
{
	this.partymember_id = new_id;
	this.hud = hud_id;
	this.party = Party;
	this.dirty = true;
}

/* Hud object reference */
Partywidget.prototype.hud = 0;
/* Party object reference */
Partywidget.prototype.party = 0;

Partywidget.prototype.clear_partymember = function() 
{
	var xx = this.hud.avatar_box_x[this.partymember_id];
	var yy = this.hud.avatar_box_y;
	var ww = this.hud.avatar_box_width;
	var hh = this.hud.avatar_box_height;
	animation_context.clearRect(xx,yy,ww,hh);
};

Partywidget.prototype.render = function() 
{	
	if (this.dirty) {
		var xx = this.hud.avatar_box_x[this.partymember_id] + this.hud.avatar_box_width/2;
		var yy = this.hud.avatar_box_y + Math.round(this.hud.avatar_box_height*0.6);
		var font_size = Math.round(this.hud.avatar_box_height*0.8)+"px Sans-Serif";
		
		var color = this.get_hud_color(this.party, this.partymember_id);
		
		var hp_bar_width = Math.round(this.party.member[this.partymember_id].current_hp/this.party.member[this.partymember_id].max_hp*this.hud.avatar_box_width);
			hp_bar_width = Math.max(hp_bar_width,0);
		var hp_bar_height = Math.round(this.hud.avatar_box_height*0.04);
		var hp_bar_x = this.hud.avatar_box_x[this.partymember_id];
		var hp_bar_y = Math.round(this.hud.avatar_box_y+this.hud.avatar_box_height*0.85);
		
		var mp_bar_width = Math.round(this.party.member[this.partymember_id].current_mp/this.party.member[this.partymember_id].max_mp*this.hud.avatar_box_width);
		var mp_bar_height = Math.round(this.hud.avatar_box_height*0.04);
		var mp_bar_x = this.hud.avatar_box_x[this.partymember_id];
		var mp_bar_y = Math.round(this.hud.avatar_box_y+this.hud.avatar_box_height*0.92);
		
		
		/* Draw @ sign */
		this.clear_partymember();
		animation_context.fillStyle = color;
		animation_context.textAlign = "center";
		animation_context.font = font_size;
		animation_context.fillText("@", xx, yy);
		this.dirty = false;
		
		/* Draw HP bar */
		animation_context.fillStyle = this.health_bar_color(this.hud.avatar_box_width, hp_bar_width);
		animation_context.fillRect(hp_bar_x,hp_bar_y,hp_bar_width,hp_bar_height);
		
		/* Draw MP bar */
		animation_context.fillStyle = "rgb(0,0,240)";
		animation_context.fillRect(mp_bar_x,mp_bar_y,mp_bar_width,mp_bar_height);
	}
};

Partywidget.prototype.get_hud_color = function(party, id) 
{
	/* Set default to normal and short circuit based on status priority */
	var color = "rgb(224,224,224)";
	
	if (party.member[id].status & STATUS_DEAD) { return "rgb(0,0,0)"; }	
	if (party.member[id].status & STATUS_UNCONCIOUS) { return "rgb(96,0,0)"; }	
	if (party.member[id].status & STATUS_POISONED) { return "rgb(160,160,92)"; }	
	if (party.member[id].current_delay > 0) { return "rgb(160,160,160)"; }
	if (id == party.active_partymember) { return "rgb(128,240,128)"; }
	
	return color;
};

Partywidget.prototype.health_bar_color = function(full_width, current_width) 
{
	if (current_width / full_width < 0.25) { return "rgb(240,0,0)"; }
	if (current_width / full_width < 0.50) { return "rgb(240,240,0)"; }
	return "rgb(0,240,0)";
};
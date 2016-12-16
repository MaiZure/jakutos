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
 
function Partymember(hud_id, new_id)
{
	this.partymember_id = new_id;
	this.hud = hud_id
	this.party = Party;
}

Partymember.prototype.hud = 0;  /* Hud object reference */
Partymember.prototype.party = 0; /* Party object reference */
Partymember.prototype.partymember_id = -1;
Partymember.prototype.dirty = true;


Partymember.prototype.clear_partymember = function()
{
	var xx = this.hud.avatar_box_x[this.partymember_id];
	var yy = this.hud.avatar_box_y;
	var ww = this.hud.avatar_box_width;
	var hh = this.hud.avatar_box_height;
	animation_context.clearRect(xx,yy,ww,hh);
}

Partymember.prototype.render = function()
{	
	if (this.dirty)
	{
		var xx = this.hud.avatar_box_x[this.partymember_id] + this.hud.avatar_box_width/2;
		var yy = this.hud.avatar_box_y + Math.round(this.hud.avatar_box_height*0.6);
		var font_size = Math.round(this.hud.avatar_box_height*0.8)+"px Sans-Serif";
		
		var hp_bar_width = Math.round(this.party.current_hp[this.partymember_id]/this.party.max_hp[this.partymember_id]*this.hud.avatar_box_width);
		var hp_bar_height = Math.round(this.hud.avatar_box_height*0.04);
		var hp_bar_x = this.hud.avatar_box_x[this.partymember_id];
		var hp_bar_y = Math.round(this.hud.avatar_box_y+this.hud.avatar_box_height*0.85);
		
		var mp_bar_width = Math.round(this.party.current_mp[this.partymember_id]/this.party.max_mp[this.partymember_id]*this.hud.avatar_box_width);
		var mp_bar_height = Math.round(this.hud.avatar_box_height*0.04);
		var mp_bar_x = this.hud.avatar_box_x[this.partymember_id];
		var mp_bar_y = Math.round(this.hud.avatar_box_y+this.hud.avatar_box_height*0.92);
		
		/* Draw @ sign */
		this.clear_partymember();
		animation_context.fillStyle = "rgb(224,224,224)";
		animation_context.textAlign = "center";
		animation_context.font = font_size
		animation_context.fillText("@", xx, yy);
		this.dirty = false;
		
		/* Draw health */
		animation_context.fillStyle = "rgb(0,240,0)";
		animation_context.fillRect(hp_bar_x,hp_bar_y,hp_bar_width,hp_bar_height);
		
		/* Draw magic */
		animation_context.fillStyle = "rgb(0,0,240)";
		animation_context.fillRect(mp_bar_x,mp_bar_y,mp_bar_width,mp_bar_height);
	}
}
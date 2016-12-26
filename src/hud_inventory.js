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
 
/* HUD widget that displays worn inventory of a single player
   It is activated through the main HUD and replaces the message box */
function Inventorywidget(hud_instance)
{
	this.hud = hud_instance;
	this.party = Party;
	this.active = false;
	this.current_party_member = -1;
}

Inventorywidget.prototype.render = function(party_member = -1)
{
	/* A zero+ value for party_member changes the active render target
	   Otherwise, we continue with the last target */
	if (party_member > -1) { this.current_party_member = party_member; }

	/* There are no party members */
	if (this.current_party_member === -1) { return false; }
	
	/* Clear the current window */
	this.clear_message_window();
	
	/* An alias to the party member we're viewing */
	var current = Party.member[this.current_party_member];
	
	/* Display equipment currently worn */
	this.render_line(1, current.name + " is using: ");
	this.render_line(2, "Weapon: " + this.get_item_name(current.inventory.wear, WEAR_WIELD_SINGLE) );
	this.render_line(3, "Head: " + this.get_item_name(current.inventory.wear, WEAR_HEAD) );
	this.render_line(4, "Body: " + this.get_item_name(current.inventory.wear, WEAR_BODY) );
	this.render_line(5, "Feet: " + this.get_item_name(current.inventory.wear, WEAR_FEET) );
	this.render_line(6, "Hands: " + this.get_item_name(current.inventory.wear, WEAR_HANDS) );
	this.render_line(7, "Neck: " + this.get_item_name(current.inventory.wear, WEAR_NECK) );
	this.render_line(8, "Cloak: " + this.get_item_name(current.inventory.wear, WEAR_CLOAK) );
	this.render_line(9, "Finger: " + this.get_item_name(current.inventory.wear, WEAR_FINGER) );
	
	this.hud.inventory_dirty = false;
};

Inventorywidget.prototype.clear_message_window = function() {
	animation_context.clearRect(this.hud.message_box_x,this.hud.message_box_y,this.hud.message_box_width,this.hud.message_box_height);
};

Inventorywidget.prototype.render_line = function(line, message) {
	var font_size = Math.max(Math.round(this.hud.status_bar_height*0.60),12);
	animation_context.font = font_size+"px Courier";
	animation_context.fillStyle = FG_COLOR;
	animation_context.textAlign = "left";
	animation_context.fillText(message,this.hud.message_box_x+5,this.hud.message_box_y+font_size+(line-1)*font_size);
}

Inventorywidget.prototype.get_item_name = function(who, what)
{
	/* Who's on first?? ...yeah this was typed after probably 500 lines of code today */
	if (!who[what]) { return "none";}
	return who[what].name;
}
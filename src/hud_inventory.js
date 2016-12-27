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
 
/* HUD widget that displays worn inventory of a single player
   It is activated through the main HUD and replaces the message box */
function Inventorywidget(hud_instance)
{
	var i;
	this.hud = hud_instance;
	this.party = Party;
	this.active = false;
	this.current_party_member = -1;
	this.mode = MODE_WEAR;
	this.popup_active = false;
	this.inv_line_lookup = [];
	
	/* The following variables will contain references to popup renders
	 * with the goal to compare current and previous render requests so
	 * we don't constantly render the same item popup repeatedly unless
	 * the item actually changes 
	 */
	this.active_item = null;
	this.last_rendered_item = null;
	
	for (i=0; i<30; i++) { this.inv_line_lookup[i] = null; }
	
	this.inv_line_lookup[3] = WEAR_WIELD_SINGLE;
	this.inv_line_lookup[4] = WEAR_RANGED;
	this.inv_line_lookup[5] = WEAR_HEAD;
	this.inv_line_lookup[6] = WEAR_BODY;
	this.inv_line_lookup[7] = WEAR_FEET;
	this.inv_line_lookup[8] = WEAR_HANDS;
	this.inv_line_lookup[9] = WEAR_NECK;
	this.inv_line_lookup[10] = WEAR_CLOAK;
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
	this.render_line(3, "Weapon: " + this.get_item_name(current.inventory.wear, WEAR_WIELD_SINGLE) );
	this.render_line(4, "Ranged: " + this.get_item_name(current.inventory.wear, WEAR_RANGED) );
	this.render_line(5, "Head: " + this.get_item_name(current.inventory.wear, WEAR_HEAD) );
	this.render_line(6, "Body: " + this.get_item_name(current.inventory.wear, WEAR_BODY) );
	this.render_line(7, "Feet: " + this.get_item_name(current.inventory.wear, WEAR_FEET) );
	this.render_line(8, "Hands: " + this.get_item_name(current.inventory.wear, WEAR_HANDS) );
	this.render_line(9, "Neck: " + this.get_item_name(current.inventory.wear, WEAR_NECK) );
	this.render_line(10, "Cloak: " + this.get_item_name(current.inventory.wear, WEAR_CLOAK) );
	this.render_line(11, "Finger: " + this.get_item_name(current.inventory.wear, WEAR_FINGER) );
	
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
	animation_context.fillText(message,this.hud.message_box_x+5,this.hud.message_box_y+line*font_size);
};

Inventorywidget.prototype.get_item_name = function(who, what)
{
	/* Who's on first?? ...yeah this was typed after probably 500 lines of code today */
	if (!who[what]) { return "none";}
	return who[what].name;
};

Inventorywidget.prototype.toggle_item_popup = function(item) 
{
	this.popup_active = !this.popup_active;
	
	if ( this.popup_active ) { this.render_item_popup(item); }
	if ( !this.popup_active ) { this.clear_item_popup(); }
};

Inventorywidget.prototype.activate_item_popup = function(item) 
{
	this.active_item = item
	this.render_item_popup(active_item)
};

Inventorywidget.prototype.clear_item_popup = function()
{
	if (!this.last_rendered_item) { return; }
	var width = 320;
	var height = 240;
	var top_left_x = Math.max((View.view_px_width-width)/2,0);
	var top_left_y = Math.max((View.view_px_height-height)/2,0);
	
	overlay_context.clearRect(top_left_x, top_left_y, width, height);
	this.popup_active = false;
	this.active_item = null;
	this.last_rendered_item = null;
};

Inventorywidget.prototype.render_item_popup = function(item)
{
	if (!item) { return; }
	if (item === this.last_rendered_item) { return; }
	
	var width = 300;
	var height = 200;
	var top_left_x = Math.max((View.view_px_width-width)/2,0);
	var top_left_y = Math.max((View.view_px_height-height)/2,0);
	var center_x = Math.round(top_left_x+width/2);
	var font_size = Math.round(this.hud.hover_bar_height*0.80);
	
	var name = item.name;
	var description = item.description;
	var stats = "";
	
	if ( item.is_armor() )  { stats = "Armor class: " + item.armor }
	if ( item.is_weapon() ) { stats = "Attack damage: " + item.die_num + "d" + item.die_side + " + " + item.die_bonus }
	
	/* Draw grey square background */
    overlay_context.fillStyle = "rgb(128,128,128)"
	overlay_context.fillRect(top_left_x, top_left_y, width, height);
	
	/* Draw internal frame shadow */
	overlay_context.lineWidth = 5;
	overlay_context.strokeStyle = "rgb(0,0,0)";
    overlay_context.strokeRect(top_left_x, top_left_y, width, height);
	
	/* Draw frame */
	overlay_context.lineWidth = 4;
	overlay_context.strokeStyle = "rgb(160,160,0)";
    overlay_context.strokeRect(top_left_x, top_left_y, width, height);
	
	/* Draw item name */
	overlay_context.font = (font_size-2)+"px Sans-Serif";
	overlay_context.fillStyle = "rgb(0,0,0)";
	overlay_context.textAlign = "center";
	overlay_context.fillText(name, center_x+2, top_left_y+font_size+5);
	overlay_context.fillStyle = "rgb(240,240,240)";
	overlay_context.fillText(name, center_x, top_left_y+font_size+3);
	
	/* Draw item stats */
	overlay_context.font = Math.round(font_size*0.75)+"px Sans-Serif";
	overlay_context.fillStyle = "rgb(0,0,0)";
	overlay_context.textAlign = "left";
	overlay_context.fillText(stats, top_left_x+12, Math.round(top_left_y+font_size*2.5+2));
	overlay_context.fillStyle = "rgb(240,240,240)";
	overlay_context.fillText(stats, top_left_x+10, Math.round(top_left_y+font_size*2.5));
	
	/* Draw item description */
	overlay_context.fillStyle = "rgb(0,0,0)";
	overlay_context.fillText(description, top_left_x+12, Math.round(top_left_y+font_size*4+2));
	overlay_context.fillStyle = "rgb(240,240,240)";
	overlay_context.fillText(description, top_left_x+10, Math.round(top_left_y+font_size*4));
	
	this.popup_active = true;
	this.last_rendered_item = item;
};

Inventorywidget.prototype.mouse_handler_hover = function(mouse_x, mouse_y) {
	var line = this.mouse_to_text_line_number(mouse_x, mouse_y);
	var wear_slot = this.inv_line_lookup[line];
	var current = Party.member[this.current_party_member].inventory;
	
	if (current.wear[wear_slot]) {
		var item = current.wear[wear_slot];
		this.render_item_popup(item);
	} else {
		this.clear_item_popup(item);
	}
};

Inventorywidget.prototype.mouse_to_text_line_number = function(mouse_x, mouse_y) {
	
	/* This height must match the font size calculation from render_line(); */
	var line_height = Math.max(Math.round(this.hud.status_bar_height*0.60),12);
	var top_line = this.hud.message_box_y;
	
	/* Start at line 1, for sanity */
	return Math.floor( (mouse_y - top_line) / line_height ) + 1;
};
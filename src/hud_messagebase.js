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
 
/* Many of the message box interactive widgets have common methods.
 * I'm sticking those methods in this object that others will derive
 */
function MessageBase(hud_instance) {
	this.hud = hud_instance;
	this.font_size = Math.max(Math.round(this.hud.status_bar_height*0.60),12);
	this.max_line = (this.hud.message_box_height / this.font_size);
	this.popup_active = false
	this.selected_item = null;
	this.active = false;
	/* The following variables will contain references to popup renders
	 * with the goal to compare current and previous render requests so
	 * we don't constantly render the same item popup repeatedly unless
	 * the item actually changes 
	 */
	
	this.active_item = null;	
	this.last_rendered_item = null;
} 

MessageBase.prototype.activate = function() { this.active = true; };
MessageBase.prototype.deactivate = function() { this.active = false; };

MessageBase.prototype.clear_message_window = function() {
	animation_context.clearRect(this.hud.message_box_x,this.hud.message_box_y,this.hud.message_box_width,this.hud.message_box_height);
};

/* Renders a single line of text in the message window */
MessageBase.prototype.render_line = function(line, message) {
	animation_context.font = this.font_size+"px Courier";
	animation_context.fillStyle = FG_COLOR;
	animation_context.textAlign = "left";
	animation_context.fillText(message,this.hud.message_box_x+5,this.hud.message_box_y+line*this.font_size);
};

/* Renders the hover popup that describes an item */
MessageBase.prototype.render_item_popup = function(item)
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

/* removes the item popup */
MessageBase.prototype.clear_item_popup = function()
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

/* Receives handling commands from the Hud object as needed */
MessageBase.prototype.mouse_handler_hover = function(mouse_x, mouse_y) {
	var line = this.mouse_to_text_line_number(mouse_x, mouse_y);
	var current_item = this.get_item_at_point(mouse_x, mouse_y);
	
	/* Create a popup box if there's a valid item under the mouse */
	if (current_item) {
		this.render_item_popup(current_item);
	} else {
		this.clear_item_popup(current_item);
	}
};

/* Converts the mouse position to a message-box line number in the current view space */
MessageBase.prototype.mouse_to_text_line_number = function(mouse_x, mouse_y) {
	
	/* This height must match the font size calculation from render_line(); */
	var line_height = this.font_size;
	var top_line = this.hud.message_box_y;
	/* Start at line 1, for sanity */
	var line = Math.floor( (mouse_y - top_line) / line_height ) + 1;
	
	/* Need to be able to distinguish an invalid line */
	if (line > this.max_line || line < 1 ) { return false; }

	return line;
};
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

/* The container HUD widget is used for interaction with chests
 * to display and drag their contents. This is remarkably similar
 * to the Containerwidget and both could probably be extended 
 * from some common ancestor. This widget is less complex 
 */
function Containerwidget(hud_instance) {
	
	MessageBase.call(this, hud_instance);
	this.container = null;
	this.name = "Chest";
}

Containerwidget.prototype = Object.create(MessageBase.prototype);

Containerwidget.prototype.render = function()
{
	
	if (!this.container) { 
		this.hud.container_dirty = false;
		return false; 
	}
	/* Clear the current window */
	this.clear_message_window();
	
	this.render_line(1, this.name + " contents: ");
	
	var i;
	
	for (i=0; i<this.container.contents.length; i++) {
		this.render_line(i+3, this.container.contents[i].name);
	}
	
	this.hud.container_dirty = false;
};

Containerwidget.prototype.activate = function(container) { 
	this.active = true; 
	this.hud.container_dirty = true;
	this.container = container;
};


/* Receives handling commands from the Hud object as needed */
Containerwidget.prototype.mouse_handler_click = function(mouse_x, mouse_y) {
	
	if (!this.active) { return; }
	
	/* Saves the reference to the item just clicked in case user drags */
	this.selected_item = this.get_item_at_point(mouse_x, mouse_y);
};

Containerwidget.prototype.mouse_handler_release = function(mouse_x, mouse_y) {
	
	if (!this.active) { return; }
	
	/* Releasing items in the message window never does anything */
	this.selected_item = null;
	
	/* Get the item clicked on and the reference to the active inventory */
	var current_item = this.get_item_at_point(mouse_x, mouse_y);
	var current_party_member = Party.member[Party.active_partymember].inventory;
	
	/* No item under? nothing happens */
	if (!current_item) { return; }
	
	/* If we're viewing equipped items, then clicking removes items */
	current_party_member.backpack.push(current_item);
	this.container.remove_from_container(current_item);
	
};

/* Finds the item text at a given point, typically the mouse pointer */
Containerwidget.prototype.get_item_at_point = function(xx, yy) {
	/* Find the current line and item reference */
	var line = this.mouse_to_text_line_number(xx, yy);
	
	/* Reference the appropriate data array given the mode */
	var current_item = this.container.contents[line-3];
	
	return current_item;
}
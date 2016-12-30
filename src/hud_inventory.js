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
	
	MessageBase.call(this, hud_instance);
	
	var i;
	this.hud = hud_instance;
	this.party = Party;
	this.current_party_member = -1;
	this.mode = MODE_WEAR;
	this.wear_line_lookup = [];
	
	for (i=0; i<30; i++) { this.wear_line_lookup[i] = null; }
	
	/* Poor man's line to wear slot reference */
	this.wear_line_lookup[3] = WEAR_WIELD_SINGLE;
	this.wear_line_lookup[4] = WEAR_RANGED;
	this.wear_line_lookup[5] = WEAR_HEAD;
	this.wear_line_lookup[6] = WEAR_BODY;
	this.wear_line_lookup[7] = WEAR_FEET;
	this.wear_line_lookup[8] = WEAR_HANDS;
	this.wear_line_lookup[9] = WEAR_NECK;
	this.wear_line_lookup[10] = WEAR_CLOAK;
}

Inventorywidget.prototype = Object.create(MessageBase.prototype);

Inventorywidget.prototype.render = function(party_member = -1)
{
	this.font_size = Math.max(Math.round(this.hud.status_bar_height*0.60),12);
	this.max_line = (this.hud.message_box_height / this.font_size);
	
	if (this.mode === MODE_WEAR) { this.render_wear(party_member); }
	if (this.mode === MODE_BACKPACK) { this.render_backpack(party_member); }
};

Inventorywidget.prototype.render_wear = function(party_member = -1)
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

Inventorywidget.prototype.render_backpack = function(party_member = -1)
{
	if (party_member > -1) { this.current_party_member = party_member; }

	/* There are no party members */
	if (this.current_party_member === -1) { return false; }
	
	/* Clear the current window */
	this.clear_message_window();
	
	/* An alias to the party member we're viewing */
	var current = Party.member[this.current_party_member];
	
	/* Display equipment currently worn */
	var i;
	this.render_line(1, current.name + " is carrying: ");
	for (i=3; i<this.max_line; i++) { this.render_line(i, this.get_item_name(current.inventory.backpack, i-3) ); }
	
	this.hud.inventory_dirty = false;
};



/* Looks up the name of an item */
Inventorywidget.prototype.get_item_name = function(who, what)
{
	/* Who's on first?? ...yeah this was typed after probably 500 lines of code today */
	if (!who[what]) { return "none";}
	return who[what].name;
};

/* Interface to toggle item popup - no use yet */
Inventorywidget.prototype.toggle_item_popup = function(item) 
{
	this.popup_active = !this.popup_active;
	
	if ( this.popup_active ) { this.render_item_popup(item); }
	if ( !this.popup_active ) { this.clear_item_popup(); }
};

/* Turns on the item popup */
Inventorywidget.prototype.activate_item_popup = function(item) 
{
	this.active_item = item
	this.render_item_popup(active_item)
};

/* Activates the inventory widget. */
Inventorywidget.prototype.activate = function() 
{
	/* If it's already active, we'll toggle modes */
	if (this.active) {
		this.toggle_mode();
	/* Otherwise we start by viewing worn equipment */
	} else {
		this.active = true;
		this.mode = MODE_WEAR;
	}
};

Inventorywidget.prototype.toggle_mode = function() {
	this.mode = this.mode === MODE_WEAR ? MODE_BACKPACK : MODE_WEAR;
};

/* Receives handling commands from the Hud object as needed */
Inventorywidget.prototype.mouse_handler_click = function(mouse_x, mouse_y) {
	
	if (!this.active) { return; }
	
	/* Saves the reference to the item just clicked in case user drags */
	this.selected_item = this.get_item_at_point(mouse_x, mouse_y);
};

Inventorywidget.prototype.mouse_handler_release = function(mouse_x, mouse_y) {
	
	if (!this.active) { return; }
	
	/* Releasing items in the message window never does anything */
	this.selected_item = null;
	
	/* Get the item clicked on and the reference to the active inventory */
	var current_item = this.get_item_at_point(mouse_x, mouse_y);
	var current_party_member = Party.member[this.current_party_member].inventory;
	
	/* No item under? nothing happens */
	if (!current_item) { return; }
	
	/* If we're viewing equipped items, then clicking removes items */
	if (this.mode === MODE_WEAR) { current_party_member.remove_item(current_item); }
	
	/* If we're viewing inventory items, then clicking wears them */
	if (this.mode === MODE_BACKPACK) { current_party_member.wear_item(current_item); }
};

/* Finds the item text at a given point, typically the mouse pointer */
Inventorywidget.prototype.get_item_at_point = function(xx, yy) {
	/* Find the current line and item reference
	 * We're actually getting info here for either inventory mode */
	var line = this.mouse_to_text_line_number(xx, yy);
	var current_party_member = Party.member[this.current_party_member].inventory;
	var wear_slot = this.wear_line_lookup[line];
	var backpack_slot = line-3;
	var current_item;
	
	/* Reference the appropriate data array given the mode */
	if (this.mode === MODE_WEAR) { current_item = current_party_member.wear[wear_slot]; }
	if (this.mode === MODE_BACKPACK) { current_item = current_party_member.backpack[backpack_slot]; }
	
	return current_item;
}
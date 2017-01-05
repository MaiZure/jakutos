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

/* The HUD has the most moving parts and unfortunately has to be 
 * highly coupled by design. Most of the core functionality lies 
 * in the widgets. This 'Manager' object maintains references to
 * the widgets. There's probably a better pattern that we could
 * eventually put in place here.
 */ 
function Hud() 
{
	/* These variables need to be deferred until instantiation */
	var i;
	this.view_px_x = View.view_px_width+16;
	this.view_px_y = 0;
	this.view_px_width = base_canvas.width-this.view_px_x;
	this.view_px_height = base_canvas.height-this.view_px_y;
	
	this.avatar_box_width = Math.round((this.view_px_width-20)/4);
	this.avatar_box_height = this.avatar_box_width;
	this.avatar_box_y = this.view_px_height-this.avatar_box_height-5;
	this.avatar_box_x = [];
	for (i=0; i<4; i++) {
		this.avatar_box_x[i]=4+this.view_px_x+i*(this.avatar_box_width+4);
	}
	
	this.status_bar_x = this.view_px_x;
	this.status_bar_y = 0;
	this.status_bar_height = Math.round(base_canvas.height*0.05);
	
	this.hover_bar_x = this.view_px_x;
	this.hover_bar_y = 0; /* deferred until after message box is defined */
	this.hover_bar_height = Math.round(base_canvas.height*0.05);
	this.hover_bar_width = this.view_px_width;
	
	this.font_size = Math.max(Math.round(this.status_bar_height*0.60),12);
	
	this.message_box_x = this.view_px_x+4;
	this.message_box_y = this.status_bar_height+Math.round(base_canvas.height*0.01);
	this.message_box_width = this.view_px_width-8;
	this.message_box_height = Math.round((base_canvas.height-this.status_bar_height-this.avatar_box_height-this.hover_bar_height)*0.95);
	
	this.hover_bar_y = this.message_box_y+this.message_box_height+Math.round(base_canvas.height*0.01);
	
	/* The hud should create its widgets */
	this.status = new Status(this);
	this.message = new Message(this);
	this.inventory = new Inventorywidget(this);
	this.summary = new Summarywidget(this);
	this.container = new Containerwidget(this);
	this.hover = new Hover(this);
	
	for (i=0; i<4; i++) {
		this.partywidget[i] = new Partywidget(this,i); 
	}
	
	/* Last minute hack to simulate dragging items */
	this.last_drag_x = 0;
	this.last_drag_y = 0;
}

Hud.prototype.dirty = true;
Hud.prototype.party_dirty = true;
Hud.prototype.message_dirty = true;
Hud.prototype.inventory_dirty = false;
Hud.prototype.container_dirty = false;
Hud.prototype.partywidget = [];

/* Renders information in the HUD */
Hud.prototype.render = function() 
{
	if (this.dirty) { this.debug_render(animation_context); }
	
	switch (this.find_active_widget()) {
		case this.message: this.message.render(); break;
		case this.inventory: this.inventory.render(); break;
		case this.summary: this.summary.render(); break;
		case this.container: this.container.render(); break;
	}
	
	if (this.hover.dirty) { this.hover.render(); }
	
	if (this.status.dirty) { this.status.render(); }
	
	
	for (i=0;i<4;i++) {
		if (this.partywidget[i].dirty) {
			this.partywidget[i].render();
		}
	}
	
	this.debug();
	this.dirty = false;
};

Hud.prototype.debug_render = function(target_context) 
{	
	/* This function is intentionally left blank */
	/*
	if (SETTING_EDIT_MODE) {
		target_context.clearRect(target_context.canvas.width-150,this.avatar_box_y-150,target_context.canvas.width,150);
		target_context.font = BASE_FONT_SIZE+"px Sans-Serif";
		target_context.fillStyle = FG_COLOR;
		target_context.textAlign = "right";
		target_context.fillText("("+Player.map_x+","+Player.map_y+")",target_context.canvas.width,this.avatar_box_y-100);	
	}
	*/
	//target_context.fillText("("+mouse_x+","+mouse_y+")",target_context.canvas.width,this.avatar_box_y-75);	
	//target_context.fillText("("+mouse_gx+","+mouse_gy+")",target_context.canvas.width,this.avatar_box_y-50);	*/
};

Hud.prototype.render_selected_item = function(xx, yy, item)
{
	var item_name = item.name;
	
	/* clear last rendered text drag */
	this.clear_last_drag_render();
	
	overlay_context.font = this.font_size+"px Courier";
	overlay_context.fillStyle = FG_COLOR;
	overlay_context.textAlign = "center";
	overlay_context.fillText(item_name,xx,yy);
	
	this.last_drag_x = xx;
	this.last_drag_y = yy;
	
};

Hud.prototype.clear_last_drag_render = function()
{
	var font_size = this.inventory.font_size;
	overlay_context.clearRect(this.last_drag_x-this.message_box_width/2,this.last_drag_y-font_size, this.message_box_width,font_size*2);
};

/* Draws all the background areas on the HUD */
Hud.prototype.debug = function() 
{
	var i;
	base_context.fillStyle = "rgb(160,0,0)";
	base_context.fillRect(this.view_px_x, this.view_px_y, this.view_px_width, this.view_px_height);
	
	base_context.fillStyle = "rgb(0,160,0)";
	base_context.fillRect(this.status_bar_x, this.status_bar_y, this.view_px_width, this.status_bar_height);
	
	base_context.fillStyle = "rgb(0,0,160)";
	base_context.fillRect(this.message_box_x, this.message_box_y, this.message_box_width, this.message_box_height);
	
	base_context.fillStyle = "rgb(32,32,32)";
	base_context.fillRect(this.hover_bar_x, this.hover_bar_y, this.view_px_width, this.hover_bar_height);
	
	for (i=0; i<4; i++) {
		base_context.fillStyle = "rgb(0,160,0)";
		base_context.fillRect(this.avatar_box_x[i], this.avatar_box_y, this.avatar_box_width, this.avatar_box_height);
	}
};

/* Called when the window is resize - basically redoes all the drawing calculations.
   This thing is really ugly and needs to be reworked before it explodes */
Hud.prototype.resize = function() 
{
	this.dirty = true;
	
	var i;
	this.view_px_x = View.view_px_width+16;
	this.view_px_y = 0;
	this.view_px_width = base_canvas.width-this.view_px_x;
	this.view_px_height = base_canvas.height-this.view_px_y;
	
	this.avatar_box_width = Math.round((this.view_px_width-20)/4);
	this.avatar_box_height = this.avatar_box_width;
	this.avatar_box_y = this.view_px_height-this.avatar_box_height-5;
	this.avatar_box_x = [];
	
	for (i=0; i<4; i++) {
		this.avatar_box_x[i]=4+this.view_px_x+i*(this.avatar_box_width+4); 
	}
	
	this.status_bar_x = this.view_px_x;
	this.status_bar_y = 0;
	this.status_bar_height = Math.round(base_canvas.height*0.05);
	
	this.hover_bar_x = this.view_px_x;
	this.hover_bar_y = 0; /* deferred until after message box is defined */
	this.hover_bar_height = Math.round(base_canvas.height*0.05);
	this.hover_bar_width = this.view_px_width;
	
	this.message_box_x = this.view_px_x+4;
	this.message_box_y = this.status_bar_height+Math.round(base_canvas.height*0.01);
	this.message_box_width = this.view_px_width-8;
	this.message_box_height = Math.round((base_canvas.height-this.status_bar_height-this.avatar_box_height-this.hover_bar_height)*0.95);
	
	this.hover_bar_y = this.message_box_y+this.message_box_height+Math.round(base_canvas.height*0.01);
	
	this.status.dirty = true;
	this.partywidget[0].dirty = true;
	this.partywidget[1].dirty = true;
	this.partywidget[2].dirty = true;
	this.partywidget[3].dirty = true;
	if (this.is_active(this.message)) { this.message_dirty = true; }
	if (this.is_active(this.inventory)) { this.inventory_dirty = true; }
};

/* We have several widgets that operate in the message window. This shifts between them */
Hud.prototype.activate_message_box_widget = function(widget, argument = null)
{
	if (typeof widget !== "object") { return; }
	
	/* Desired widget is not already active so turn off everything */
	if ( !this.is_active(widget) ) {
		this.message.deactivate();
		this.summary.deactivate();
		this.inventory.deactivate();
		this.container.deactivate();
	}
	
	if (this.inventory.last_rendered_item) { this.inventory.clear_item_popup; }
	if (this.container.last_rendered_item) { this.container.clear_item_popup; }
	
	/* Turn on desired widget */
	widget.activate(argument);
	widget.render(argument);
};

Hud.prototype.cycle_message_box_widgets = function(party_member)
{
	var current_widget = this.find_active_widget();
	var next_widget;
	
	switch ( current_widget ) {
		case this.message: next_widget = this.summary;  break;
		case this.summary: next_widget = this.inventory;  break;
		case this.inventory: next_widget = this.inventory;  break;
	}
	
	Hud.activate_message_box_widget(next_widget, party_member);
};

/* Checks if a message box widget is active or not */
Hud.prototype.is_active = function(widget) {
	if (typeof widget !== "object") { return; }
	return widget.active;
};

Hud.prototype.find_active_widget = function() {
	if (this.message.active) { return this.message; }
	if (this.summary.active) { return this.summary; }
	if (this.inventory.active) { return this.inventory; }
	if (this.container.active) { return this.container; }
};

Hud.prototype.mouse_handler_hover = function(xx, yy) {
	if (this.is_active(this.inventory)) { this.inventory.mouse_handler_hover(xx, yy); }
	if (this.is_active(this.container)) { this.container.mouse_handler_hover(xx, yy); }
	return false;
};

Hud.prototype.mouse_handler_click = function(xx, yy) {
	
	/* Avatar box clicks */
	if ( yy > Hud.avatar_box_y ) {
		var target_party_member = this.get_avatar_box_index(xx);
		
		Party.activate_party_member(target_party_member);
	
	/* Message Box area clicks */
	} else {
			Hud.inventory.mouse_handler_click(xx, yy);
			Hud.container.mouse_handler_click(xx, yy);
	}
	
};

Hud.prototype.mouse_handler_release = function(xx, yy) {
	
	/* Avatar box release */
	if ( yy > Hud.avatar_box_y ) {
		/* Check for dragged items to swap */
		var active_widget = null;
		
		if (this.inventory.active) { active_widget = this.inventory; }
		if (this.container.active) { active_widget = this.container; }
		
		if (!active_widget) { return; }
		
		if (active_widget.selected_item) {
			/* Give them the item */
			var item = active_widget.selected_item;
			/* Get the party member number */
			var target_party_member = this.get_avatar_box_index(xx);
			/* Give them the item */
			Party.member[target_party_member].inventory.backpack.push(item);
			
			/* Wrap up depending on the source (between part members or from containers) */
			switch (active_widget) {
				case this.inventory: {
					var source = active_widget.current_party_member;
					/* Remove it from the original player by taking it off and deleting from backpack
					 * Note that if it's not worn, this step will do nothing. It must be in the backpack */
					Party.member[source].inventory.remove_item(item);
					Party.member[source].inventory.remove_from_backpack(item);
					
					this.inventory_dirty = true;
				}; break;
				case this.container: {
					this.container.container.remove_from_container(item);
					
					this.container_dirty = true; 
				} break;
			}
			
			/* Remove the drag reference */
			active_widget.selected_item = null;
		}
	
	/* Message Box area release */
	} else {
			Hud.inventory.mouse_handler_release(xx, yy);
			Hud.container.mouse_handler_release(xx, yy);
	}
	
	this.clear_last_drag_render();
	
};

/* Returns the avatar box number */
Hud.prototype.get_avatar_box_index = function(xx) {
	var index;
	if (xx >= Hud.avatar_box_x[3]) { index = 3; }
	if (xx < Hud.avatar_box_x[3]) { index = 2; }
	if (xx < Hud.avatar_box_x[2]) { index = 1; }
	if (xx < Hud.avatar_box_x[1]) { index = 0; }
	return index;
	
}
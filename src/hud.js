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
	this.hover = new Hover(this);
	for (i=0; i<4; i++) {
		this.partywidget[i] = new Partywidget(this,i); 
	}
}

Hud.prototype.dirty = true;
Hud.prototype.party_dirty = true;
Hud.prototype.message_dirty = true;
Hud.prototype.inventory_dirty = false;
Hud.prototype.partywidget = [];

Hud.prototype.render = function() 
{
	if (this.dirty) { this.debug_render(animation_context); }
	
	if (this.message_dirty) { this.message.render(); }
	
	if (this.inventory_dirty) { this.inventory.render(); }
	
	if (this.summary_dirty) { this.summary_render(); }
	
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
	/* This function is intentionally left blank 
	//target_context.clearRect(target_context.canvas.width-150,this.avatar_box_y-150,target_context.canvas.width,150);
	//target_context.font = BASE_FONT_SIZE+"px Sans-Serif";
	//target_context.fillStyle = FG_COLOR;
	//target_context.textAlign = "right";
	//target_context.fillText("("+Player.map_x+","+Player.map_y+")",target_context.canvas.width,this.avatar_box_y-100);	
	//target_context.fillText("("+mouse_x+","+mouse_y+")",target_context.canvas.width,this.avatar_box_y-75);	
	//target_context.fillText("("+mouse_gx+","+mouse_gy+")",target_context.canvas.width,this.avatar_box_y-50);	*/
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
	}
	
	if (this.inventory.last_rendered_item) { this.inventory.clear_item_popup; }
	
	/* Turn on desired widget */
	widget.activate();
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
};

Hud.prototype.mouse_handler_hover = function(xx, yy) {
	if (this.is_active(this.inventory)) { this.inventory.mouse_handler_hover(xx, yy); }
	return false;
};

Hud.prototype.mouse_handler_click = function(xx, yy) {
	
	/* Avatar box clicks */
	if ( yy > Hud.avatar_box_y ) {
		var target_party_member;
		if (xx >= Hud.avatar_box_x[3]) { target_party_member = 3; }
		if (xx < Hud.avatar_box_x[3]) { target_party_member = 2; }
		if (xx < Hud.avatar_box_x[2]) { target_party_member = 1; }
		if (xx < Hud.avatar_box_x[1]) { target_party_member = 0; }
		
		Party.activate_party_member(target_party_member);
		//Hud.activate_message_box_widget(Hud.inventory, target_party_member);
	}
};
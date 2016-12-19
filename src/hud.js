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

function Hud()
{
	/* These variables need to be deferred until instantiation */
	var i;
	this.view_px_x = View.view_px_width+16;
	this.view_px_y = 0;
	this.view_px_width = baseCanvas.width-this.view_px_x;
	this.view_px_height = baseCanvas.height-this.view_px_y;
	
	this.avatar_box_width = Math.round((this.view_px_width-20)/4);
	this.avatar_box_height = this.avatar_box_width;
	this.avatar_box_y = this.view_px_height-this.avatar_box_height-5;
	this.avatar_box_x = [];
	for (i=0;i<4;i++) { this.avatar_box_x[i]=4+this.view_px_x+i*(this.avatar_box_width+4); }
	
	this.status_bar_x = this.view_px_x;
	this.status_bar_y = 0;
	this.status_bar_height = Math.round(baseCanvas.height*0.05);
	
	this.hover_bar_x = this.view_px_x;
	this.hover_bar_y = 0; /* deferred until after message box is defined */
	this.hover_bar_height = Math.round(baseCanvas.height*0.05);
	this.hover_bar_width = this.view_px_width;
	
	this.message_box_x = this.view_px_x+4;
	this.message_box_y = this.status_bar_height+Math.round(baseCanvas.height*0.01);
	this.message_box_width = this.view_px_width-8;
	this.message_box_height = Math.round((baseCanvas.height-this.status_bar_height-this.avatar_box_height-this.hover_bar_height)*0.95);
	
	this.hover_bar_y = this.message_box_y+this.message_box_height+Math.round(baseCanvas.height*0.01);
	
	/* The hud should create its widgets */
	this.message = new Message(this);
	this.hover = new Hover(this);
	for (i=0;i<4;i++) { this.partymember[i] = new Partymember(this,i); }
}

Hud.prototype.dirty = true;
Hud.prototype.party_dirty = true;
Hud.prototype.message_dirty = true;
Hud.prototype.partymember = [];

Hud.prototype.render = function()
{
	if (this.dirty) { this.debug_render(animation_context); }
	if (this.message_dirty) {this.message.render();}
	for (i=0;i<4;i++) { if (this.partymember[i].dirty) {this.partymember[i].render();}}
	if (this.hover.dirty) {this.hover.render();}
	this.debug();
	this.dirty = false;
}

Hud.prototype.debug_render = function(target_context)
{
	//target_context.clearRect(target_context.canvas.width-150,this.avatar_box_y-150,target_context.canvas.width,150);
	//target_context.font = BASE_FONT_SIZE+"px Sans-Serif";
	//target_context.fillStyle = FG_COLOR;
	//target_context.textAlign = "right";
	//target_context.fillText("("+Player.map_x+","+Player.map_y+")",target_context.canvas.width,this.avatar_box_y-100);	
	//target_context.fillText("("+mouse_x+","+mouse_y+")",target_context.canvas.width,this.avatar_box_y-75);	
	//target_context.fillText("("+mouse_gx+","+mouse_gy+")",target_context.canvas.width,this.avatar_box_y-50);	
}

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
	
	for (var i=0;i<4;i++)
	{
		base_context.fillStyle = "rgb(0,160,0)";
		base_context.fillRect(this.avatar_box_x[i], this.avatar_box_y, this.avatar_box_width, this.avatar_box_height);
	}
}

Hud.prototype.resize = function()
{
	this.dirty = true;
	
	var i;
	this.view_px_x = View.view_px_width+16;
	this.view_px_y = 0;
	this.view_px_width = baseCanvas.width-this.view_px_x;
	this.view_px_height = baseCanvas.height-this.view_px_y;
	
	this.avatar_box_width = Math.round((this.view_px_width-20)/4);
	this.avatar_box_height = this.avatar_box_width;
	this.avatar_box_y = this.view_px_height-this.avatar_box_height-5;
	this.avatar_box_x = [];
	for (i=0;i<4;i++) { this.avatar_box_x[i]=4+this.view_px_x+i*(this.avatar_box_width+4); }
	
	this.status_bar_x = this.view_px_x;
	this.status_bar_y = 0;
	this.status_bar_height = Math.round(baseCanvas.height*0.05);
	
	this.hover_bar_x = this.view_px_x;
	this.hover_bar_y = 0; /* deferred until after message box is defined */
	this.hover_bar_height = Math.round(baseCanvas.height*0.05);
	this.hover_bar_width = this.view_px_width;
	
	this.message_box_x = this.view_px_x+4;
	this.message_box_y = this.status_bar_height+Math.round(baseCanvas.height*0.01);
	this.message_box_width = this.view_px_width-8;
	this.message_box_height = Math.round((baseCanvas.height-this.status_bar_height-this.avatar_box_height-this.hover_bar_height)*0.95);
	
	this.hover_bar_y = this.message_box_y+this.message_box_height+Math.round(baseCanvas.height*0.01);
	
	this.message_dirty = true
	this.partymember[0].dirty = true;
	this.partymember[1].dirty = true;
	this.partymember[2].dirty = true;
	this.partymember[3].dirty = true;
}
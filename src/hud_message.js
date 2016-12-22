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
 
function Message(hud_instance) {
	var i;
	this.hud = hud_instance; /* save parent pinter */
	
	for (i=0; i<this.message_buffer_size; i++) {
		this.message_log.push(""); 
	}
	
	this.message_index = this.message_buffer_size-1;
	this.message_rows = Math.round(this.hud.message_box_height/BASE_FONT_SIZE)-1;
}

Message.prototype.message_buffer_size = 64;
Message.prototype.message_log = [];
Message.prototype.hud = 0; /* parent pointer unknown during prototyping */

Message.prototype.render = function() {
	var i;
	var num = this.message_index;
	var font_size = Math.max(Math.round(this.hud.status_bar_height*0.60),12);
	this.message_rows = Math.round(this.hud.message_box_height/font_size)-1;
	this.clear_message_window();
	for (i=0; i<this.message_rows; i++) {
		animation_context.font = font_size+"px Courier";
		animation_context.fillStyle = FG_COLOR;
		animation_context.textAlign = "left";
		animation_context.fillText(this.message_log[num],this.hud.message_box_x+5,this.hud.message_box_y+font_size+i*font_size);	
		num = (++num) % this.message_buffer_size;
	}
	
	this.hud.message_dirty = false;
};

Message.prototype.clear_message_window = function() {
	animation_context.clearRect(this.hud.message_box_x,this.hud.message_box_y,this.hud.message_box_width,this.hud.message_box_height);
};

Message.prototype.add_message = function(msg) {
	this.message_index--;
	
	if (this.message_index < 0) {
		this.message_index = this.message_buffer_size-1;
	}
	
	this.message_log[this.message_index] = msg;
	this.hud.message_dirty = true;
	this.hud.dirty = true;
	Hud.render();
};

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
 
/* This class controls the display of the gameplay log in the message box.
 * It derives a base class for the message box. Messages are implemented 
 * with a ring buffer as a standard array */
 
function Message(hud_instance) {
	MessageBase.call(this, hud_instance);
	
	var i;
	this.hud = hud_instance; /* save parent pointer */
	
	for (i=0; i<this.message_buffer_size; i++) {
		this.message_log.push(""); 
	}
	
	this.message_index = this.message_buffer_size-1;
	this.message_rows = Math.round(this.hud.message_box_height/BASE_FONT_SIZE)-1;
	
	/* The message box competes for space with other widgets */
	this.active = true;
}

Message.prototype = Object.create(MessageBase.prototype);

Message.prototype.message_buffer_size = 64;
Message.prototype.message_log = [];
Message.prototype.hud = 0; /* parent pointer unknown during prototyping */

/* Draw the message log to the window */
Message.prototype.render = function() {
	
	if (!this.active) { return; }
	
	var i;
	var num = this.message_index;
	this.message_rows = Math.round(this.hud.message_box_height/this.font_size)-1;
	this.clear_message_window();
	animation_context.font = this.font_size+"px Courier";
	animation_context.fillStyle = FG_COLOR;
	animation_context.textAlign = "left";
	for (i=0; i<this.message_rows; i++) {
		animation_context.fillText(this.message_log[num],this.hud.message_box_x+5,this.hud.message_box_y+this.font_size+i*this.font_size);
		num = (++num) % this.message_buffer_size;
	}
	
	this.hud.message_dirty = false;
};

/* Add a message to the log */
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

/**
 * Project Jakutos
 *
 *  Copyright 2016 by MaiZure <maizure@member.fsf.org>
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
 
function Message(hud_instance)
{
	this.hud = hud_instance; /* save parent pinter */
}

Message.prototype.message_log = ["first","2","third","4","5","6","7","8","9","10"];
Message.prototype.message_index = 5;
Message.prototype.hud = 0 /* parent pointer unknown during prototyping */

Message.prototype.render = function()
{
	var i;
	var num = this.message_index
	for (i=0; i<10; i++)
	{
		animation_context.font = BASE_FONT_SIZE+" Courier";
		animation_context.fillStyle = FG_COLOR;
		animation_context.textAlign = "left";
		animation_context.fillText(this.message_log[num],this.hud.message_box_x+5,this.hud.message_box_y+24+i*24);	
		num=(++num)%10;
	}
}

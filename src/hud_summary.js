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

function Summarywidget(hud_instance)
{
	MessageBase.call(this, hud_instance);
	
	this.hud = hud_instance;
	this.party = Party;
	this.current_party_member = -1;
	
}

Summarywidget.prototype = Object.create(MessageBase.prototype);

Summarywidget.prototype.render = function()
{
	this.clear_message_window();
	this.render_line(1, this.party.member[this.party.active_partymember].name + ":");
	this.render_line(3, "Future summary statistics");
}


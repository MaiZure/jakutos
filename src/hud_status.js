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
 
function Status(hud_instance) {
	this.hud = hud_instance;
	this.dirty = true;
	this.status = "";
	this.year = 1165;
	this.month = 1;
	this.day = 1;
	this.hour = 9;
	this.minute = 0;
	this.second = 0;
}

Status.prototype.render = function() {
	if (this.dirty) {
		var font_size = Math.round(this.hud.status_bar_height*0.80);
		this.clear_status_bar();
		this.status = this.update_status();
		animation_context.font = font_size+"px Sans-Serif";
		animation_context.fillStyle = "rgb(240,240,240)";
		animation_context.textAlign = "center";
		animation_context.fillText(this.status,this.hud.status_bar_x+this.hud.view_px_width/2,this.hud.status_bar_y+font_size);
		
		this.dirty = false;
	}
};

Status.prototype.clear_status_bar = function() {
	animation_context.clearRect(this.hud.view_px_x,this.hud.status_bar_y,this.hud.view_px_width,this.hud.status_bar_height);
};

Status.prototype.get_day_name = function(day_number)
{
	switch (day_number) {
		case 1: return "Monday"; break;
		case 2: return "Tuesday"; break;
		case 3: return "Wednesday"; break;
		case 4: return "Thursday"; break;
		case 5: return "Friday"; break;
		case 6: return "Saturday"; break;
		case 7: return "Sunday"; break;
	}
};

Status.prototype.get_month_name = function(month_number)
{
	switch (month_number) {
		case 1: return "January"; break;
		case 2: return "February"; break;
		case 3: return "March"; break;
		case 4: return "April"; break;
		case 5: return "May"; break;
		case 6: return "June"; break;
		case 7: return "July"; break;
		case 8: return "August"; break;
		case 9: return "September"; break;
		case 10: return "October"; break;
		case 11: return "November"; break;
		case 12: return "December"; break;
	}
};

Status.prototype.get_month_name_short = function(month_number)
{
	switch (month_number) {
		case 1: return "Jan"; break;
		case 2: return "Feb"; break;
		case 3: return "Mar"; break;
		case 4: return "Apr"; break;
		case 5: return "May"; break;
		case 6: return "Jun"; break;
		case 7: return "Jul"; break;
		case 8: return "Aug"; break;
		case 9: return "Sep"; break;
		case 10: return "Oct"; break;
		case 11: return "Nov"; break;
		case 12: return "Dec"; break;
	}
};

Status.prototype.add_time = function(new_seconds, new_minutes = 0, new_hours = 0, new_days = 0, new_months = 0, new_years = 0)
{
	this.second += new_seconds;
	new_minutes += Math.floor(this.second/60);
	this.second = this.second % 60;
	
	this.minute += new_minutes;
	new_hours += Math.floor(this.minute/60);
	this.minute = this.minute % 60;
	
	this.hour += new_hours;
	new_days += Math.floor(this.hour/24);
	this.hour = this.hour % 24;
	
	this.day += new_days;
	new_months += Math.floor(this.day/30);
	this.day = this.day % 30;
	
	this.month += new_months;
	new_years += Math.floor(this.month/12);
	this.month = this.month % 12;
	
	this.year += new_years;
	
	if (this.day === 0) { this.day = 1; }
	if (this.month === 0) { this.month = 1; }
	
	if (new_minutes + new_hours + new_days + new_months + new_years) { 
		this.hud.dirty = true;
		this.dirty = true; 
	}
	
}

Status.prototype.update_status = function()
{
	var meridian = (this.hour < 12) ? "am": "pm";
	var extra_zero = this.minute < 10 ? "0" : "";
	var clock = this.hour % 12 + ":" + extra_zero + this.minute + meridian;
	return (this.get_day_name(this.day) + " " + clock + ". " + this.get_month_name_short(this.month) + " " + this.day + ", " + this.year);
}
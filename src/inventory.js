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

/* Abstract object that manages the inventory for one party member. 
   Connects Items to the player and associated statistics. Provides
   an interface for wearing, wielding, removing, and invoking items */
function Inventory(party_member)
{
	var i;
	
	this.backpack = [];
	this.wear = [];
	
	for (i=0; i<16; i++) {
		this.wear[i] = null;
	}
	
	this.party_member = party_member;
	
	/* Temporary equipment generation tests */
	for (var i=0; i<2; i++) {
		var test_item = new Item();
		this.backpack.push(test_item);
		this.wear_item(test_item);
	}
	
}

/* Need to incorporate dual wielding and multiple rings checks */
Inventory.prototype.wear_item = function(item) 
{	
	/* Check if the item is real */
	if (!item) { return; }
	
	/* Check if the item has a valid wear slot */
	if (!item.wearable) { return; }
	
	var slot = item.wearable;
	
	/* Remove item currently worn */
	if (this.wear[slot]) { this.remove_item(slot); }
	
	/* Wear the item */
	this.wear[item.wearable] = item;
	
	/* Remove it from the backpack */
	this.remove_from_backpack(item);
	
	/* Apply base statistics */
	this.apply_stats(item);
	
	/* Apply modifiers */
	this.apply_modifiers(item);
	
	Hud.inventory_dirty = true;
};

/* Takes an item or slot and calls the appropriate remove function */
Inventory.prototype.remove_item = function(target)
{
	/* No reference === no work */
	if (!target) { return false; }
	
	/* Call the appropriate helper function */
	if (typeof target === "object") { this.remove_by_item(target); }
	if (typeof target === "number") { this.remove_by_slot(target); }
	
	Hud.inventory_dirty = true;
};

/* Removes an item from a given slot and puts it in the backpack */
Inventory.prototype.remove_by_slot = function(slot) 
{	
	/* Get reference the item */
	var item = this.wear[slot];
	
	/* Add it to the backpack */
	this.backpack.push(item);
	
	/* Remove it from the body */
	this.wear[slot] = null;
	
	/* Remove base stats */
	this.remove_stats(item);

	/* Remove associated modifiers */
	this.remove_modifiers(item);
}

/* Removes an item by scanning all wear slots and puts it in the backpack */
Inventory.prototype.remove_by_item = function(item) 
{	
	var i;
	for (i=0;i<this.wear.length;i++) {
		if (this.wear[i] === item) {
			this.backpack.push(this.wear[i]);
			this.wear[i] = null;
			this.remove_stats(item);
			this.remove_modifiers(item);
		}
	}
}

/* Applies base stats to the player from an item */
Inventory.prototype.apply_stats = function(item) 
{
	this.apply_armor(this.party_member, item);
	this.apply_weapon(this.party_member, item);
};

/* Removes base stats from the player from an item */
Inventory.prototype.remove_stats = function(item) 
{
	this.remove_armor(this.party_member, item);
	this.remove_weapon(this.party_member, item);
};

/* Helper function to apply armor stats - called from apply_stats() */
Inventory.prototype.apply_armor = function(party_member, item) 
{
	if (!item.is_armor(item)) { return false; }
	party_member.armor += item.armor;
};

/* Helper function to remove armor stats - called from remove_stats() */
Inventory.prototype.remove_armor = function(party_member, item) 
{
	if (!item.is_armor(item)) { return false; }
	party_member.armor -= item.armor;
};

/* Helper function to apply weapon stats - called from apply_stats() */
Inventory.prototype.apply_weapon = function(party_member, item) 
{
	if (!item.is_weapon(item)) { return false; }
	party_member.die_num += item.die_num;
	party_member.die_side += item.die_side;
	party_member.die_bonus += item.die_bonus;
};

/* Helper function to remove weapon stats - called from remove_stats() */
Inventory.prototype.remove_weapon = function(party_member, item) 
{
	if (!item.is_weapon(item)) { return false; }
	party_member.die_num -= item.die_num;
	party_member.die_side -= item.die_side;
	party_member.die_bonus -= item.die_bonus;
};

/* Remove statistic modifiers from the party member */
Inventory.prototype.remove_modifiers = function(item) 
{
	var i, mod, stat, skill, resist, amount;
	
	/* Remove stat modifiers from player */
	for (i=0; i<item.stat_modifier.length; i++) {
		mod = item.stat_modifier[i];
		stat = mod[0];
		amount = mod[1];
		this.party_member.stat_mods[stat] -= amount;
	}
	
	/* Remove skill modifiers from player */
	for (i=0; i<item.skill_modifier.length; i++) {
		mod = item.skill_modifier[i];
		skill = mod[0];
		amount = mod[1];
		this.party_member.skill_mods[skill] -= amount;
	}
	
	/* Remove resist modifiers from player */
	for (i=0; i<item.resist_modifier.length; i++) {
		mod = item.resist_modifier[i];
		resist = mod[0];
		amount = mod[1];
		this.party_member.resist_mods[resist] -= amount;
	}
}

/* Add statistic modifiers from the party member  (COMBINE THIS WITH THE REMOVE PROCEDURE!)*/
Inventory.prototype.apply_modifiers = function(item) 
{
	var i, mod, stat, skill, resist, amount;
	
	/* Add stat modifiers to player */
	for (i=0; i<item.stat_modifier.length; i++) {
		mod = item.stat_modifier[i];
		stat = mod[0];
		amount = mod[1];
		this.party_member.stat_mods[stat] += amount;
	}
	
	/* Add skill modifiers to player */
	for (i=0; i<item.skill_modifier.length; i++) {
		mod = item.skill_modifier[i];
		skill = mod[0];
		amount = mod[1];
		this.party_member.skill_mods[skill] += amount;
	}
	
	/* Add resist modifiers to player */
	for (i=0; i<item.resist_modifier.length; i++) {
		mod = item.resist_modifier[i];
		resist = mod[0];
		amount = mod[1];
		this.party_member.resist_mods[resist] += amount;
	}
};

Inventory.prototype.remove_from_backpack = function(item) { 
	var index = this.backpack.indexOf(item);
	if (index !== -1) { this.backpack.splice(index,1); }
	Hud.inventory_dirty = true;
}
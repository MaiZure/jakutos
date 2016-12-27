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

/* Prototype for all items in the game. I'll try to implement all items using
   this basic object and not rely on inheritence like I've done elsewhere */
function Item()
{
	this.name = "Test Cloak"
	this.wearable = WEAR_CLOAK
	
	this.stat_modifier = [];
	this.skill_modifier = [];
	this.resist_modifier = [];
	this.type = 0;
	this.armor = 0;
	this.value = 0;
	this.level = 1;
	this.die_num = 0;
	this.die_side = 0;
	this.die_bonus = 0;
	this.description = "An item";
	this.broken = false;
	
	this.set_item(this.random_gear(), Math.ceil(Math.random()*4));
	
	this.add_item_stat_modifier(STAT_SPEED, 3);
	
};

/* Adds a stat modifier to an item as a [STAT, AMOUNT] tuple array */
Item.prototype.add_item_stat_modifier = function(modifier, amount) {
	this.stat_modifier.push([modifier,amount]);
};

/* Adds a skill modifier to an item as a [SKILL, AMOUNT] tuple array */
Item.prototype.add_item_skill_modifier = function(modifier, amount) {
	this.stat_skill.push([modifier,amount]);
};

/* Adds a resist modifier to an item as a [TYPE, AMOUNT] tuple array */
Item.prototype.add_item_resist_modifier = function(modifier, amount) {
	this.stat_resist.push([modifier,amount]);
};

Item.prototype.set_item = function(type, level) 
{
	this.type = type;
	this.level = level;
	
	this.set_base_stats(type, level);
	this.set_wear_location(type);
}

/* Type based check for armor */
Item.prototype.is_armor = function(item = this)
{
	switch (item.type) {
		case ITEM_SHIELD:
		case ITEM_HELM:
		case ITEM_CLOAK:
		case ITEM_LEATHER:
		case ITEM_CHAIN:
		case ITEM_PLATE:
		case ITEM_BOOTS:
		case ITEM_GAUNTLETS:
		case ITEM_RING:
		case ITEM_AMULET: return true; break;
		default: return false;
	}
};

/* Type based check for weapon */
Item.prototype.is_weapon = function(item = this)
{
	switch (item.type) {
		case ITEM_SWORD:
		case ITEM_BOW:
		case ITEM_AXE:
		case ITEM_CLUB:
		case ITEM_STAFF: return true; break;
		default: return false;
	}
};

/* Type based check for consumables */
Item.prototype.is_usable = function(item)
{
	switch (item.type) {
		case ITEM_POTION:
		case ITEM_WAND:
		case ITEM_POTION: return true; break;
		default: return false;
	}
};

/* This sets base item stats. It's a polymorphic procedure called during Item instantiation */
Item.prototype.set_base_stats = function(type, level) 
{
	this.type = type;
	
	switch (type) {
		case ITEM_SWORD: {
			switch (level) {
				case 1: this.name = "Longsword"; this.die_num = 3; this.die_side = 3; this.die_bonus = 0; this.value = 50; break;
				case 2: this.name = "Warrior Sword"; this.die_num = 3; this.die_side = 3; this.die_bonus = 3; this.value = 200; break;
				case 3: this.name = "Crusader Sword"; this.die_num = 3; this.die_side = 3; this.die_bonus = 6; this.value = 350; break;
				case 4: this.name = "Champion Sword"; this.die_num = 3; this.die_side = 3; this.die_bonus = 9; this.value = 500; break;
				case 5: this.name = "Lionheart Sword"; this.die_num = 3; this.die_side = 3; this.die_bonus = 12; this.value = 650; break;
			}
		} break;
		case ITEM_AXE: {
			switch (level) {
				case 1: this.name = "Hand Axe"; this.die_num = 4; this.die_side = 2; this.die_bonus = 0; this.value = 30; break;
				case 2: this.name = "Battle Axe"; this.die_num = 4; this.die_side = 2; this.die_bonus = 2; this.value = 100; break;
				case 3: this.name = "War Axe"; this.die_num = 4; this.die_side = 2; this.die_bonus = 5; this.value = 250; break;
				case 4: this.name = "Dwarven Axe"; this.die_num = 4; this.die_side = 2; this.die_bonus = 8; this.value = 400; break;
				case 5: this.name = "Supreme Axe"; this.die_num = 4; this.die_side = 2; this.die_bonus = 11; this.value = 550; break;
			}
		} break;
		case ITEM_STAFF: {
			switch (level) {
				case 1: 
				case 2: 
				case 3: this.name = "Staff"; this.die_num = 2; this.die_side = 4; this.die_bonus = 0; this.value = 40; break;
				case 4: this.name = "Emerald Staff"; this.die_num = 2; this.die_side = 4; this.die_bonus = 3; this.value = 250; break;
				case 5: this.name = "Power Staff"; this.die_num = 2; this.die_side = 4; this.die_bonus = 7; this.value = 500; break;
			}
		} break;
		case ITEM_CLUB: {
			switch (level) {
				case 1: 
				case 2: 
				case 3: this.name = "Club"; this.die_num = 1; this.die_side = 3; this.die_bonus = 0; this.value = 1; break;
				case 4: this.name = "Spiked Club"; this.die_num = 1; this.die_side = 3; this.die_bonus = 3; this.value = 40; break;
				case 5: this.name = "Killer Club"; this.die_num = 1; this.die_side = 3; this.die_bonus = 5; this.value = 100; break;
			}
		} break;
		case ITEM_BOW: {
			switch (level) {
				case 1: this.name = "Longbow"; this.die_num = 5; this.die_side = 2; this.die_bonus = 0; this.value = 100; break;
				case 2: this.name = "Elven Bow"; this.die_num = 5; this.die_side = 2; this.die_bonus = 2; this.value = 200; break;
				case 3: this.name = "Precision Bow"; this.die_num = 5; this.die_side = 2; this.die_bonus = 4; this.value = 300; break;
				case 4: this.name = "Magic Bow"; this.die_num = 5; this.die_side = 2; this.die_bonus = 6; this.value = 400; break;
				case 5: this.name = "Stellar Bow"; this.die_num = 5; this.die_side = 2; this.die_bonus = 8; this.value = 500; break;
			}
		} break;
		case ITEM_SHIELD: {
			switch (level) {
				case 1: this.name = "Wooden Shield"; this.armor = 4; this.value = 100; break;
				case 2: this.name = "Bronze Shield"; this.armor = 6; this.value = 200; break;
				case 3: this.name = "Steel Shield"; this.armor = 8; this.value = 300; break;
				case 4: this.name = "Spirit Shield"; this.armor = 12; this.value = 450; break;
				case 5: this.name = "Astral Shield"; this.armor = 18; this.value = 750; break;
			}
		} break;
		case ITEM_HELM: {
			switch (level) {
				case 1: this.name = "Helm"; this.armor = 2; this.value = 60; break;
				case 2: this.name = "Steel Helm"; this.armor = 6; this.value = 260; break;
				case 3: this.name = "Guardian Helm"; this.armor = 8; this.value = 460; break;
				case 4: this.name = "Defender Helm"; this.armor = 10; this.value = 660; break;
				case 5: this.name = "Angelic Helm"; this.armor = 12; this.value = 860; break;
			}
		} break;
		case ITEM_CLOAK: {
			switch (level) {
				case 1: this.name = "Leather Cloak"; this.armor = 1; this.value = 50; break;
				case 2: this.name = "Phantom Cloak"; this.armor = 3; this.value = 150; break;
				case 3: this.name = "Elven Cloak"; this.armor = 5; this.value = 250; break;
				case 4: this.name = "Cardinal Cloak"; this.armor = 7; this.value = 450; break;
				case 5: this.name = "Doomsday Cloak"; this.armor = 9; this.value = 750; break;
			}
		} break;
		case ITEM_LEATHER: {
			switch (level) {
				case 1: this.name = "Leather Armor"; this.armor = 4; this.value = 150; break;
				case 2: this.name = "Studded Leather"; this.armor = 6; this.value = 250; break;
				case 3: this.name = "Enchanted Leather"; this.armor = 10; this.value = 450; break;
				case 4: this.name = "Dragon Leather"; this.armor = 16; this.value = 750; break;
				case 5: this.name = "Imperial Leather"; this.armor = 24; this.value = 1150; break;
			}
		} break;
		case ITEM_CHAIN: {
			switch (level) {
				case 1: this.name = "Chain Mail"; this.armor = 8; this.value = 400; break;
				case 2: this.name = "Steel Chain Mail"; this.armor = 12; this.value = 600; break;
				case 3: this.name = "Noble Chain Mail"; this.armor = 18; this.value = 900; break;
				case 4: this.name = "Royal Chain Mail"; this.armor = 26; this.value = 1300; break;
				case 5: this.name = "Majestic Chain Mail"; this.armor = 36; this.value = 1800; break;
			}
		} break;
		case ITEM_PLATE: {
			switch (level) {
				case 1: this.name = "Plate Armor"; this.armor = 20; this.value = 1000; break;
				case 2: this.name = "Plate Armor"; this.armor = 20; this.value = 1000; break;
				case 3: this.name = "Steel Plate Armor"; this.armor = 28; this.value = 1400; break;
				case 4: this.name = "Steel Plate Armor"; this.armor = 28; this.value = 1400; break;
				case 5: this.name = "Golden Plate Armor"; this.armor = 54; this.value = 2700; break;
			}
		} break;
		case ITEM_BOOTS: {
			switch (level) {
				case 1: this.name = "Leather Boots"; this.armor = 2; this.value = 50; break;
				case 2: this.name = "Steel Boots"; this.armor = 6; this.value = 250; break;
				case 3: this.name = "Armored Boots"; this.armor = 8; this.value = 450; break;
				case 4: this.name = "Sterling Boots"; this.armor = 10; this.value = 650; break;
				case 5: this.name = "Ultimate Boots"; this.armor = 12; this.value = 850; break;
			}
		} break;
		case ITEM_GAUNTLETS: {
			switch (level) {
				case 1: this.name = "Gauntlets"; this.armor = 3; this.value = 100; break;
				case 2: this.name = "Knight Gauntlets"; this.armor = 6; this.value = 250; break;
				case 3: this.name = "Paladin Gauntlets"; this.armor = 8; this.value = 450; break;
				case 4: this.name = "Cavalier Gauntlets"; this.armor = 10; this.value = 650; break;
				case 5: this.name = "Ultimate Gauntlets"; this.armor = 12; this.value = 860; break;
			}
		} break;
		case ITEM_RING: {
			switch (level) {
				case 1: this.name = ""; this.value = 0; break;
				case 2: this.name = ""; this.value = 0; break;
				case 3: this.name = ""; this.value = 0; break;
				case 4: this.name = ""; this.value = 0; break;
				case 5: this.name = ""; this.value = 0; break;
			}
		} break;
		case ITEM_AMULET: {
			switch (level) {
				case 1: this.name = ""; this.value = 0; break;
				case 2: this.name = ""; this.value = 0; break;
				case 3: this.name = ""; this.value = 0; break;
				case 4: this.name = ""; this.value = 0; break;
				case 5: this.name = ""; this.value = 0; break;
			}
		} break;
		case ITEM_WAND: {
			switch (level) {
				case 1: this.name = ""; this.value = 0; break;
				case 2: this.name = ""; this.value = 0; break;
				case 3: this.name = ""; this.value = 0; break;
				case 4: this.name = ""; this.value = 0; break;
				case 5: this.name = ""; this.value = 0; break;
			}
		} break;
		case ITEM_INGREDIENT:
		case ITEM_SCROLL:
		case ITEM_POTION:
	}
};

Item.prototype.set_wear_location = function(type, override = 0) {
	if (!type) { return false; }
	
	if (override) { 
		this.wearable = override;
		return true; 
	}
	
	switch (type) {
		case ITEM_SWORD: this.wearable = WEAR_WIELD_SINGLE; break;
		case ITEM_AXE: this.wearable = WEAR_WIELD_SINGLE; break;
		case ITEM_STAFF: this.wearable = WEAR_WIELD_SINGLE; break;
		case ITEM_CLUB: this.wearable = WEAR_WIELD_SINGLE; break;
		case ITEM_BOW: this.wearable = WEAR_RANGED; break;
		case ITEM_SHIELD: this.wearable = WEAR_SHIELD; break;
		case ITEM_HELM: this.wearable = WEAR_HEAD; break;
		case ITEM_CLOAK: this.wearable = WEAR_CLOAK; break;
		case ITEM_LEATHER: this.wearable = WEAR_BODY; break;
		case ITEM_CHAIN: this.wearable = WEAR_BODY; break;
		case ITEM_PLATE: this.wearable = WEAR_BODY; break;
		case ITEM_BOOTS: this.wearable = WEAR_FEET; break;
		case ITEM_GAUNTLETS: this.wearable = WEAR_HANDS; break;
		case ITEM_RING: this.wearable = WEAR_FINGER; break;
		case ITEM_AMULET: this.wearable = WEAR_BECK; break;
		case ITEM_WAND: this.wearable = 0; break;
		case ITEM_INGREDIENT: this.wearable = 0; break;
		case ITEM_SCROLL: this.wearable = 0; break;
		case ITEM_POTION: this.wearable = 0; break;
	}
};

Item.prototype.random_armor_type = function() {
	switch (Math.floor(Math.random()*8)) {
		case 0: return ITEM_SHIELD; break;
		case 1: return ITEM_HELM; break;
		case 2: return ITEM_CLOAK; break;
		case 3: return ITEM_LEATHER; break;
		case 4: return ITEM_CHAIN; break;
		case 5: return ITEM_PLATE; break;
		case 6: return ITEM_BOOTS; break;
		case 7: return ITEM_GAUNTLETS; break;
	}
};

Item.prototype.random_weapon_type = function() {
	switch (Math.floor(Math.random()*5)) {
		case 0: return ITEM_SWORD; break;
		case 1: return ITEM_AXE; break;
		case 2: return ITEM_STAFF; break;
		case 3: return ITEM_BOW; break;
		case 4: return ITEM_CLUB; break;
	}
};

Item.prototype.random_gear = function() {
	switch (Math.floor(Math.random()*2)) {
		case 0: return this.random_armor_type(); break;
		case 1: return this.random_weapon_type(); break;
	}
}
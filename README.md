# jakutos
Project Jakutos is a Roguelike that I'm writing to learn both JavaScript the GitHub workflow. I've decided to use Might and Magic 6 as the model for this project.

current version: **0.4**

The current master branch is playable directly on [GitHub Pages][reference-id-for-github-pages]
[reference-id-for-github-pages]:http://maizure.github.io/jakutos/

##Implemented controls are as follows:  
Arrows for 4-direction movement  
M - Minimap (includes the whole MM6 main world)  
\+ and \- -zooming in and out  
A - Auto attack with best option.  
1,2,3,4 - swap to that party member.  

Right now, there is a default party with 4 different classes. Each has it's own attack spell and a bow for ranged fighting. All you can do right now is run around the world and fight randomly generated goblins. There's no way to heal yet. The party can die or go unconcious and you can't fight, but you can still move around on the map. Until the engine is fully developed, water is not an obstruction.

v0.4 branch in progress with quite a few more features.

##Tentative Roadmap
v0.5 - Character development, skills/levels. More monsters and better placement. Bootleg Bay  
v0.6 - Internal dungeon development (procedural? maybe). Free Haven  
v0.7 - Quest framework. Town interactions. Darkmoon, SilverCove, and Myst  
v0.8 - Character creation. Blackshire, Kreigspire, Frozen Highlands  
v0.9 - Content Content Content. Spells, Monsters, and Quests. Sweet Water, Eel Infested Waters  
v1.0 - Open to suggestion :)  


##Version Notes
---
--*v0.4---Dec 31, 2016------------------------------  
Added an Inventory system  
Added Items and Item generation  
Added more diverse colors in the world  
Avatar icon interactions for HUD views  
Inventory item hover popups  
Dragging items between party members  
General world beautification  
UI beautification  
Only obvious actions trigger time to pass  
Chests and other containers  
Monster spawning on the world map by class/type  
Castle Ironfist more developed  

--*v0.3---Dec 25, 2016------------------------------  
Progressive terrain climbing - falling hurts  
Player and monsters now cast attack spells.  
Monsters now have an AI (inactive, attacking and fleeing)  
Basic attack spells now in. Each default pary member has a different one  
Hitting 'A' now auto-attacks closest enemy  
Date and time tracked based on MM6 timeline  
New Sporogal now looks much more like the original  
Added a dev feature to edit maps in place  


--*v0.2---Dec 18, 2016-------------------------------  
Added a 'real' map to test based on Might & Magic 6  
Decided to design this project as a roguelike based on MM6  
Added HUD elements (party areas, message box, status bar, and hover bar)  
Refactored objects to be more JS style instead of C procedures  
Got the mouse involved  
Window is fully resizable  
Added actual monsters  
Cleaned up the minimap and made it an overlay popup  
Made the player a "party" with basic health stats  
Monsters have health  
Melee combat  
Party members cycle through active  
Removed animated motion for now  



--*v0.1---Dec 8, 2016-------------------------------  
The first published version...8 hours of sprint coding  
Working map with two canvas layers  
Multiple monsters with random AI (no interactions)  
A minimap  
Cardinal direction movement  
Animated motion [REMOVED IN v0.3]  


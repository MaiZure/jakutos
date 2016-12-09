#
 # Project Jakutos - .OBJ file to game map file extractor
 #
 #  Copyright 2016 by MaiZure <maizure@member.fsf.org>
 #
 # This file is part of the project Jakutos.
 # 
 # Some open source application is free software: you can redistribute 
 # it and/or modify it under the terms of the GNU General Public 
 # License as published by the Free Software Foundation, either 
 # version 3 of the License, or (at your option) any later version.
 # 
 # Some open source application is distributed in the hope that it will 
 # be useful, but WITHOUT ANY WARRANTY; without even the implied warranty 
 # of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 # 
 # You should have received a copy of the GNU General Public License
 # along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
 #
 # @license GPL-3.0+ <https://www.gnu.org/licenses/gpl.txt>
 #

data = open('../data/newsporigal.obj','r')
datalist = []
map={}
for linenum in range(16389):
	nextline = data.readline().split(' ')
	if linenum > 3:
		datalist.append(nextline)

data.close()
		
for entry in range(len(datalist)-1):
	xx = int((int(datalist[entry][1])+32768)/512)
	yy = int((int(datalist[entry][3])+32768)/512)
	zz = int(datalist[entry][2])
	if zz == 0: ch = '~'
	else: ch = str(int(zz/500))
	
	map[(xx,yy)]=ch
	
#PRINT OUT MAP
for i in range(128):
	line=''
	for j in range(128):
		line+=map[(j,i)]
	print(line,end="")
	
#output the map as a long long long line
outline = ""
for i in range(128):
	for j in range(128):
		outline+=map[(j,i)]
outfile = open('../data/newsporigal.dat','w')
outfile.write(outline)
outfile.close()	

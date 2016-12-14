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

outfile = open('../data/static_maps.js','w')
for map_num in range(1,16):
	data = open('../data/world_map_'+str(map_num)+'.obj','r')
	datalist = []
	map={}
	bigmap={}
	
	#Pull ground level
	for linenum in range(16389):
		nextline = data.readline().split(' ')
		if linenum > 3:
			datalist.append(nextline)
		
	
	#Apply ground data to map
	for entry in range(len(datalist)-1):
		xx = int((int(datalist[entry][1])+32768)/512)
		yy = int((int(datalist[entry][3])+32768)/512)
		zz = int(datalist[entry][2])
		map[(xx,yy)]=zz
		
	#Blow up the map 2x using a poor man's bilinear filtering
	#Init new map to some otherwise impossible number
	for i in range(256):
		for j in range(256):
			bigmap[(j,i)]=-2
	#Blow up the known points
	for i in range(128):
		for j in range(128):
			bigmap[((j-1)*2,(i-1)*2)]=map[(j,i)]
	#Interpolate the remaining positions (starting with odd horizontal rows)
	for i in range(0,256,2):
		for j in range(256):
			if bigmap[(j,i)] == -2:
				try: bigmap[(j,i)] = (bigmap[(j-1,i)]+bigmap[(j+1,i)])/2
				except: pass
	#Interpolate the original vertical columns
	for i in range(256):
		for j in range(0,256,2):
			if bigmap[(j,i)] == -2:
				try: bigmap[(j,i)] = (bigmap[(j,i-1)]+bigmap[(j,i+1)])/2
				except: pass
	#Interpolate remaining
	for i in range(256):
		for j in range(256):
			count = 0
			num_zero = 0
			if bigmap[(j,i)] == -2:
				try: 
					n = bigmap[(j,i-1)]
					if n == 0: num_zero+=1
					count+=1
				except: n = 0
				try: 
					s = bigmap[(j,i+1)]
					if s == 0: num_zero+=1
					count+=1
				except: s = 0
				try: 
					w = bigmap[(j-1,i)]
					if w == 0: num_zero+=1
					count+=1
				except: w = 0
				try: 
					e = bigmap[(j+1,i)]
					if e == 0: num_zero+=1
					count+=1
				except: e = 0
				bigmap[(j,i)]=int((n+s+w+e)/count)
				if num_zero >= 3:
					bigmap[(j,i)]=0
			
	
	#Find buildings by scanning for 
	for linenum in data:
		nextline = linenum.split(' ')
		if nextline[0] == 'v':
			vx = int((int(nextline[1])+32768)/256)-2
			vy = int((int(nextline[3])+32768)/256)-2
			vz = int(nextline[2])
			if vz > bigmap[(vx,vy)]:
				bigmap[(vx,vy)] = -1
				
	data.close()
		
	#Convert specific heights to a character A-Z
	for i in range(256):
		for j in range(256):
			if bigmap[(j,i)] == 0: bigmap[(j,i)] = '~'
			elif bigmap[(j,i)] == -1: bigmap[(j,i)] = '#'
			elif bigmap[(j,i)] == -2: bigmap[(j,i)] = '_'
			else: bigmap[(j,i)] = chr(int(bigmap[(j,i)]/200)+65)
	
	#PRINT OUT MAP
	for i in range(128):
		line=''
		for j in range(128):
			line+=bigmap[(j,i)]
		print(line,end="")	
		
	#output the map as a long long long line
	outline = "const WORLD_MAP_"+str(map_num)+" = \""
	for i in range(2,254):
		for j in range(2,254):
			outline+=bigmap[(j-2,i-2)]
	outline+="\""
	outfile.write(outline+"\n")
outfile.close()	

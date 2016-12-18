gc main.js | select -First 23 | Out-file ../game.js -Encoding ASCII -Force
ls -n *.js | % { gc $_ | select -skip 22 } | Out-file ../game.js -Append -Encoding ASCII -Force
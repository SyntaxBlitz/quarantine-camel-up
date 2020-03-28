![camel up preview demo image](https://raw.githubusercontent.com/syntaxblitz/quarantine-camel-up/master/readme-img.png)

The CODE is open-source. MIT licensed, sure, why not.

The GAME concept is not mine. It's published by Pegasus Spiele. The ART is most certainly not mine. It's also by those peeps.


Only plays on Chrome. Turns out CSS is not a good 3d engine

I forgot to --save when I npm installed (I know, I suck, right? I never forget that!) so you'll just have to figure out what you need and what you don't. Maybe package-lock.json will work. I dunno.

Run server.js on the server. Run `npm run-script build` to make the client build. You probably need to change the server address in comms.js. It's 3d. pretty cool stuff. Start the game by calling startGame() in your clientside browser console. skip a broken player's turn with skipTurn().

to restart the game just restart the server ok

people can spectate by joining after the game starts but it looks like sometimes it breaks if you do that? so I dunno. ez fix is mod the nextTurn() function to call itself and return early if the current player name is empty

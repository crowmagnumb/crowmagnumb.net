# FIFA World Cup Builder

## Create a new league/world cup

Create a new directory e.g. ```mkdir fifa20/laliga-v```
Add ```teams.csv``` file to that directory and then run...

```
node make_groups.js -c <category> -k <key>
```

e.g.

```
node make_groups.js -c fifa20 -k cascadia-ii -g 1 -m 2
node make_groups.js -c fifa20 -k wc-i -g 8 -m 1
```

which will generate the groups.json.

Now run ...

```
node update_standings.js -c <category> -k <key>
```

e.g.
```
node update_standings.js -c fifa20 -k laliga-i
```

This will give you an index.html file that you can use to look at the standing and see the next matches to play. As you play the matches, enter the results in the groups.json file and then re-run the above command to refresh index.html.

If you are playing a 32 team World Cup style tournament then when the group stages are done you can copy over a blank bracket file.

```
cp blank_bracket.html fifa19/<key>
```

Edit the brackets.html file with the results from the group stages. As games are played record the scores in the html file.
There is no automated code for building and updating the bracket.

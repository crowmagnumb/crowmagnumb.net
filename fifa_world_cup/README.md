# FIFA World Cup Builder

## Create a new world cup match

Then run

```
node make_groups.js -k <key> -f <teams.csv>
```

which will generate the groups.json.

Now run ...

```
node update_standings.js -k <key> -f fifa19/<teams.csv>
```

This will give you an index.html file that you can use to look at the standing and see the next matches to play. As you play the matches, enter the results in the groups.json file and then re-run the above command to refresh index.html.

If you are playing a 32 team World Cup style tournament then when the group stages are done you can copy over a blank bracket file.

```
cp blank_bracket.html fifa19/<key>
```

Edit the brackets.html file with the results from the group stages. As games are played record the scores in the html file.
There is no automated code for building and updating the bracket.

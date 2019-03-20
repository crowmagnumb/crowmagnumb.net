# FIFA World Cup Builder

## Create a new world cup match

```
mkdir wc-xx/
cp blank_bracket.html wc-xx/bracket.html
```

Where xx is the Roman Numeral of the world cup (could be xx!). I'm just starting at i and counting up (Romanly)

I found a website that had the strengths of all the FIFA International teams in order by decreasing strength. I put the first 8 into one "pot", the second 8 into another and so on. FIFI-19 has only 30 international teams and so I needed 2 more to get the full 32 game contingent so I added the Portland Timbers and the LA Galaxy to the list. Pick your two favorite teams and go. :) So create a file `wc-xx/pots.json` that similar to the following.

```
[
    [
        "Spain",
        "Belgium",
        "Germany",
        "France",
        "Italy",
        "Argentina",
        "Portugal",
        "England"
    ],
    [
        "Uruguay",
        "Brazil",
        "Netherlands",
        "Colombia",
        "Denmark",
        "Poland",
        "Austria",
        "Mexico"
    ],
    [
        "Russia",
        "Chile",
        "Switzerland",
        "Turkey",
        "Sweden",
        "Wales",
        "Cameroon",
        "Côte d'Ivoire"
    ],
    [
        "Norway",
        "Greece",
        "Slovenia",
        "Czech Republic",
        "Scotland",
        "United States",
        "Portland Timbers",
        "LA Galaxy"
    ]
]
```

Then run

```
node make_groups.js wc-xx
node make_group_schedule.js wc-xx
```

which will generate the groups.json, group_schedule.md, and group_matches.csv files.

You can print the group_schedule.md file (as html) so that you know who is playing. The first team is "home" (not that it matters really) and the "bold" team is the one you will play (as opposed to the AI). The group_matches.csv file simply provides an easy way to fill out the score of the result of each match. The last column is for the "Player Of The Match" (as determined by the best performing player on the winning side (or best player overall in case of a tie)).

As games are played, enter the results in the appropriate group_matches.csv file and run ...

```
node update_standings.js wc-xx
```

which will recreate the group_standings.html file.

When the group stages are done you can edit the brackets.html file directly with the results of the group stages.

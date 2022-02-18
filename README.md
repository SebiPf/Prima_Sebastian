# Prima_Sebastian

This is a game prototype what means it is not optimized.

Begin by clicking anywere on the screen
After that select which player you want to be by pressing a or d. (holding the button for like 1-2 sec should be enought)
Cube Color update will hit when there is a player turn change but score is always accurrad

Now for the Game. This is a 2 player game and the goale is to get as many points as you can. You get points if you are the last player to put a line around a Square.
If you score a Point you get an additional turn.
| Nr | Criterion       | Explanation  
|---:|-------------------|---------------------------------------------------------------------------------------------------------------------|
|  0 | Units and Positions | My 0 in in the middle of the map. This makes creating symetric maps easier. My 1 is the width of a line                                  |
|  1 | Hierarchy         | My first node is only used for sound since its a 2d game and that way the sound comes from the middle of the screen. All other elements a seperated into to groups lines and cubes what makes it easy to get all em´lements by calling all childrends of fpr example lines.                                                 |
|  2 | Editor            | To build small prototypes the editor is easier because you can see what you added to a node. If the strukture gets bigger, code is better since you can build more complex strucktures more easyliy.(My struckture would have been easyier to buld by code than by hand)                                    |
|  3 | Scriptcomponents  | My custom script component playes sound when a point is scored                                |
|  4 | Extend            | very usefull for the statemachine and VUI                     |
|  5 | Sound             | Sound is centered(attached to base) since its a 2d game. Background music plus sound when scoring a point.                    |
|  6 | VUI               | score board            |
|  7 | Event-System      | mainly used for clickevents to get the click to the right node change also used for net stuff |
|  8 | External Data     | Not really used but I implemented a statemachine to get 1 bonus point   |
|  9 | Light             | 1 Light source since static 2D game.                                                                       |
|  A | Physics           | No Physics               |
|  B | Net               | 2 Player Online Game funktionality                                                                       |
|  C | State Machines    | State Machine that changes the state of Components          |
|  D | Animation         | No Animations       




# Simulate a virtual forest.

The simulated forest will have 3 elements.
- Trees which can be a Sapling, Tree or Elder Tree.
- Lumberjacks
- Bears 

## Cycle of time:

The simulation will simulate by months(smallest unit of time in the simulation). Every 12 "ticks" represents a year. 

### Forest:

The forest will be a two dimensional forest. We will require an input of N to represent the size of the forest in a grid that is N x N in size. 

At each location you can hold Trees, Bears or Lumberjacks. 

10% of the Forest will hold a Lumberjack 
50% of the Forest will hold Trees (Trees can be one of 3 kinds and will start off as the middle one of "Tree") 
2% of the Forest will hold Bears.

## Events:

During the simulation there will be events. 

### Trees:

Every month a Tree has a 10% chance to spawn a new "Sapling". In a random open space adjacent to a Tree you have a 10% chance to create a "Sapling". For example a Tree in the middle of the forest has 8 other spots around it. One of these if they do not have a type of Tree in it will create a "Sapling".

After 12 months of being in existence a "Sapling" will be upgraded to a "Tree". A "Sapling" cannot spawn other trees until it has matured into a "Tree".

When a "Tree" has been around for 120 months it will become an "Elder Tree".

### Lumberjacks:

Lumberjacks each month will wander. They will move 3 times in a month (aone step in any adjacent direction). 
When the lumberjack moves if he encounters a Tree (not a sapling) he will stop and his wandering for that month comes to an end. He will then harvest the Tree for lumber. Remove the tree. Gain 1 piece of lumber. Lumberjacks will not harvest "Sapling". They will harvest an Elder Tree. Elder Trees are worth 2 pieces of lumber.

Every 12 months the amount of lumber harvested is compared to the number of lumberjacks in the forest. If the lumber collected equals or exceeds the amount of lumberjacks in the forest a new lumberjack is hired and randomly spawned in the forest. 
However if after a 12 month span the amount of lumber collected is below the number of lumberjacks then a lumberjack is let go to save money and 1 random lumberjack is removed from the forest. However you will never reduce your Lumberjack labor force below 1.

### Bears:

They wander the forest much like a lumberjack. Instead of 3 spaces a Bear will roam up to 5 spaces. If a bear comes across a Lumberjack he will stop his wandering for the month. 
The Bear will kill the lumberjack. The lumberjack will be removed from the forest 
We will track this as a "Maul" accident. During the course of 12 months if there 0 "Maul" accidents then the Bear population will increase by 1. 

Else, remove 1 random Bear. 
Note that if your Bear population reaches 0 bears then there will be no "Maul" accidents in the next year and so you will spawn 1 new Bear next year.

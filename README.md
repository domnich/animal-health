# animal-health

Hello, I'll implemented this test task in Angular way to see how I understand how Anugal works.

There is also one more good way how to implement it in non standart way and
imporeve performance and win in optimization when we will have 300-400-500 rows in the table.
The idea is to have a table row (ngFor) which will contains only td's with values interpolations only with
out out any additional EventsListener, @Output() etc.

We will have only one edit item component which will be placed directly near whole table. We will need to add one click event listener on the table html element. On click we can detect the position where we will
need to snap edit-component over <td> with text and also having data attrs on td element we can easy detect all needed for us information:
1) id
2) field
3) whole object
Knowing this info we can easelly manipulate with table data like remove/edit objects or object params in the table.. At the end we will receive module which will contains only few event listeners and few two way binding which will be really good for application in general

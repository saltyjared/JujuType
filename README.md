# JujuType
JujuType is a minimalist, speed typing game, inspired by [Monkeytype](https://monkeytype.com/). Instead of randomly generated words, JujuType prompts the player with quotes from popular anime *Jujutsu Kaisen*. JujuType was built using HTML, CSS, and JavaScript.

To play, click [here](https://saltyjared.github.io/JujuType/)!

## Reflection
JujuType was built out of the need to explore and learn web development basics, particularly through HTML/CSS/JavaScript. After battling choice paralysis among all the coding and project tutorials, I settled on following Coding with Dawid's [Build Typing Game with Javascript](https://www.youtube.com/watch?v=E_tZH9R_zi8&t=338s) tutorial. This tutorial, while straughtforward and succinct, does not properly implement the features of Monkeytype, despite being inspired by it. For example, correctly-typed words can be accessed via backspace, which is not allowed in the Monkeytype implementation. To expand my knowledge of web development, I took it upon myself to fix certain bugs and and add features that the video either does not mention or include. These improvements include: fixing the "New game" button to properly reset the timer, implementing the original typing conventions of Monkeytype, improving the "addClass" function to remove extra whitespaces in HTML element classes, and adding a "Dark theme" button.

What I gained from this project was a newfound sense of appreciation for programming as a whole. So much goes into the development of a simple game like this, such as remembering to reset the textbox scroll after starting a new game, correctly ordering the addition or removal of certain HTML element classes, or even just adding a button for social media links. This exposure to the process really opened my eyes to what web development and programming really is: meticulous, often frustrating, but most of all, rewarding. The feeling I felt when I was able to fix some of these issues made me appreciate the time I put into understanding what's happening, line-by-line. This project is by no means perfect, but putting a simple project like this on my GitHub page is a step forward to creating bigger and better things.

## Future Improvements
- Stylized, animated buttons for dark mode, new game
- Correctly implementing the "WPM" counter when a prompt is completed before the timer finishes

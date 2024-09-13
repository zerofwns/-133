/*

The Game Project

1 - Background Scenery

Use p5 drawing functions such as rect, ellipse, line, triangle and
point to draw the scenery as set out in the code comments. The items
should appear next to the text titles.

Each bit of scenery is worth two marks:

0 marks = not a reasonable attempt
1 mark = attempted but it's messy or lacks detail
2 marks = you've used several shape functions to create the scenery

I've given titles and chosen some base colours, but feel free to
imaginatively modify these and interpret the scenery titles loosely to
match your game theme.


WARNING: Do not get too carried away. If you're shape takes more than 5 lines
of code to draw then you've probably over done it.


*/

function setup()
{
	createCanvas(1024, 576);
}

function draw()
{
	background(100, 155, 255); //fill the sky blue

	noStroke();
	stroke(0);
	strokeWeight(0.5);
	fill(0,155,0);
	rect(0, 432, 1024, 144); //draw some green ground

	//1. a cloud in the sky
	//... add your code here

	noStroke();
	fill(255);
	circle(130, 100, 60);
	circle(270, 100, 60);
	circle(165, 100, 80);
	circle(235, 100, 80);
	circle(200, 100, 100);


	//2. a mountain in the distance
	//... add your code here

	noStroke();
	stroke(0);
	strokeWeight(0.5);
	fill(91);
	triangle(300, 432, 700, 432, 500, 128);
	noStroke();
	stroke(0);
	strokeWeight(0.5);
	fill(255);
	triangle(450, 204, 550, 204, 500, 128);

	//3. a tree
	//... add your code here

	noStroke();
	stroke(0);
	strokeWeight(0.5);
	fill(90, 69, 0);
	rect(900, 432, 30, -50);
    
	noStroke();
	stroke(0);
	strokeWeight(0.5);
	fill(0, 124, 37);
	triangle(865, 382, 965, 382, 915, 332);
	
	noStroke();stroke(0);
	strokeWeight(0.5);
	fill(0, 124, 37);
	triangle(865, 352, 965, 352, 915, 302);
	
	noStroke();stroke(0);
	strokeWeight(0.5);
	fill(0, 124, 37);
	triangle(865, 322, 965, 322, 915, 273);
	//4. a canyon
	//NB. the canyon should go from ground-level to the bottom of the screen

	//... add your code here

	noStroke();
	fill(107);
	ellipse(100, 500, 170, 110);
	
	noStroke();
	fill(0);
	arc(100, 500, 170, 110, TWO_PI, PI);
	
	noStroke();
	fill(0);
	ellipse(100, 500, 170, 90);

	//5. a collectable token - eg. a jewel, fruit, coins
	//... add your code here

	noStroke();
	stroke(0);
	strokeWeight(0.5);
	fill(255, 196, 0);
	circle(400, 460, 50);
	
	noStroke();
	fill(203, 208, 68);
	circle(400, 460, 45);
	
	noStroke();
	fill(203, 208, 68);
	stroke(131, 100, 0);
	strokeWeight(5)
	textSize(40);
	text("$", 389, 474);
}

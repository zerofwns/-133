let canyons = [];
let enemies = [];
let clouds = [];
let trees = [];
let g_over = new Audio('Sounds/g_over.mp3');
let jumpkill = new Audio('Sounds/jumpkill.mp3');
let bgmus = new Audio('Sounds/bgmus.mp3');
let soundVolume = 0.2;
let musicVolume = 0.1;
let soundVolumeSlider;

//stage
let stage = 0;

//character
let posX = 200;
let posY = 432;
let sizeX = 25;
let sizeY = 25;
let state = charFront;

let height = 144;
let width = 1024;

//speed
let moveSpeed = 4;

//jump
let jump = false;
let direction = 1;
let velocity = 2;
let jumpPower = 10;
let fallingSpeed = 4;
let minHeight = 432;
let maxHeight = 0;
let jumpCounter = 0;

function setup() 
{
    createCanvas(1024, 576);
     // Создание элементов интерфейса
    soundVolumeSlider = createSlider(0, 1, 1, 0.1);
    soundVolumeSlider.position(width - 140, height - 115);
    generateCanyons();
    generateEnemies();
    generateClouds();
    generateTrees();
}

function draw() {
    if (stage == 0){
        world();
        
        switch (state){
      case 'charJump':
        charJump();
        break;
      case 'charLeft':
        charLeft();
        break;
      case 'charRight':
        charRight();
        break;
      case 'charJumpLeft':
        charJumpLeft();
        break;
      case 'charJumpRight':
        charJumpRight();
        break;
      default:
        charFront();
        break;
    }
    // Обновляем врагов
    updateEnemies();
    gravity();
    charControl();
    console.log(key);
    updateClouds(); //обновление облаков
    bgmus.volume = soundVolumeSlider.value();
    g_over.volume = soundVolumeSlider.value();
    jumpkill.volume = soundVolumeSlider.value();
    }
}

//функция генерации леса
function generateTrees() {
    trees = [];
    for(let i = 0; i < 250; i++) {
        let trunkHeight = random(200, 300);
        let treeBaseY = random(380, 430); // Основание дерева на уровне платформы
        
        trees.push({
            x: random(-500, 1500),
            y: treeBaseY - trunkHeight, // Вершина кроны
            trunkBaseY: treeBaseY,
            height: random(400, 600),
            width: random(75, 125), // Узкие кроны
            trunkHeight: trunkHeight,
            trunkWidth: random(40, 60),
            color: color(random(20,40), random(80,160), random(20,40))
        });
    }
}

// Добавляем функцию генерации облаков
function generateClouds() {
    clouds = [];
    for(let i = 0; i < 5; i++) { // 5 облаков на экране
        let cloud = {
            x: random(-200, 1024),
            y: random(50, 200),
            speed: random(0.5, 1.5),
            circles: []
        };
        
        // Генерация кругов для облака
        let circlesCount = floor(random(2, 5));
        for(let j = 0; j < circlesCount; j++) {
            cloud.circles.push({
                size: random(30, 60),
                offsetX: random(-40, 40),
                offsetY: random(-20, 20)
            });
        }
        clouds.push(cloud);
    }
}

// Добавляем функцию обновления облаков
function updateClouds() {
    for(let cloud of clouds) {
        cloud.x += cloud.speed;
        
        // Перемещаем облако в начало при выходе за экран
        if(cloud.x > 1024 + 200) {
            cloud.x = -200;
            cloud.y = random(50, 200);
        }
    }
}

function updateEnemies() {
    for(let enemy of enemies) {
        if(enemy.active) {
            // Движение врагов с проверкой границ
            enemy.x = constrain(
                enemy.x + enemy.dir * enemy.speed,
                0,
                width - enemy.size
            );
            
            // Смена направления у краев
            if(enemy.x <= 0 || enemy.x >= width - enemy.size) {
                enemy.dir *= -1;
            }
        }
    }
}

// Функция генерации каньонов
function generateCanyons() {
    let x = 300; // Начальная позиция первого каньона
    while(x < width - 100) {
        let canyonWidth = random(80, 150);
        canyons.push({
            x: x,
            y: 432,
            width: canyonWidth,
            height: 144
        });
        x += canyonWidth + random(200, 300); // Расстояние между каньонами
    }
}

function generateEnemies() {
    for(let i = 0; i < 5; i++) {
        enemies.push({
            x: random(100, 924),
            y: 400,
            size: 30,
            dir: random() < 0.5 ? -1 : 1,
            speed: 2,
            active: true
        });
    }
}

function gravity() {
    let onSolidGround = true;
    let currentCanyon = null;
    
    // Проверяем, стоит ли персонаж над каньоном
    for(let canyon of canyons) {
        if(posX > canyon.x && posX < canyon.x + canyon.width) {
            onSolidGround = false;
            currentCanyon = canyon;
            break;
        }
    }
    
    // Проверка смерти при погружении на 1/10 высоты каньона
    if(currentCanyon && posY > currentCanyon.y + currentCanyon.height/10) {
        g_over.play();
        // Респавн персонажа
        posX = 200;
        posY = 432;
        jump = false;
        velocity = fallingSpeed;
        return; // Прерываем выполнение функции для этого кадра
    }
    
    // Проверка столкновения с врагами
    for(let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        if(enemy.active && checkEnemyCollision(enemy)) {
            if(isJumpingOnEnemy(enemy)) {
                jumpkill.play();
                // Уничтожение врага с усиленным отскоком
                enemies.splice(i, 1);
                velocity = -jumpPower * 1.2; // Увеличенная сила отскока
                jump = true;
                jumpCounter = 0;
            } else {
                g_over.play();
                // Смерть персонажа при любом другом столкновении
                posX = 200;
                posY = 432;
                jump = false;
                velocity = fallingSpeed;
                return;
            }
        }
    }
    
    if(onSolidGround) {
        minHeight = 432;
    } else {
        minHeight = 600;
    }
    
     for(let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        if(enemy.active && checkEnemyCollision(enemy)) {
            if(isJumpingOnEnemy(enemy)) {
                // Уничтожение врага
                enemies.splice(i, 1);
                // Отскок персонажа
                velocity = -jumpPower/1.5;
                jump = true;
            } else {
                // Смерть персонажа
                posX = 200;
                posY = 432;
                jump = false;
                return;
            }
        }
    }
    
     // Оригинальная логика гравитации без изменений
    if(posY >= minHeight && jump == false){
        posY = minHeight;
        jumpCounter = 0;
        state = 'charFront';
    }
    else {
        posY = posY + (direction * velocity);  
    }
    
    if(jump){
        if(posY <= maxHeight || jumpCounter >= jumpPower){
            if(posY >= minHeight){
                posY = minHeight;
                jump = false;
            }
            else {
                velocity = fallingSpeed;
            }
        }
        else {
            velocity = -jumpPower;
            jumpCounter = jumpCounter + 1;
        }
    }
    else {
        velocity = fallingSpeed;
    }
}

// Добавляем проверку столкновения с врагом
function checkEnemyCollision(enemy) {
    return (posX + 15 > enemy.x &&
            posX - 15 < enemy.x + enemy.size &&
            posY - 100 < enemy.y + enemy.size &&
            posY > enemy.y);
}

// Добавляем проверку прыжка на врага
function isJumpingOnEnemy(enemy) {
    return (posY + velocity < enemy.y + 10 &&
            posY + velocity + 20 > enemy.y);
}

function charControl() {
    if (keyIsDown(UP_ARROW)) {
        jump = true;
        state = 'charJump';
    }
    if (keyIsDown(DOWN_ARROW)) {
        state = 'charFront';
    }
    
    // Ограничение движения по горизонтали с учетом размера персонажа
    let newX = posX;
    
    if (keyIsDown(RIGHT_ARROW)) {
        if (keyIsDown(UP_ARROW)) {
            newX += moveSpeed;
            jump = true;
            state = 'charJumpRight';
        } else {
            newX += moveSpeed;
            state = 'charRight';
        }
    }
    if (keyIsDown(LEFT_ARROW)) {
        if (keyIsDown(UP_ARROW)) {
            newX -= moveSpeed;
            jump = true;
            state = 'charJumpLeft';
        } else {
            newX -= moveSpeed;
            state = 'charLeft';
        }
    }
    
    // Ограничение позиции персонажа в пределах экрана
    posX = constrain(newX, 15, width - 15);
}

function charFront()
{
    noStroke();
    fill(0, 0, 0);
    circle(posX, posY - 100, 29); //head
    stroke(0, 0, 0);
    strokeWeight(8);
    line(posX, posY - 100, posX , posY - 50); //body
    line(posX, posY - 90, posX + 8 , posY - 70); //right hand 
    line(posX, posY - 90, posX - 10 , posY - 70); //left hand
    line(posX - 10, posY - 70, posX - 10 , posY - 50); //left hand_s
    line(posX + 8, posY - 70, posX + 10 , posY - 50); //right hand_s
    line(posX, posY - 55, posX - 5 , posY - 30); //left leg
    line(posX, posY - 55, posX + 5 , posY - 30); //right leg
    line(posX - 5, posY - 30, posX - 8 , posY); //left knee
    line(posX + 5, posY - 30, posX + 8 , posY); //right knee
}

function charRight()
{
    noStroke();
    fill(0, 0, 0);
    circle(posX, posY - 100, 29); //head
    stroke(0, 0, 0);
    strokeWeight(8);
    line(posX, posY - 100, posX , posY - 50); //body
    line(posX, posY - 90, posX + 10 , posY - 70); //right hand 
    line(posX, posY - 90, posX - 12, posY - 70); //left hand
    line(posX - 12, posY - 70, posX - 11, posY - 50); //left hand_s
    line(posX + 10, posY - 70, posX + 20 , posY - 55); //right hand_s
    line(posX, posY - 55, posX , posY - 30); //left leg
    line(posX, posY - 55, posX + 7, posY - 30); //right leg
    line(posX, posY - 30, posX - 12 , posY); //left knee
    line(posX + 7, posY - 30, posX + 8 , posY); //right knee
}

function charLeft()
{
    noStroke();
    fill(0, 0, 0);
    circle(posX, posY - 100, 29); //head
    stroke(0, 0, 0);
    strokeWeight(8);
    line(posX, posY - 100, posX , posY - 50); //body
    line(posX, posY - 90, posX + 12, posY - 70); //right hand 
    line(posX, posY - 90, posX - 10, posY - 70); //left hand
    line(posX - 10, posY - 70, posX - 20, posY - 55); //left hand_s
    line(posX + 12, posY - 70, posX + 11, posY - 50); //right hand_s
    line(posX, posY - 55, posX - 7, posY - 30); //left leg
    line(posX, posY - 55, posX , posY - 30); //right leg
    line(posX - 7, posY - 30, posX - 8, posY); //left knee
    line(posX , posY - 30, posX + 12, posY); //right knee
    
}

function charJump()
{
    noStroke();
    fill(0, 0, 0);
    circle(posX, posY - 100, 29); //head
    stroke(0, 0, 0);
    strokeWeight(8);
    line(posX, posY - 100, posX , posY - 50); //body
    line(posX, posY - 85, posX + 20 , posY - 80); //right hand 
    line(posX, posY - 85, posX - 20 , posY - 80); //left hand
    line(posX - 20, posY - 80, posX - 35 , posY - 80); //left hand_s
    line(posX + 20, posY - 80, posX + 35 , posY - 80); //right hand_s
    line(posX, posY - 55, posX - 15 , posY - 30); //left leg
    line(posX, posY - 55, posX + 15 , posY - 30); //right leg
    line(posX - 15, posY - 30, posX - 8 , posY); //left knee
    line(posX + 15, posY - 30, posX + 8 , posY); //right knee
}

function charJumpRight()
{
    noStroke();
    fill(0, 0, 0);
    circle(posX + 10, posY - 100, 29); //head
    stroke(0, 0, 0);
    strokeWeight(8);
    line(posX + 10, posY - 100, posX , posY - 50); //body
    line(posX +10, posY - 90, posX + 8 +10, posY - 70); //right hand 
    line(posX +10, posY - 90, posX - 17 +10 , posY - 80); //left hand
    line(posX - 17 +10, posY - 80, posX - 10, posY - 60); //left hand_s
    line(posX + 8 +10, posY - 70, posX + 20 +10, posY - 80); //right hand_s
    line(posX, posY - 55, posX, posY - 30); //left leg
    line(posX, posY - 55, posX + 20, posY - 30); //right leg
    line(posX, posY - 30, posX - 30, posY); //left knee
    line(posX + 20, posY - 30, posX + 8, posY); //right knee
}

function charJumpLeft()
{
    noStroke();
    fill(0, 0, 0);
    circle(posX, posY - 100, 29); //head
    stroke(0, 0, 0);
    strokeWeight(8);
    line(posX, posY - 100, posX , posY - 50); //body
    line(posX, posY - 90, posX + 17 , posY - 80); //right hand 
    line(posX, posY - 90, posX - 8 , posY - 70); //left hand
    line(posX - 8, posY - 70, posX - 20 , posY - 80); //left hand_s
    line(posX + 17, posY - 80, posX + 10 , posY - 60); //right hand_s
    line(posX, posY - 55, posX - 20, posY - 30); //left leg
    line(posX, posY - 55, posX, posY - 30); //right leg
    line(posX - 20, posY - 30, posX - 8, posY); //left knee
    line(posX, posY - 30, posX + 30 , posY); //right knee
}

function world() {
    background(0, 222, 255);
    
    bgmus.play();
    
    // Рисуем лес
    noStroke();
    for(let tree of trees) {
        // Ствол
        fill(101, 67, 33);
        rect(tree.x, tree.y + tree.trunkHeight, tree.trunkWidth, tree.trunkHeight);
        
        // Крона
        fill(tree.color);
        triangle(
            tree.x - tree.width/2, tree.y + tree.trunkHeight,
            tree.x + tree.width/2, tree.y + tree.trunkHeight,
            tree.x, tree.y
        );
    }
    
    // Рисуем облака
    fill(255);
    noStroke();
    for(let cloud of clouds) {
        for(let circle of cloud.circles) {
            ellipse(
                cloud.x + circle.offsetX, 
                cloud.y + circle.offsetY, 
                circle.size
            );
        }
    }
    
    // Рисуем основную платформу
    noStroke();
    fill(0, 171, 63);
    rect(0, 432, 1024, 144);
    
    // Рисуем каньоны
    fill(49, 77, 81);
    for(let canyon of canyons) {
        rect(canyon.x, canyon.y, canyon.width, canyon.height);
    }
    
    // Рисуем врагов
    fill(0, 0, 255);
    for(let enemy of enemies) {
        if(enemy.active) {
            rect(enemy.x, enemy.y, enemy.size, enemy.size);
        }
    }
}
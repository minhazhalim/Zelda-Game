document.addEventListener('DOMContentLoaded',() => {
     const grid = document.getElementById('grid');
     const scoreDisplay = document.getElementById('score');
     const levelDisplay = document.getElementById('level');
     const enemyDisplay = document.getElementById('enemies');
     const width = 10;
     const tileSize = 48;
     const squares = [];
     let score = 0;
     let level = 0;
     let playerPosition = 40;
     let enemies = [];
     let playerDirection = 'right';
     let gameRunning = true;
     const maps = [
          [
               'ycc)cc^ccw',
               'a        b',
               'a      * b',
               'a    (   b',
               '%        b',
               'a    (   b',
               'a  *     b',
               'a        b',
               'xdd)dd)ddz'
          ],
          [
               'yccccccccw',
               'a        b',
               ')        )',
               'a        b',
               'a        b',
               'a    $   b',
               ')   }    )',
               'a        b',
               'xddddddddz',
          ],
     ];
     function createPlayer(){
          const div = document.createElement('div');
          div.classList.add('link-going-right');
          div.id = 'player';
          div.style.left = `${(playerPosition % width) * tileSize}px`;
          div.style.top = `${Math.floor(playerPosition / width) * tileSize}px`;
          grid.appendChild(div);
     }
     function createSlicer(x,y){
          const div = document.createElement('div');
          div.classList.add('slicer');
          div.style.left = `${x * tileSize}px`;
          div.style.top = `${y * tileSize}px`;
          const slicer = {
               x,
               y,
               direction: -1,
               type: 'slicer',
               element: div,
          };
          enemies.push(slicer);
          grid.appendChild(div);
     }
     function createSkeletor(x,y){
          const div = document.createElement('div');
          div.classList.add('skeletor');
          div.style.left = `${x * tileSize}px`;
          div.style.top = `${y * tileSize}px`;
          const skeletor = {
               x,
               y,
               direction: -1,
               timer: Math.random() * 5,
               type: 'skeletor',
               element: div,
          };
          enemies.push(skeletor);
          grid.appendChild(div);
     }
     function canMoveTo(position){
          if(position < 0 || position >= squares.length) return false;
          const square = squares[position];
          return !square.classList.contains('left-wall') &&
                    !square.classList.contains('right-wall') &&
                    !square.classList.contains('top-wall') &&
                    !square.classList.contains('bottom-wall') &&
                    !square.classList.contains('top-left-wall') &&
                    !square.classList.contains('top-right-wall') &&
                    !square.classList.contains('bottom-left-wall') &&
                    !square.classList.contains('bottom-right-wall') &&
                    !square.classList.contains('lanterns') &&
                    !square.classList.contains('fire-pot');
     }
     function isWall(x,y){
          const position = y * width + x;
          if(position < 0 || position >= squares.length) return true;
          const square = squares[position];
          return square.classList.contains('left-wall') ||
                    square.classList.contains('right-wall') ||
                    square.classList.contains('top-wall') ||
                    square.classList.contains('bottom-wall') ||
                    square.classList.contains('top-left-wall') ||
                    square.classList.contains('top-right-wall') ||
                    square.classList.contains('bottom-left-wall') ||
                    square.classList.contains('bottom-right-wall') ||
                    square.classList.contains('lanterns') ||
                    square.classList.contains('fire-pot');
     }
     function updateDisplays(){
          scoreDisplay.innerHTML = score;
          levelDisplay.innerHTML = level + 1;
          enemyDisplay.innerHTML = enemies.length;
     }
     function showTemporaryMessage(message,color,duration){
          const temporaryMessage = document.getElementById('temporary-message');
          if(temporaryMessage) temporaryMessage.remove();
          const div = document.createElement('div');
          div.id = 'temporary-message';
          div.textContent = message;
          div.style.color = color;
          grid.appendChild(div);
          setTimeout(() => {
               if(div.parentNode){
                    div.remove();
               }
          },duration);
     }
     function createBoard(){
          gameRunning = true;
          grid.innerHTML = "";
          squares.length = 0;
          enemies = [];
          const currentMap = maps[level];
          for(let i = 0;i < 9;i++){
               for(let j = 0;j < 10;j++){
                    const square = document.createElement('div');
                    square.setAttribute('id',i * width + j);
                    const character = currentMap[i][j];
                    addMapElement(square,character,j,i);
                    grid.appendChild(square);
                    squares.push(square);
               }
          }
          createPlayer();
          updateDisplays();
     }
     createBoard();
     function addMapElement(square,character,x,y){
          switch(character){
               case 'a':
                    square.classList.add('left-wall');
                    break;
               case 'b':
                    square.classList.add('right-wall');
                    break;
               case 'c':
                    square.classList.add('top-wall');
                    break;
               case 'd':
                    square.classList.add('bottom-wall');
                    break;
               case 'w':
                    square.classList.add('top-right-wall');
                    break;
               case 'x':
                    square.classList.add('bottom-left-wall');
                    break;
               case 'y':
                    square.classList.add('top-left-wall');
                    break;
               case 'z':
                    square.classList.add('bottom-right-wall');
                    break;
               case '%':
                    square.classList.add('left-door');
                    break;
               case '^':
                    square.classList.add('top-door');
                    break;
               case '$':
                    square.classList.add('stairs');
                    break;
               case ')':
                    square.classList.add('lanterns');
                    break;
               case '(':
                    square.classList.add('fire-pot');
                    break;
               case '*':
                    createSlicer(x,y);
                    break;
               case '}':
                    createSkeletor(x,y);
                    break;
          }
     }
     function movePlayer(direction){
          const playerElement = document.getElementById('player');
          let newPosition = playerPosition;
          switch(direction){
               case 'left':
                    if(playerPosition % width !== 0) newPosition = playerPosition - 1;
                    playerElement.className = 'link-going-left';
                    playerDirection = 'left';
                    break;
               case 'right':
                    if(playerPosition % width !== width - 1) newPosition = playerPosition + 1;
                    playerElement.className = 'link-going-right';
                    playerDirection = 'right';
                    break;
               case 'up':
                    if(playerPosition - width >= 0) newPosition = playerPosition - width;
                    playerElement.className = 'link-going-up';
                    playerDirection = 'up';
                    break;
               case 'down':
                    if(playerPosition + width < width * 9) newPosition = playerPosition + width;
                    playerElement.className = 'link-going-down';
                    playerDirection = 'down';
                    break;
          }
          if(canMoveTo(newPosition)){
               const square = squares[newPosition];
               if(square.classList.contains('left-door')){
                    square.classList.remove('left-door');
               }
               if(square.classList.contains('top-door') || square.classList.contains('stairs')){
                    if(enemies.length === 0) nextLevel();
                    else showEnemiesRemainingMessage();
                    return;
               }
               playerPosition = newPosition;
               playerElement.style.left = `${(playerPosition % width) * tileSize}px`;
               playerElement.style.top = `${Math.floor(playerPosition / width) * tileSize}px`;
               checkPlayerEnemyCollision();
          }
     }
     function spawnKaboom(){
          let kaboomX = playerPosition % width;
          let kaboomY = Math.floor(playerPosition / width);
          switch(playerDirection){
               case 'left':
                    kaboomX -= 1;
                    break;
               case 'right':
                    kaboomX += 1;
                    break;
               case 'up':
                    kaboomY -= 1;
                    break;
               case 'down':
                    kaboomY += 1;
                    break;
          }
          if(kaboomX >= 0 && kaboomX < width && kaboomY >= 0 && kaboomY < 9){
               const div = document.createElement('div');
               div.className = 'kaboom';
               div.style.left = `${kaboomX * tileSize}px`;
               div.style.top = `${kaboomY * tileSize}px`;
               grid.appendChild(div);
               checkKaboomEnemyCollision(kaboomX,kaboomY);
               setTimeout(() => {
                    if(div.parentNode){
                         div.parentNode.removeChild(div);
                    }
               },1000);
          }
     }
     function checkKaboomEnemyCollision(kaboomX,kaboomY){
          for(let i = enemies.length - 1;i >= 0;i--){
               const enemy = enemies[i];
               const enemyX = Math.round(enemy.x);
               const enemyY = Math.round(enemy.y);
               if(enemyX === kaboomX && enemyY === kaboomY){
                    if(enemy.element.parentNode){
                         enemy.element.parentNode.removeChild(enemy.element);
                    }
                    enemies.splice(i,1);
                    score++;
                    updateDisplays();
                    break;
               }
          }
     }
     function checkPlayerEnemyCollision(){
          const playerX = playerPosition % width;
          const playerY = Math.floor(playerPosition / width);
          for(const enemy of enemies){
               const enemyX = Math.round(enemy.x);
               const enemyY = Math.round(enemy.y);
               if(enemyX === playerX && enemyY === playerY){
                    gameOver();
                    return;
               }
          }
     }
     function moveEnemies(deltaTime){
          for(const enemy of enemies){
               if(enemy.type === 'slicer'){
                    moveSlicer(enemy,deltaTime);
               }else if(enemy.type === 'skeletor'){
                    moveSkeletor(enemy,deltaTime);
               }
          }
     }
     function moveSlicer(slicer,deltaTime){
          const speed = 2 * deltaTime;
          const newX = slicer.x + (slicer.direction * speed);
          const y = Math.round(slicer.y);
          if(newX < 0 || newX >= width || isWall(Math.round(newX),y)){
               slicer.direction *= -1;
          }else slicer.x = newX;
          slicer.element.style.left = `${slicer.x * tileSize}px`;
     }
     function moveSkeletor(skeletor,deltaTime){
          const speed = 1.5 * deltaTime;
          skeletor.timer -= deltaTime;
          if(skeletor.timer <= 0){
               skeletor.direction *= -1;
               skeletor.timer = Math.random() * 5;
          }
          const newY = skeletor.y + (skeletor.direction * speed);
          const x = Math.round(skeletor.x);
          if(newY < 0 || newY >= 9 || isWall(x,Math.round(newY))){
               skeletor.direction *= -1;
          }else skeletor.y = newY;
          skeletor.element.style.top = `${skeletor.y * tileSize}px`;
     }
     function nextLevel(){
          level = (level + 1) % maps.length;
          createBoard();
     }
     function showEnemiesRemainingMessage(){
          grid.style.filter = 'hue-rotate(0deg) saturate(2) brightness(1.5)';
          grid.style.boxShadow = '0px 0px 20px red';
          setTimeout(() => {
               grid.style.filter = "";
               grid.style.boxShadow = "";
          },300);
          showTemporaryMessage('Defeat All Enemies First!','red',2000);
     }
     document.addEventListener('keydown',(event) => {
          if(!gameRunning) return;
          switch(event.code){
               case 'ArrowLeft':
                    event.preventDefault();
                    movePlayer('left');
                    break;
               case 'ArrowRight':
                    event.preventDefault();
                    movePlayer('right');
                    break;
               case 'ArrowUp':
                    event.preventDefault();
                    movePlayer('up');
                    break;
               case 'ArrowDown':
                    event.preventDefault();
                    movePlayer('down');
                    break;
               case 'Space':
                    event.preventDefault();
                    spawnKaboom();
                    break;
          }
     });
     let lastTime = 0;
     let animationID;
     function gameLoop(currentTime){
          const deltaTime = (currentTime - lastTime) / 1000;
          lastTime = currentTime;
          if(gameRunning && deltaTime < 0.1){
               moveEnemies(deltaTime);
               checkPlayerEnemyCollision();
          }
          animationID = requestAnimationFrame(gameLoop);
     }
     function gameOver(){
          gameRunning = false;
          showTemporaryMessage(`Game Over!! Final Score: ${score}`,'white',3000);
     }
     animationID = requestAnimationFrame(gameLoop);
});
class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 }, sprites, name,}) {
    this.position = position;
    this.initialX = position.x; // Сохраняем исходную позицию x
    this.initialY = position.y; // Сохраняем исходную позицию y
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height / this.frames.max;
    };
    this.animate = animate;
    this.sprites = sprites;
    this.name = name;
  }


  draw() {
    
    context.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
      
    ); 

    if (!this.moving) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }

    if (this.frames.elapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }

    if (this.health >= 0) {
        context.fillStyle = "green";
        context.fillRect(this.position.x, this.position.y - 10, this.width * (this.health / 100), 5);
    }

    if (this.health >= 0) {
        context.fillStyle = "green";
        context.fillRect(this.position.x, this.position.y - 10, this.width * (this.health / 100), 5);
      }
  }

 

  attack({ attack, recipient }) {
    document.querySelector('#dialogueBox').style.display = 'block';
    document.querySelector('#dialogueBox').innerHTML = `${this.name} Использован ${attack.name}`;
    switch (attack.name) {
        case 'Дробящий':
            damageSound.play();
            this.position.x += 50;
            this.position.y -= 40;
            recipient.position.x += 20;
            recipient.position.y -= 20;
  
            const decreaseHealth = () => {
                let decreaseAmount = 1;
                
                let interval = setInterval(() => {
                    let enemyHealthBar = document.getElementById("enemyHealthBar");
                    let currentWidth = parseFloat(enemyHealthBar.style.width);
                    if (!isNaN(currentWidth) && currentWidth > 0) {
                        currentWidth -= decreaseAmount;
                        if (currentWidth < 0) {
                            currentWidth = 0;
                        }
                        enemyHealthBar.style.width = currentWidth + "%";
                        
                        // Проверка на 2%
                        if (currentWidth <= 2) {
                            animate(); // Возвращаемся в функцию animate()
                        }
                    }
                }, 100);
  
                setTimeout(() => {
                    clearInterval(interval);
                }, 2000);
            };
  
            decreaseHealth();
  
            setTimeout(() => {
                this.position.x = this.initialX;
                this.position.y = this.initialY;
                recipient.position.x = recipient.initialX;
                recipient.position.y = recipient.initialY;
            }, 200);
            
            break;
            
        case "Удар":
            damageSound.play();
            this.position.x -= 20;
            this.position.y -= 20;
            recipient.position.x += 20;
            recipient.position.y -= 20;

            if (Math.random() <= 0.3) {
                const myHealthBar = document.getElementById("myHealthBar");
                let currentWidth = parseFloat(myHealthBar.style.width);
                if (!isNaN(currentWidth)) {
                    currentWidth -= 30;
                    if (currentWidth < 0) {
                        currentWidth = 0;
                    }
                    myHealthBar.style.width = currentWidth + "%";
                    
                    // Проверка на 2%
                    if (currentWidth <= 2) {
                        animate(); // Возвращаемся в функцию animate()
                    }
                }
            }

            let enemyHealthBar = document.getElementById("enemyHealthBar");
            let currentWidth = parseFloat(enemyHealthBar.style.width);
            if (!isNaN(currentWidth)) {
                currentWidth -= 15;
                if (currentWidth < 0) {
                    currentWidth = 0;
                }
                enemyHealthBar.style.width = currentWidth + "%";
                
                // Проверка на 2%
                if (currentWidth <= 2) {
                    animate(); // Возвращаемся в функцию animate()
                }
            }

            setTimeout(() => {
                this.position.x = this.initialX;
                this.position.y = this.initialY;
                recipient.position.x = recipient.initialX;
                recipient.position.y = recipient.initialY;
            }, 200);
            
            break;
    }
}}

class Boundary {
  static width = 64;
  static height = 64;
  constructor({ position }) {
    this.position = position;
    this.width = Boundary.width; // Используйте ширину из статического свойства класса
    this.height = Boundary.height; // Используйте высоту из статического свойства класса
  }

  draw() {
    context.fillStyle = "rgba(255,0,0,0)";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

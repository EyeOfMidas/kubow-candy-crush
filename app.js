document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector('.grid');
    const width = 8;
    const squares = [];
    const scoreDisplay = document.getElementById('score');

    const candyColors = [
        'red',
        'yellow',
        'orange',
        'purple',
        'green',
        'blue',
    ];

    let candyBeingDragged = null;
    let candyBeingReplaced = null;

    let score = 0;

    function createBoard() {
        for(let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.style.backgroundColor = getRandomCandyColor();
            square.setAttribute('draggable', true);
            square.setAttribute('data-candy-id',i);
            squares.push(square);
            grid.appendChild(square);
        }
    }

    createBoard();

    squares.forEach(square => {
        square.addEventListener('dragstart', dragStart)
        square.addEventListener('dragend', dragEnd)
        square.addEventListener('dragover', dragOver)
        square.addEventListener('dragenter', dragEnter)
        square.addEventListener('dragleave', dragLeave)
        square.addEventListener('drop', dragDrop)

        square.addEventListener('touchstart', touchStart);
        square.addEventListener('touchmove', touchMove);
        square.addEventListener('touchend', touchEnd);
    })

    function dragStart(e) {
        candyBeingDragged = getCandy(this);
    }

    function touchStart(e) {
        candyBeingDragged = getCandy(e.touches[0].target);
    }

    function touchMove(e) {
        e.preventDefault();
    }

    function touchEnd(e) {
        var endTarget = document.elementFromPoint(
            e.changedTouches[0].pageX,
            e.changedTouches[0].pageY
        );
        candyBeingReplaced = getCandy(endTarget);
        dragEnd(null);
    }

    function dragEnd(e) {
        let validMoves = [
            candyBeingDragged.id - width,
            candyBeingDragged.id - 1,
            candyBeingDragged.id + 1,
            candyBeingDragged.id + width,
        ]

        let isValidMove = validMoves.includes(candyBeingReplaced.id);
        if(isValidMove) {
            squares[candyBeingReplaced.id].style.backgroundColor = candyBeingDragged.color;
            squares[candyBeingDragged.id].style.backgroundColor = candyBeingReplaced.color;
            
        } else {
            console.warn("invalid move", candyBeingReplaced.id, validMoves);
        }
    }

    function checkRowForThree() {
        for(let i = 0; i < squares.length - 3; i ++) {
            let rowOfThree = [i, i+1, i+2];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor == '';

            const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55];

            if(notValid.includes(i)) {
                continue;
            }
            if(rowOfThree.every(index => squares[index].style.backgroundColor == decidedColor && !isBlank)) {
                rowOfThree.forEach(index => squares[index].style.backgroundColor = '')    
                score += 100;
            }
        }
    }

    function checkColForThree() {
        for(let i = 0; i < squares.length - width * 2; i ++) {
            let colOfThree = [i, i+width, i+width+width];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor == '';

            if(colOfThree.every(index => squares[index].style.backgroundColor == decidedColor && !isBlank)) {
                colOfThree.forEach(index => squares[index].style.backgroundColor = '')    
                score += 100;
            }
        }
    }

    function checkRowForFour() {
        for(let i = 0; i < squares.length - 4; i ++) {
            let rowOfFour = [i, i+1, i+2, i+3];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor == '';

            const notValid = [5,6,7,13,14,15,21,22,23,29, 30,31,37,38,39,45,46,47,53,54,55];

            if(notValid.includes(i)) {
                continue;
            }
            if(rowOfFour.every(index => squares[index].style.backgroundColor == decidedColor && !isBlank)) {
                rowOfFour.forEach(index => squares[index].style.backgroundColor = '')    
                score += 400;
            }
        }
    }

    function checkColForFour() {
        for(let i = 0; i < squares.length - width * 3; i ++) {
            let colOfFour = [i, i+width, i+width+width, i+ width+width+width];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor == '';

            if(colOfFour.every(index => squares[index].style.backgroundColor == decidedColor && !isBlank)) {
                colOfFour.forEach(index => squares[index].style.backgroundColor = '')
                score += 400;
            }
        }
    }

    function moveCandiesDown(){
        for(let i = 0; i < squares.length - width; i ++) {
            if(squares[i + width].style.backgroundColor == '') {
                squares[i+width].style.backgroundColor = squares[i].style.backgroundColor;
                squares[i].style.backgroundColor = '';
                if(i < width && squares[i].style.backgroundColor == '') {
                    squares[i].style.backgroundColor = getRandomCandyColor();         
                }
            }
            if(i < width && squares[i].style.backgroundColor == '') {
                squares[i].style.backgroundColor = getRandomCandyColor();         
            }
        }
    }

    function getRandomCandyColor() {
        let randomColor = Math.floor(candyColors.length * Math.random());
        return candyColors[randomColor];
    }

    function dragOver(e) {
        e.preventDefault();

    }
    function dragEnter(e) {
        e.preventDefault();

    }
    function dragLeave(e) {
        e.preventDefault();

    }
    function dragDrop(e) {
        candyBeingReplaced = getCandy(this);
    }

    function getCandy(obj) {
        let id = parseInt(obj.getAttribute('data-candy-id'));
        let color = obj.style.backgroundColor;
        return {id: id, color: color};
    }

    function updateScore() {
        scoreDisplay.innerHTML = score;
    }

    setInterval(() => {
        moveCandiesDown();

        checkRowForFour();
        checkColForFour();
        checkRowForThree();
        checkColForThree();

        updateScore();
    }, 100)
});


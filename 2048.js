
'use strict';

var game2048 = {
    board: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    getRandomThree: function(min, max) {
        var arr = [];
        while (arr.length < 4) {
            var tmp = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!this.inArr(tmp, arr)) arr.push(tmp);
            if (arr.length >= 3) break;
        }
        return arr;
    },
    initBoard: function() {
        var arr = this.getRandomThree(0, 15);
        for (var i = 0, imax = arr.length; i < imax; i++) {
            var cur = arr[i];
            var m = 0;
            var n = 0;
            m = Math.floor(cur / 4);
            n = cur % 4;
            //console.log('initBoard', arr, m, n);
            this.board[m][n] = 2;
        }
        //console.log(this.board);
    },

    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    inArr: function(needle, arr) {
        for (var i = 0, imax = arr.length; i < imax; i++) {
            if (needle === arr[i]) {
                return true;
            }
        }
        return false;
    },
    randomDirection: function() {
        var directions = ['L', 'R', 'U', 'D'];
        var i = this.getRandomInt(0, directions.length - 1);
        return directions[i];
    },
    stepOne: function(step) {
        var result = '';
        result += this.print(this.board, this.randomDirection(), step);
        result += this.chkEnd(this.board);
        var newcontent = document.createElement('div');
        newcontent.innerHTML = result;
        document.getElementById('board').appendChild(newcontent);
    },
    sum: 0,
    init: function() {
        this.initBoard();
        var ori = this.print(this.board, 'Init')
        var newcontent = document.createElement('div');
        newcontent.innerHTML = ori;
        document.getElementById('board').appendChild(newcontent);
        /*for (var i = 0; i < 10; i++) {
            this.stepOne();
        }*/
        var start = 1;
        while (this.chkEnd(this.board) == "") {
            this.stepOne(start);
            start++;
            if (start > 10000) break;
        }
    },
    chgBoard: function(board, direction) {
        //console.log('before move',board);
        var debug = false;
        var _this = this;
        if (direction == 'L') {

            for (var i = 0, imax = board.length; i < imax; i++) {

                //move
                var curRow = board[i];
                var newRow = [];
                for (var t = 0, tmax = curRow.length; t < tmax; t++) {
                    if (curRow[t] > 0) {
                        var newLen = newRow.length;
                        if (newLen > 0 && newRow[newLen - 1] == curRow[t]) {
                            //exist
                            if(typeof curRow[t] != 'number') console.log('not number', direction, t, curRow[t]);
                            newRow[newLen - 1] = curRow[t] * 2;
                            _this.sum += curRow[t];
                        } else {
                            //
                            newRow.push(curRow[t]);
                        }

                    }
                }
                //merge
                var newRow2 = [];
                for (var n = 0; n < 4; n++) {
                    if (newRow[n]) {
                        newRow2.push(newRow[n]);
                    } else {
                        newRow2.push(0);
                    }
                }
                board[i] = newRow2;
            }

        } else if (direction == 'R') {

            for (var i = 0, imax = board.length; i < imax; i++) {

                //move
                var curRow = board[i];
                if (debug) console.log('curRow', curRow);
                var newRow = [];
                for (var t = 0, tmax = curRow.length; tmax > t; tmax--) {
                    if (curRow[tmax - 1] > 0) {
                        var newLen = newRow.length;
                        if (newLen > 0 && newRow[newLen - 1] == curRow[tmax - 1]) {
                            //exist
                            if(typeof curRow[tmax-1] != 'number') console.log('not number', direction, tmax-1, curRow[tmax-1]);
                            newRow[newLen - 1] = curRow[tmax - 1] * 2;
                            if (debug) console.log('newRow exist', newRow);
                            _this.sum += curRow[t];
                        } else {
                            //
                            newRow.push(curRow[tmax - 1]);
                            if (debug) console.log('newRow', newRow);
                        }
                    }
                }
                //反转数组 merge
                var newRow2 = [];
                for (var n = 3; n >= 0; n--) {
                    if (newRow[3 - n]) {
                        newRow2[n] = newRow[3 - n];
                    } else {
                        newRow2[n] = 0;
                    }
                }
                if (debug) console.log('newRow2', newRow2);
                board[i] = newRow2;
            }

        } else if (direction == 'U') {

            for (x = 0; x < 4; x++) {
                var col = x;
                var curRow = [];
                for (var i = 0, imax = board.length; i < imax; i++) {
                    for (var j = 0, jmax = board[i].length; j < jmax; j++) {
                        if (col == j) {
                            if (board[i][j] > 0) {
                                var len = curRow.length;
                                if (curRow.length > 0 && curRow[len - 1] == board[i][j]) {
                                    if(typeof board[i][j] != 'number') console.log('not number', direction, i,j, board[i][j]);
                                    curRow[len - 1] = board[i][j] * 2;
                                    _this.sum += board[i][j];
                                    //console.log('curRow*2',i,j,board[i][j],curRow);
                                } else {
                                    curRow.push(board[i][j]);
                                    //console.log('curRow',i,j,board[i][j],curRow);
                                }
                            }
                        }
                    }
                }
                for (var i = 0, imax = board.length; i < imax; i++) {
                    for (var j = 0, jmax = board[i].length; j < jmax; j++) {
                        if (col == j) {
                            if (curRow.length > 0) {
                                board[i][j] = curRow.shift();
                                //console.log('board',i,j,board[i][j]);
                            } else {
                                board[i][j] = 0;
                                //console.log('board0',i,j,board[i][j]);
                            }
                        }
                    }
                }
            }

        } else if (direction == 'D') {
            for (x = 0; x < 4; x++) {
                var col = x;
                var curRow = [];
                for (var i = 0, imax = board.length - 1; i <= imax; imax--) {
                    for (var j = 0, jmax = board[imax].length; j < jmax; j++) {
                        if (col == j) {
                            if (board[imax][j] > 0) {
                                var len = curRow.length;
                                if (curRow.length > 0 && curRow[len - 1] == board[imax][j]) {
                                    if(typeof board[imax][j] != 'number') console.log('not number', direction, imax,j, board[imax][j]);
                                    curRow[len - 1] = board[imax][j] * 2;
                                    _this.sum += board[i][j];
                                    //console.log('curRow*2',imax,j,board[imax][j],curRow);
                                } else {
                                    curRow.push(board[imax][j]);
                                    //console.log('curRow',imax,j,board[imax][j],curRow);
                                }
                            }
                        }
                    }
                }
                for (var i = 0, imax = board.length - 1; i <= imax; imax--) {
                    for (var j = 0, jmax = board[imax].length; j < jmax; j++) {
                        if (col == j) {
                            if (curRow.length > 0) {
                                board[imax][j] = curRow.shift();
                                //console.log('board',imax,j,board[imax][j]);
                            } else {
                                board[imax][j] = 0;
                                //console.log('board0',imax,j,board[imax][j]);
                            }
                        }
                    }
                }
            }
        }

        //console.log('after move',board);
        //random new 每次移动后游戏会完全随机选择一个空白格子放入一个2或4(各占50%概率)。
        var x = this.getRandomInt(0, 3);
        var y = this.getRandomInt(0, 3);
        var _this = this;

        var chooseEmpty = function(board, x, y) {
            if (board[x][y] == 0) {
                return [x, y];
            } else {
                x = _this.getRandomInt(0, 3);
                y = _this.getRandomInt(0, 3);
                return chooseEmpty(board, x, y);
            }
        };
        var newXy = chooseEmpty(board, x, y);
        //console.log('newXy',newXy,board[newXy[0]][newXy[1]]);
        if (this.getRandomInt(0, 9) >= 0 && this.getRandomInt(0, 9) <= 4) {
            board[newXy[0]][newXy[1]] = 2;
        } else {
            board[newXy[0]][newXy[1]] = 4;
        }
        //console.log('chooseEmpty', newXy, board[x][y]);
    },
    print: function(board, direction, step) {
        var step = (step != undefined) ? step : '';
        var html = '<br>' + direction + '[' + step + '][' + this.sum + ']';
        this.chgBoard(board, direction);
        for (var i = 0, imax = board.length; i < imax; i++) {
            html += '<br>';
            for (var j = 0, jmax = board[i].length; j < jmax; j++) {
                html += (j == 0) ? '|' : '||';
                html += board[i][j];
                html += (j == jmax - 1) ? '|' : '';
            }
        }
        return html;
    },
    chkEnd: function(board) {
        var isOver = 0;
        for (var i = 0, imax = board.length; i < imax; i++) {
            for (var j = 0, jmax = board[i].length; j < jmax; j++) {
                if (board[i][j] != 0) {
                    isOver++;
                }
                if (isOver >= 16) break;
            }
        }
        return (isOver >= 16) ? '<br>E' : '';
    }
};
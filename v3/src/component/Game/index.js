import React, {Component} from 'react'
import styles from './index.module.css'
import ChessBoard from '../ChessBoard'

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

export default class Game extends Component {
    constructor(props) {
        super(props)
        this.state = {
            size: document.body.offsetWidth, // 屏幕宽度
            chessboard: [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, -1, 1, 0, 0, 0],
                [0, 0, 0, 1, -1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
            ],
            now: 1,  // 当前需要落子的玩家
            msg: '黑棋先手',
            isEnd: false, // 游戏是否结束
            bnum: 2,
            wnum: 2,
        }
    }

    // 深拷贝二维数组
    copyArr = (arr) => {
        const newarr = []
        arr.map(item => {
            newarr.push(item.concat())
        })
        return newarr
    }

    // 落子
    playchess = (point) => {
        const
            x = Math.floor(point / 10),
            y = point % 10

        if (!this.state.isEnd && Array.isArray(this.state.chessboard[x][y])) {
            const chessboard = this.copyArr(this.state.chessboard)
            // 落子
            this.eatchess(chessboard, x, y, this.state.now)
            // 计算数目
            const bwnum = this.calcNum(chessboard)
            // 寻找下一个落子的玩家
            const next = this.nextPlayer(chessboard)
            // 改变状态
            if (next === -this.state.now) {
                this.setState({
                    now: -this.state.now,
                    chessboard: chessboard,
                    msg: (next === 1 ? '黑' : '白') + '棋回合',
                    bnum: bwnum['bnum'],
                    wnum: bwnum['wnum'],
                })
            } else if (next === this.state.now) {
                this.setState({
                    chessboard: chessboard,
                    msg: (next === 1 ? '黑' : '白') + '棋继续',
                    bnum: bwnum['bnum'],
                    wnum: bwnum['wnum'],
                })
            } else if (next === false) {
                this.setState({
                    chessboard: chessboard,
                    isEnd: true,
                    msg: '游戏结束',
                    bnum: bwnum['bnum'],
                    wnum: bwnum['wnum'],
                })
            }
        } else {
            alert('无法落子')
        }

    }

    // 位置合法
    isLegal = (x, y) => {
        return x >= 0 && x < 8 && y >= 0 && y < 8
    }

    // x,y 是否可落num 如果可以把 x,y位置设置为对应点数组
    setXY = (chessboard, x, y, num) => {
        if (chessboard[x][y] === 0) {
            chessboard[x][y] = []

            // 周边有8个方向，从正上方顺时针遍历8个方向
            const
                xstep = [-1, -1, 0, 1, 1,  1,  0, -1],
                ystep = [ 0,  1, 1, 1, 0, -1, -1, -1]

            for (let i=0; i<8; i++) {
                let
                    xx = x + xstep[i],
                    yy = y + ystep[i],
                    rnum = 0	// 另一种棋的个数
                for ( ; this.isLegal(xx, yy); xx+=xstep[i], yy+=ystep[i]) {
                    if (chessboard[xx][yy] === -num)
                        rnum++
                    else if (chessboard[xx][yy] === num) {
                        if (rnum !== 0) {
                            // 方向+点
                            chessboard[x][y].push([i, new Point(xx, yy)])
                        } else break
                    }
                    else break	// 中间出现empty
                }
            }

            if (chessboard[x][y].length === 0)
                chessboard[x][y] = 0
        }
    }

    // 根据棋盘状态 确定可以落子的位置
    setAllXY = (chessboard, num) => {
        for (let x=0; x<8; x++) {
            for (let y=0; y<8; y++) {
                this.setXY(chessboard, x, y, num)
            }
        }
    }

    // 清空设置的可吃子位置
    clearAllSetXY = (chessboard) => {
        for (let x=0; x<8; x++) {
            for (let y=0; y<8; y++) {
                if (chessboard[x][y] !== -1 && chessboard[x][y] !== 1) {
                    chessboard[x][y] = 0
                }
            }
        }
    }

    // 吃子
    eatchess = (chessboard, x, y, num) => {
        const
            info = chessboard[x][y],
            xstep = [-1, -1, 0, 1, 1,  1,  0, -1],
            ystep = [ 0,  1, 1, 1, 0, -1, -1, -1]

        this.clearAllSetXY(chessboard)
        chessboard[x][y] = num

        info.map(item => {
            const
                i = item[0],
                p = item[1]
            let
                xx = x + xstep[i],
                yy = y + ystep[i]

            while(p.x !== xx || p.y !== yy) {
                chessboard[xx][yy] = num

                xx += xstep[i]
                yy += ystep[i]
            }
        })
    }

    nextPlayer = (chessboard) => {

        this.clearAllSetXY(chessboard)
        this.setAllXY(chessboard, -this.state.now) // 渲染前 找出可下子位置

        for (let x=0; x<8; x++) {
            for (let y = 0; y < 8; y++) {
                if(Array.isArray(chessboard[x][y])) return -this.state.now   // 原定的下一步玩家可走
            }
        }

        this.clearAllSetXY(chessboard)
        this.setAllXY(chessboard, this.state.now)

        for (let x=0; x<8; x++) {
            for (let y = 0; y < 8; y++) {
                if(Array.isArray(chessboard[x][y])) return this.state.now   // 对手无棋可走，当前玩家接着走
            }
        }

        // 双方都无法落子 游戏结束
        return false
    }

    // 计算棋盘黑白棋数目
    calcNum = (chessboard) => {
        let bnum = 0,
            wnum = 0
        for (let x=0; x<8; x++) {
            for (let y = 0; y < 8; y++) {
                if (chessboard[x][y] === 1) bnum++
                if (chessboard[x][y] === -1) wnum++
            }
        }
        return {bnum, wnum}
    }

    render() {
        this.setAllXY(this.state.chessboard, this.state.now)
        return (
            <div>
                <div className={styles.info}>
                    <div className={styles.left}>黑:{this.state.bnum}</div>
                    <div className={styles.middle}>{this.state.msg}</div>
                    <div className={styles.right}>白:{this.state.wnum}</div>
                </div>
                <div className={styles.table}>
                    <ChessBoard
                        size={this.state.size}
                        chessboard={this.state.chessboard}
                        playchess={this.playchess}
                    >
                    </ChessBoard>
                </div>
            </div>
        )
    }
}

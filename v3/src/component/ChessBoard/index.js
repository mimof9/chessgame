import React, {Component} from 'react'
import Chess from '../Chess'

export default class ChessBoard extends Component {

    // 根据this.props.chessboard 在棋盘上绘制棋子
    renderChessBoard() {
        const
            chess = [],
            chessboard = this.props.chessboard

        let color = ''
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const x = chessboard[i][j]
                if (x === 1) color = 'black'
                else if (x === -1) color = 'white'
                else if (x === 0) color = 'transparent'
                else if (Array.isArray(x)) color = 'red'

                chess.push(<Chess
                    key={10 * i + j}
                    point={10 * i + j}
                    size={(this.props.size - 36) / 8}
                    color={color}
                    playchess={this.props.playchess}> </Chess>)
            }
        }
        return chess
    }

    render() {
        return (
            // 棋盘content宽度 = this.props.size - 36
            <div style={{
                height: this.props.size - 16,
                width: this.props.size - 16,
                margin: 8,
                border: '2px solid black',
                padding: 8,
                borderRadius: 8,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                background: 'rgb(195, 222, 183)',
            }}>
                {this.renderChessBoard()}
            </div>
        )
    }
}

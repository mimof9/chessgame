import React, {Component} from 'react'
import styles from './index.module.css'

export default class Chess extends Component {

    render() {
        const
            { size, color, playchess, point } = this.props
        let chessStyle = {}

        if (color !== 'red') {
            chessStyle = {
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: color,
            }
        } else if (color === 'red') {   // 高亮显示可落子
            chessStyle = {
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                border: '4px dashed yellow',
                borderRadius: '4px'
            }
        }

        return (
            <div
                className={styles.chess}
                style={{
                    flex: `0 0 ${size}px`,
                    height: size + 'px',
                    padding: 4,
                    background: '#D5B793'
                }}
                onClick={() => playchess(point)}
            >
                <div style={chessStyle}>
                </div>
            </div>
        )
    }
}

import React, {Component} from 'react';
import {generateGame, computeNext} from './snakeEngine';

const styleSheet = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        backgroundColor: 'orange'
    },

    tile: {
        flex: '0 1 100%',
        width: '10%',
        paddingTop: '10%'
    },
};

function getButtonStyle(value, sizeX, sizeY) {
    const width = `${Math.floor(100 / sizeX)}%`;
    const paddingTop = `${Math.floor(100 / sizeY)}%`;

    switch (value) {
        case 'A': {
            return {
                width,
                paddingTop,
                flex: '0 1 100%',
                backgroundColor: 'red',
            }
        }
        case 'S': {
            return {
                width,
                paddingTop,
                flex: '0 1 100%',
                backgroundColor: 'green',
            }
        }
        default:
            return {
                width,
                paddingTop,
                flex: '0 1 100%',
            }
    }
}

const RowComponent = (props) => (
    <div style={styleSheet.container} key={props.index}>
        {
            props.tiles.map((tile, tileIndex) => (
                <div
                    style={getButtonStyle(tile, props.sizeX, props.sizeY)}
                    key={`${props.index}:${tileIndex}`}
                />)
            )
        }
    </div>
);

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            board: [],
        };
        setInterval(() => this.tick(), 100)
    }

    generateBoard(game) {
        let board = [];

        for (let i = 0; i < game.sizeY; i++) {
            let row = [];
            for (let j = 0; j < game.sizeX; j++) {
                row.push(null);
            }
            board.push(row);
        }
        game.positions.forEach(({ x, y }) => {
            board[y][x] = 'S';
        });
        board[game.appleY][game.appleX] = 'A';
        return board;
    }

    tick() {
        const generated = this.state.game
            ? computeNext(this.state.game)
            : null;
        const nextGame = generated
            ? generated
            : generateGame(20, 20);

        const nextBoard = this.generateBoard(nextGame);

        this.setState({
            game: nextGame,
            board: nextBoard,
        });
    }

    componentWillMount() {
        document.addEventListener('keydown', this.onKeyPress)
    }

    onKeyPress = (event) => {
        let newSpeed = {
            speedX: this.state.game.speedX,
            speedY: this.state.game.speedY,
        };

        if (event.key === 'ArrowDown' && this.state.game.speedY !== -1) {
            newSpeed.speedY = 1;
            newSpeed.speedX = 0;
        }
        if (event.key === 'ArrowUp' && this.state.game.speedY !== 1) {
            newSpeed.speedY = -1;
            newSpeed.speedX = 0;
        }
        if (event.key === 'ArrowRight' && this.state.game.speedX !== -1) {
            newSpeed.speedX = 1;
            newSpeed.speedY = 0;
        }
        if (event.key === 'ArrowLeft' && this.state.game.speedX !== 1) {
            newSpeed.speedX = -1;
            newSpeed.speedY = 0;
        }

        this.setState({ game: Object.assign({}, this.state.game, newSpeed) })
    };

    render() {
        return (
            <div >
                {
                    this.state.board.map(
                        (elements, index) => (<RowComponent
                            tiles={elements}
                            index={index}
                            sizeX={this.state.game.sizeX}
                            sizeY={this.state.game.sizeY}
                        />)
                    )
                }
            </div>
        );
    }
}



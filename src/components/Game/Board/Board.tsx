import React from 'react';
import './Board.css';

interface RowProps {
  row: Array<Number>;
  rowNumber: Number;
  colors: Array<String>;
  clickCallback(e: React.MouseEvent): void;
}

interface RowState {}

class Row extends React.Component<RowProps, RowState> {
  render() {
    return (
      <div className='Row'>
        {this.props.row.map((value: Number, index: Number) => {
          const color = '' + this.props.colors[+value];
          return (
            <span
              className='BallHole'
              id={JSON.stringify({ x: index, y: this.props.rowNumber })}
              style={{ background: color }}
              onClick={this.props.clickCallback}
            ></span>
          );
        })}
      </div>
    );
  }
}

interface BoardProps {
  board: Array<[Number, Number]>;
}

interface BoardState {
  rows: Array<Array<Number>>;
}

class Board extends React.Component<BoardProps, BoardState> {
  rowLengths: Array<Number>;
  colors: Array<String>;
  constructor(props: BoardProps) {
    super(props);
    this.rowLengths = [
      1, 2, 3, 4, 13, 12, 11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1,
    ];
    this.colors = ['hsl(240, 72%, 67%)', 'hsl(240, 80%, 40%)'];
    let rows: Array<Array<Number>> = Array<Array<Number>>(17);
    for (let i = 0; i < 17; i++) {
      rows[i] = Array(this.rowLengths[i]).fill(0);
    }
    this.state = {
      rows: rows,
    };
  }

  onClick = (e: React.MouseEvent) => {
    const target = e.nativeEvent.target as HTMLSpanElement;
    const clicked = JSON.parse(target.id);
    let newRows = JSON.parse(JSON.stringify(this.state.rows)); // don't modify in place
    newRows[clicked.y][clicked.x] = newRows[clicked.y][clicked.x] == 1 ? 0 : 1;
    this.setState({
      rows: newRows,
    });
    return;
  };

  render() {
    console.log(this.state.rows);
    return (
      <div className='Board'>
        {this.state.rows.map((value: Array<Number>, index: Number) => {
          return (
            <Row
              row={value}
              rowNumber={index}
              colors={this.colors}
              clickCallback={this.onClick}
            ></Row>
          );
        })}
      </div>
    );
  }
}

export default Board;

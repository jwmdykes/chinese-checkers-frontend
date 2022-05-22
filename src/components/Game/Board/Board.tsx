import React from 'react';
import './Board.css';

interface RowProps {
  row: Array<Number>;
  selected: Array<boolean>;
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
              key={+index}
              className='BallHole'
              id={JSON.stringify({ x: index, y: this.props.rowNumber })}
              style={{
                background: color,
                border: this.props.selected[+index]
                  ? '2px solid var(--ball-border-color)'
                  : 'none',
              }}
              onClick={this.props.clickCallback}
            ></span>
          );
        })}
      </div>
    );
  }
}

interface BoardProps {
  rows: Array<Array<Number>>;
  selected: Array<Array<boolean>>;
  colors: Array<String>;
  onClick(e: React.MouseEvent): void;
}

interface BoardState {}

class Board extends React.Component<BoardProps, BoardState> {
  render() {
    // console.log(this.state.rows);
    console.log(this.props.selected);
    return (
      <div className='Board'>
        {this.props.rows.map((value: Array<Number>, index: Number) => {
          return (
            <Row
              key={+index}
              row={value}
              selected={this.props.selected[+index]}
              rowNumber={index}
              colors={this.props.colors}
              clickCallback={this.props.onClick}
            ></Row>
          );
        })}
      </div>
    );
  }
}

export default Board;

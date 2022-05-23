import React, { Ref } from 'react';
import { colors } from '../gameSettings';
import StaticPiece from '../Piece/StaticPiece';
import './Board.css';

interface RowProps {
  row: Array<Number>;
  selected: Array<boolean>;
  rowNumber: Number;
  colors: Array<String>;
  clickCallback(e: React.MouseEvent): void;
}

class Row extends React.Component<RowProps> {
  render() {
    return (
      <div className='Row'>
        {this.props.row.map((value: Number, index: Number) => {
          const id = JSON.stringify({ x: index, y: this.props.rowNumber });
          const color = '' + this.props.colors[+value];
          const selected = this.props.selected[+index]
            ? '2px solid var(--ball-border-color)'
            : '2px solid var(--ball-default-border-color)';
          const style = { color: color, border: selected };
          return (
            <StaticPiece
              key={+index}
              id={id}
              style={style}
              clickCallback={this.props.clickCallback}
            ></StaticPiece>
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
  pieceOnClick(e: React.MouseEvent): void;
  turn: number;
}

class Board extends React.Component<BoardProps> {
  render() {
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
              clickCallback={this.props.pieceOnClick}
            ></Row>
          );
        })}
        <div
          className='TurnIndicator'
          style={{
            background:
              '' + this.props.colors[this.props.turn] || 'hsl(6, 51%, 32%)',
          }}
        >
          It is {this.props.colors[this.props.turn] || 'Nobody'}'s turn to move.
        </div>
      </div>
    );
  }
}

export default Board;

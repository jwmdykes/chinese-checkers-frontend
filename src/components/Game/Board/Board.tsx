import React from 'react';
import * as gameSettings from '../gameSettings';
import './Board.css';
import MoveablePiece from '../Piece/MoveablePiece';

interface RowProps {
  row: Array<Number>;
  selected: Array<boolean>;
  rowNumber: Number;
  colors: Array<gameSettings.Color>;
  mouseDownCallback(e: React.MouseEvent): void;
  mouseUpCallback(e: React.MouseEvent): void;
  mouseEnterCallback(e: React.MouseEvent): void;
  mouseLeaveCallback(e: React.MouseEvent): void;
  turn: number;
}

class Row extends React.Component<RowProps> {
  render() {
    return (
      <div className='Row'>
        {this.props.row.map((value: Number, index: Number) => {
          const id = JSON.stringify({ x: index, y: this.props.rowNumber });
          const color = gameSettings.colorString(this.props.colors[+value]);
          const selected = this.props.selected[+index]
            ? '2px solid var(--ball-border-color)'
            : '2px solid var(--ball-default-border-color)';
          const style = { color: color, border: selected };
          const shouldMove = value === this.props.turn;
          return (
            <MoveablePiece
              key={+index}
              id={id}
              style={style}
              mouseDownCallback={this.props.mouseDownCallback}
              mouseUpCallback={this.props.mouseUpCallback}
              mouseEnterCallback={this.props.mouseEnterCallback}
              mouseLeaveCallback={this.props.mouseLeaveCallback}
              shouldMove={shouldMove}
            ></MoveablePiece>
          );
        })}
      </div>
    );
  }
}

interface BoardProps {
  rows: Array<Array<Number>>;
  selected: Array<Array<boolean>>;
  colors: Array<gameSettings.Color>;
  pieceOnMouseDown(e: React.MouseEvent): void;
  pieceOnMouseUp(e: React.MouseEvent): void;
  pieceOnHover(e: React.MouseEvent): void;
  pieceOnLeave(e: React.MouseEvent): void;
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
              mouseDownCallback={this.props.pieceOnMouseDown}
              mouseUpCallback={this.props.pieceOnMouseUp}
              mouseEnterCallback={this.props.pieceOnHover}
              mouseLeaveCallback={this.props.pieceOnLeave}
              turn={this.props.turn}
            ></Row>
          );
        })}
      </div>
    );
  }
}

export default Board;

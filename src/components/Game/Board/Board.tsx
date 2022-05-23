import React, { Ref } from 'react';
import './Board.css';

interface PieceProps {
  id: string;
  style: { color: string; border: string };
  clickCallback(e: React.MouseEvent): void;
}

interface PieceState {
  top: number;
  left: number;
  detached: boolean;
}

class Piece extends React.Component<PieceProps, PieceState> {
  startOffsetX: number;
  startOffsetY: number;
  myRef: React.MutableRefObject<HTMLDivElement>;
  constructor(props: PieceProps) {
    super(props);
    this.myRef = React.createRef() as React.MutableRefObject<HTMLDivElement>;

    this.startOffsetX = 0;
    this.startOffsetY = 0;
    this.state = {
      top: 0,
      left: 0,
      detached: false,
    };
  }

  componentDidMount() {
    const rect = this.myRef.current.getBoundingClientRect();
    this.setState({
      top: rect.top,
      left: rect.left,
    });
  }

  onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    this.props.clickCallback(e);

    const rect = this.myRef.current.getBoundingClientRect();
    console.log('down!');
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    this.startOffsetX = e.clientX - rect.left;
    this.startOffsetY = e.clientY - rect.top;
    this.setState({
      detached: true,
      top: rect.top,
      left: rect.left,
    });
  };

  onMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    console.log('up!');
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.setState({
      detached: false,
    });
  };

  onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    console.log('moving!');
    const x = e.clientX;
    const y = e.clientY;
    const left = x - this.startOffsetX;
    const top = y - this.startOffsetY;
    this.setState({
      top: top,
      left: left,
    });
  };

  render() {
    return (
      <div className='PlaceHolder'>
        <div
          ref={this.myRef}
          className='BallHole'
          id={this.props.id}
          style={{
            background: this.props.style.color,
            border: this.props.style.border,
            top: this.state.top,
            left: this.state.left,
            position: this.state.detached ? 'absolute' : 'static',
          }}
          onMouseDown={this.onMouseDown}
        ></div>
      </div>
    );
  }
}

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
            <Piece
              key={+index}
              id={id}
              style={style}
              clickCallback={this.props.clickCallback}
            ></Piece>
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
      </div>
    );
  }
}

export default Board;

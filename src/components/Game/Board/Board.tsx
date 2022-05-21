import React, { createRef } from 'react';
import './Board.css';

interface BoardProps {
  board: Array<[Number, Number]>;
}

interface BoardState {}

class Board extends React.Component<BoardProps, BoardState> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  constructor(props: BoardProps) {
    super(props);
    this.canvasRef = createRef();
  }

  draw = (context: CanvasRenderingContext2D) => {
    context.beginPath();
    context.moveTo(100, 100);
    context.lineTo(100, 300);
    context.lineTo(300, 300);
    context.closePath();

    // the outline
    context.lineWidth = 10;
    context.strokeStyle = '#666666';
    context.stroke();

    // the fill color
    context.fillStyle = '#FFCC00';
    context.fill();
  };

  componentDidMount() {
    const canvas = this.canvasRef.current;
    const context = canvas!.getContext('2d');
    if (context) {
      this.draw(context);
    }
  }

  render() {
    return <canvas ref={this.canvasRef} className='Board'></canvas>;
  }
}

export default Board;

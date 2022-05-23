import React, { Ref } from 'react';
import './Piece.css';

interface PieceProps {
  id: string;
  style: { color: string; border: string };
  clickCallback(e: React.MouseEvent): void;
}

interface PieceState {
  top: number;
  left: number;
}

export default class MoveablePiece extends React.Component<
  PieceProps,
  PieceState
> {
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
      top: rect.top,
      left: rect.left,
    });
  };

  onMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    console.log('up!');
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
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
      <div
        ref={this.myRef}
        className='MoveablePiece'
        id={this.props.id}
        style={{
          background: this.props.style.color,
          border: this.props.style.border,
          top: this.state.top,
          left: this.state.left,
        }}
        onMouseDown={this.onMouseDown}
      ></div>
    );
  }
}

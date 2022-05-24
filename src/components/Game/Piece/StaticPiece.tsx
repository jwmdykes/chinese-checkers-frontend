import React from 'react';
import './Piece.css';

interface PieceProps {
  id: string;
  style: { color: string; border: string };
  clickCallback(e: React.MouseEvent): void;
}

export default class Piece extends React.Component<PieceProps> {
  startOffsetX: number;
  startOffsetY: number;
  myRef: React.MutableRefObject<HTMLDivElement>;
  constructor(props: PieceProps) {
    super(props);
    this.myRef = React.createRef() as React.MutableRefObject<HTMLDivElement>;

    this.startOffsetX = 0;
    this.startOffsetY = 0;
  }

  componentDidMount() {
    const rect = this.myRef.current.getBoundingClientRect();
    this.setState({
      top: rect.top,
      left: rect.left,
    });
  }

  render() {
    return (
      <div className='PlaceHolder'>
        <div
          ref={this.myRef}
          className='Piece'
          id={this.props.id}
          style={{
            background: this.props.style.color,
            border: this.props.style.border,
          }}
          onMouseDown={this.props.clickCallback}
        ></div>
      </div>
    );
  }
}

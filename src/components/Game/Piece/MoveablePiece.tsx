import React, { Ref } from 'react';
import './Piece.css';
import * as gameSettings from '../gameSettings';

interface PieceProps {
  id: string;
  style: { border: string };
  color: gameSettings.Color;
  mouseDownCallback(e: React.MouseEvent): void;
  mouseUpCallback(e: React.MouseEvent): void;
  mouseEnterCallback(e: React.MouseEvent): void;
  mouseLeaveCallback(e: React.MouseEvent): void;
  shouldMove: boolean;
}

interface PieceState {
  top: number;
  left: number;
  position: 'static' | 'absolute';
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
      position: 'static',
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
    this.props.mouseDownCallback(e);

    if (!this.props.shouldMove) {
      this.setState({
        top: 0,
        left: 0,
        position: 'static',
      });
      return;
    }

    const rect = this.myRef.current.getBoundingClientRect();
    // console.log('down!');
    window.addEventListener('pointermove', this.onMouseMove);
    window.addEventListener('pointerup', this.onMouseUp);
    this.startOffsetX = e.clientX - rect.left;
    this.startOffsetY = e.clientY - rect.top;
    this.setState({
      top: rect.top,
      left: rect.left,
      position: 'absolute',
    });
  };

  onMouseUp = (e: PointerEvent) => {
    e.preventDefault();
    // console.log('up!');
    window.removeEventListener('pointermove', this.onMouseMove);
    window.removeEventListener('pointerup', this.onMouseUp);
    this.setState({
      position: 'static',
    });
  };

  onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    // console.log('moving!');
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
    let shadowColor: gameSettings.Color = JSON.parse(
      JSON.stringify(this.props.color)
    );
    shadowColor.brightness = shadowColor.brightness - 30;
    return (
      <div className='PlaceHolder' id={this.props.id}>
        <div
          ref={this.myRef}
          className='Piece'
          id={this.props.id}
          style={{
            background: gameSettings.colorString(this.props.color),
            border: this.props.style.border,
            top: this.state.top,
            left: this.state.left,
            position: this.state.position,
            pointerEvents: this.state.position === 'absolute' ? 'none' : 'auto',
          }}
          onPointerDown={this.onMouseDown}
          onPointerUp={this.props.mouseUpCallback}
          onPointerEnter={this.props.mouseEnterCallback}
          onPointerLeave={this.props.mouseLeaveCallback}
        ></div>
        {this.state.position === 'static' || (
          <div
            className='Piece'
            id={'ghost:' + this.props.id}
            style={{
              background: gameSettings.colorString(gameSettings.colors.empty),
              border: this.props.style.border,
              position: 'static',
              cursor: this.props.shouldMove ? 'pointer' : 'default',
              // boxShadow:
              //   'inset 2px 1px 9px 1px ' +
              //   gameSettings.colorString(shadowColor),
            }}
          ></div>
        )}
      </div>
    );
  }
}

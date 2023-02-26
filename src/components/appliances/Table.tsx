import { transform } from 'html2canvas/dist/types/css/property-descriptors/transform';
import { ComponentPropsWithoutRef, SyntheticEvent } from 'react';
import styled from 'styled-components';
import { useLayoutStore } from '../../store/layoutStore';
import { Rotation, SquareType } from '../../utils/helpers';

type ChairPositions = {
  [key in keyof typeof Rotation]: {
    translate: [number, number];
    rotate: number;
  };
};
const CHAIR_POSITIONS: ChairPositions = {
  Up: { translate: [0, -100], rotate: 0 },
  Right: { translate: [100, 0], rotate: 90 },
  Down: { translate: [0, 100], rotate: 180 },
  Left: { translate: [-100, 0], rotate: 270 },
};
const TableBase = styled.div`
  position: relative;
`;
const Chair = styled.img<{ direction: keyof ChairPositions }>`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  ${({ direction }) => {
    const {
      translate: [x, y],
      rotate,
    } = CHAIR_POSITIONS[direction];
    return `transform: translateX(${x}%) translateY(${y}%) rotate(${rotate}deg) ;`;
  }}/* pointer-events: none; */
`;
type TableIdType = 'lq' | 'tV' | 'cJ' | 'T2' | 'GM';

interface Props extends ComponentPropsWithoutRef<'div'> {
  type: TableIdType;
  squareType: SquareType;
  opacity: number;
}

export function Table({
  type,
  squareType,
  opacity,
  onTouchStart,
  onTouchEnd,
  onTouchMove,
  onMouseDown,
}: Props) {
  const chair = new SquareType('qB', 'chair.png', 'chair');
  const image = chair.getImageDisplayPath();

  return (
    <TableBase>
      <img
        className='grid-image'
        draggable={false}
        src={squareType.getImageDisplayPath()}
        alt={squareType.getImageAlt()}
        onError={(event: SyntheticEvent) => {
          const target = event.currentTarget as HTMLImageElement;
          target.onerror = null; // prevents looping
          target.src = '/images/display/404.png';
        }}
        style={{
          opacity: opacity,
          transform: 'scale(1.1)' + squareType?.getTransform(),
          cursor: 'grab',
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onTouchMove={onTouchMove}
        onContextMenu={(e) => e.preventDefault()}
      />
      {Object.keys(CHAIR_POSITIONS).map((direction) => (
        <Chair
          key={direction}
          src={image}
          direction={direction as keyof ChairPositions}
        />
      ))}
    </TableBase>
  );
}

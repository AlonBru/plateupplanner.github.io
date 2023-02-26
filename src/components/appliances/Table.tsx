import { ComponentPropsWithoutRef, SyntheticEvent, useCallback } from 'react';
import styled from 'styled-components';
import shallow from 'zustand/shallow';
import { useLayoutStore } from '../../store/layoutStore';
import { Cell, WallState } from '../../types/project';
import { Rotation, SquareType, WallType } from '../../utils/helpers';

type ChairPositions = {
  [key in keyof typeof Rotation]: number;
};
const CHAIR_POSITIONS: ChairPositions = {
  Up: 0,
  Right: 90,
  Down: 180,
  Left: 270,
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
    const rotate = CHAIR_POSITIONS[direction];
    return `transform: rotate(${rotate}deg) translateY(calc( -100% - 5px )) ;`;
  }}
`;
type TableIdType = 'lq' | 'tV' | 'cJ' | 'T2' | 'GM';

interface Props extends ComponentPropsWithoutRef<'div'> {
  type: TableIdType;
  squareType: SquareType;
  opacity: number;
  cell: Cell;
}

export function Table({
  type,
  cell: [i, j],
  squareType,
  opacity,
  onTouchStart,
  onTouchEnd,
  onTouchMove,
  onMouseDown,
}: Props) {
  const chair = new SquareType('qB', 'chair.png', 'chair');
  const image = chair.getImageDisplayPath();
  const wallState = useLayoutStore(
    useCallback(
      (state) => {
        if (
          state.displayStates === undefined ||
          state.displayStates[i] === undefined ||
          state.displayStates[i][j] === undefined
        ) {
          return;
        }
        return {
          Up: (state.displayStates[i - 1]?.[j] as WallState)?.wallType,
          Down: (state.displayStates[i + 1]?.[j] as WallState)?.wallType,
          Left: (state.displayStates[i]?.[j - 1] as WallState)?.wallType,
          Right: (state.displayStates[i]?.[j + 1] as WallState)?.wallType,
        };
      },
      [i, j],
    ),
    shallow,
  );
  console.log(wallState);
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
      {Object.keys(CHAIR_POSITIONS).map((direction) =>
        (
          wallState?.[direction as keyof typeof wallState] as
            | WallType
            | undefined
        )?.id === '0' ? (
          <Chair
            key={direction}
            src={image}
            direction={direction as keyof ChairPositions}
          />
        ) : null,
      )}
    </TableBase>
  );
}

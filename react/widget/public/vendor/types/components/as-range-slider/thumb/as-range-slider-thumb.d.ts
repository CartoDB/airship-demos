import '../../../stencil.core';
import { EventEmitter } from '../../../stencil.core';
import { MouseTrack } from '../MouseTrack';
export declare class RangeSliderThumb extends MouseTrack {
    percentage: number;
    value: number;
    valueMin: number;
    valueMax: number;
    disabled: boolean;
    formatValue: (value: number) => void;
    thumbMove: EventEmitter<number>;
    thumbChangeStart: EventEmitter<void>;
    thumbChangeEnd: EventEmitter<void>;
    thumbIncrease: EventEmitter<number>;
    thumbDecrease: EventEmitter<number>;
    element: HTMLElement;
    railElement: HTMLElement;
    thumbValue: HTMLElement;
    render(): JSX.Element;
    onMouseDown(event: MouseEvent): void;
    onKeyDown(event: KeyboardEvent): void;
    private _onMove;
    private _onRelease;
    private _getDisplayValue;
    private setCursorTo;
}
export interface Thumb {
    value: number;
    valueMin: number;
    valueMax: number;
    percentage: number;
}

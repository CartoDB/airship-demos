export declare class MouseTrack {
    handleMouseDown(listeners: MouseListeners): void;
    private _handleRelease;
    private preventAndStop;
}
interface MouseListeners {
    move?: (eventProperties: MouseEvent) => void;
    release?: (eventProperties: MouseEvent) => void;
}
export {};

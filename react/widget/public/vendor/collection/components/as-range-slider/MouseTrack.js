export class MouseTrack {
    handleMouseDown(listeners) {
        const handleMove = (eventProperties) => {
            listeners.move(eventProperties);
            eventProperties.preventDefault();
            eventProperties.stopPropagation();
        };
        const handleRelease = (eventProperties) => {
            this._handleRelease(eventProperties, { move: handleMove, release: handleRelease }, listeners);
            eventProperties.preventDefault();
            eventProperties.stopPropagation();
        };
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('mouseup', handleRelease);
        document.addEventListener('touchend', handleRelease);
        document.addEventListener('dragstart', this.preventAndStop);
    }
    _handleRelease(eventProperties, listeners, customListeners) {
        document.removeEventListener('mousemove', listeners.move);
        document.removeEventListener('mouseup', listeners.release);
        if (customListeners.move) {
            customListeners.move(eventProperties);
        }
        if (customListeners.release) {
            customListeners.release(eventProperties);
        }
    }
    preventAndStop(event) {
        event.preventDefault();
        event.stopPropagation();
    }
}

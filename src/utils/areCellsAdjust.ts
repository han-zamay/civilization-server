export const areCellsAdjust = ( x: number, y: number, x1: number, y1: number ) => {
    if(x === x1 && y === y1) {
        return false;
    }
    else if(x === x1 && Math.abs(y - y1) <= 1) {
        return true;
    }
    else if(y === y1 && Math.abs(x - x1) <= 1) {
        return true;
    }
    else {
        return false;
    }
}
export const isCityOutskirt = ( x: number, y: number, x1: number, y1: number ) => {
    if(x === x1 && y === y1) {
        return false;
    }
    else if(Math.abs(x - x1) <= 1 && Math.abs(y - y1) <= 1) {
        return true;
    }
    else {
        return false;
    }
}
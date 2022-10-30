import { BLOCK_SIZE, COLS, GRIDCOLS, GRIDROWS } from './constants';

export default class GameUtils
{
    static getIndexByPos(posY: number, posX:number,px:number,py:number) : Number
    {
        return ((((posY - BLOCK_SIZE) / BLOCK_SIZE) * GRIDROWS) + py) + (((posX - BLOCK_SIZE) / BLOCK_SIZE) + px);
    }
    static getIndexHeightByPos(posY : number,py?:number) : number
    {
        if(py)
        {
            return ((((posY - BLOCK_SIZE) / BLOCK_SIZE) * GRIDCOLS) + py);
        }
        return (((posY - BLOCK_SIZE) / BLOCK_SIZE) * GRIDCOLS)
    }
}

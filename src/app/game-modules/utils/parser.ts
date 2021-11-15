import { PlayersGrids } from "../objects/players-grids";
import { User } from "../objects/server/user";

export class Parser{
    static convertToPlayersGrid(users : User[]) : PlayersGrids{
        const playerGrids : PlayersGrids = {};
        users.forEach((user)=>{
            playerGrids[user.userId] = user.playerGrid;
        })
        return playerGrids;
    }
}

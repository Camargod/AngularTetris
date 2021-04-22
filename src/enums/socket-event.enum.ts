export enum SocketEventClientEnumerator{
    "GRID_UPDATE" = 102,
    "PIECE_GRID_UPDATE" = 103,
    "GAME_OVER" = 104,
}

export enum SocketEventServerEnumerator{
    "TIME_UPDATE" = 201,
    "GAME_START" = 202,
    "RECEIVED_DAMAGE" = 203,
    "IN_MATCH_PLAYERS" = 204,
    "DISCONNECTED_BY_SERVER" = 299  
}
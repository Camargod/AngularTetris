export enum SocketEventClientEnumerator{
    "TIME_UPDATE" = 101,
    "GRID_UPDATE" = 102,
    "PIECE_GRID_UPDATE" = 103,
    "GAME_OVER" = 104,
}

export enum SocketEventServerEnumerator{
    "RECEIVED_DAMAGE" = 201,
    "DISCONNECTED_BY_SERVER" = 202
}
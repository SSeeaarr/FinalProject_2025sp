export const TILE_TYPES = {
    GRASS: 0,
    BRICKS: 1,
    WATER: 2,
    EARTH: 3,
    TREE: 4,
    SAND: 5,
    SNOW: 6,
    ICE: 7,
    STONE_PATH: 8,
    DIRT: 9,
    ICE_PATH: 10,
    ICE_CUBE: 11,
    // Add any other tile types your game needs
};

export const COLLISION_TILES = [
    TILE_TYPES.WATER,
    TILE_TYPES.WALL,
    TILE_TYPES.TREE,
    // Add other collision tile types
];
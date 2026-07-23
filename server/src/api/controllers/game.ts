import Game from '@/models/game';
import { Request, Response } from 'express';
import { SCORING_TYPES, GAME_TYPES } from '@/types/model';
import { sendError, sendSuccess } from '@/utils/response';
import { validateRequiredFields } from '@/utils/validation';

// GET /games - Get all games
export const getAllGames = async (req: Request, res: Response) => {
    try {
        const games = await Game.find();

        return sendSuccess(res, 200, {
            i18n: 'games.fetched',
            message: 'Games retrieved successfully',
            payload: games,
        });
    } catch (error) {
        console.error('[getAllGames] Error:', error);

        return sendError(res, 500, {
            i18n: 'games.fetch_failed',
            message: 'Failed to retrieve games',
        });
    }
};

// GET /games/:slug - Get a game by slug
export const getGameBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        // TODO: add slug validation

        const game = await Game.findOne({ slug });

        if (!game) {
            return sendError(res, 404, {
                i18n: 'games.not_found',
                message: 'Game not found',
            });
        }

        return sendSuccess(res, 200, {
            i18n: 'games.fetched',
            message: 'Game retrieved successfully',
            payload: game,
        });
    } catch (error) {
        console.error('[getGameBySlug] Error:', error);
        return sendError(res, 500, {
            i18n: 'games.fetch_failed',
            message: 'Error retrieving game',
        });
    }
};

// POST /games - Create a new game
export const createGame = async (req: Request, res: Response) => {
    try {
        const { name, difficulty, type, scoringLogic } = req.body;

        // Collect missing fields
        const errors = validateRequiredFields(req.body, ['name', 'difficulty', 'type', 'scoringLogic']);
        if (Object.keys(errors).length > 0) {
            return sendError(res, 400, {
                i18n: 'games.missing_fields',
                message: 'Missing required fields',
                errors: errors,
            });
        }

        // Validate scoringLogic
        if (!SCORING_TYPES.includes(scoringLogic)) {
            return sendError(res, 400, {
                i18n: 'games.invalid_scoring_logic',
                message: 'Invalid scoringLogic.',
                errors: {
                    accepted: SCORING_TYPES.join(', '),
                },
            });
        }

        if (!GAME_TYPES.includes(type)) {
            return sendError(res, 400, {
                i18n: 'games.invalid_type',
                message: 'Invalid type.',
                errors: {
                    accepted: GAME_TYPES.join(', '),
                },
            });
        }

        const coverPath = req.file ? req.file.path : 'none';

        const alreadyExists = await Game.findOne({ name });
        if (alreadyExists) {
            return sendError(res, 400, {
                i18n: 'games.already_exists',
                message: 'Game with this name already exists',
            });
        }

        const newGame = new Game({
            name,
            difficulty,
            type,
            cover: coverPath,
            scoringLogic,
        });

        await newGame.save();

        return sendSuccess(res, 201, {
            i18n: 'games.created',
            message: 'Game created successfully!',
            payload: newGame,
        });
    } catch (error) {
        console.error('[createGame] Error:', error);
        return sendError(res, 500, {
            i18n: 'games.create_failed',
            message: 'Failed to create game',
        });
    }
};

// PUT /games/:id - Update a game by ID
export const updateGameById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const { name, difficulty, type, scoringLogic } = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return sendError(res, 400, {
                i18n: 'games.invalid_id',
                message: 'Invalid game ID',
            });
        }

        // Validate scoringLogic
        if (scoringLogic && !SCORING_TYPES.includes(scoringLogic)) {
            return sendError(res, 400, {
                i18n: 'games.invalid_scoring_logic',
                message: 'Invalid scoringLogic.',
                errors: {
                    accepted: SCORING_TYPES.join(', '),
                },
            });
        }

        if (type && !GAME_TYPES.includes(type)) {
            return sendError(res, 400, {
                i18n: 'games.invalid_type',
                message: 'Invalid game type.',
                errors: {
                    accepted: GAME_TYPES.join(', '),
                },
            });
        }

        const coverPath = req.file ? req.file.path : null;

        const updatedGame = await Game.findByIdAndUpdate(
            id,
            {
                ...(name && { name }),
                ...(difficulty && { difficulty }),
                ...(type && { type }),
                ...(scoringLogic && { scoringLogic }),
                ...(coverPath && { cover: coverPath }),
            },
            { new: true, runValidators: true },
        );

        if (!updatedGame) {
            return sendError(res, 404, {
                i18n: 'games.not_found',
                message: 'Game not found',
            });
        }

        return sendSuccess(res, 200, {
            i18n: 'games.updated',
            message: 'Game updated successfully!',
            payload: updatedGame,
        });
    } catch (error) {
        console.error('[updateGameById] Error:', error);
        return sendError(res, 500, {
            i18n: 'games.update_failed',
            message: 'Error updating game',
        });
    }
};

// DELETE /games/:id - Delete a game by ID
export const deleteGame = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return sendError(res, 400, { i18n: 'games.invalid_id', message: 'Invalid game ID' });
        }

        const deletedGame = await Game.findByIdAndDelete(id);

        if (!deletedGame) {
            return sendError(res, 404, { i18n: 'games.not_found', message: 'Game not found' });
        }

        return sendSuccess(res, 200, {
            i18n: 'games.deleted',
            message: 'Game deleted successfully',
            payload: deletedGame,
        });
    } catch (error) {
        console.error('[deleteGame] Error:', error);
        return sendError(res, 500, { i18n: 'games.delete_failed', message: 'Error deleting game' });
    }
};

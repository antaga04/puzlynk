import { Request, Response } from 'express';
import Score from '@/models/score';
import User from '@/models/user';
import { paginate } from '@/utils/paginationHelper';
import { applyStrike } from '@/utils/scoreUtils';
import { AuthenticatedRequest } from '@/types/types';
import { Types } from 'mongoose';
import { ScoreDocument } from '@/types/model';
import { sendError, sendSuccess } from '@/utils/response';
import { validateRequiredFields } from '@/utils/validation';
import { getGameScoring } from '@/utils/gameRegistry';

export const getAllScores = async (req: Request, res: Response) => {
    try {
        const { game_id } = req.query;

        if (!game_id || typeof game_id !== 'string') {
            return sendError(res, 400, {
                i18n: 'score.invalid_game_id',
                message: 'Game ID is required',
            });
        }

        if (!Types.ObjectId.isValid(game_id)) {
            return sendError(res, 400, {
                i18n: 'score.invalid_game_id',
                message: 'Invalid game ID format',
            });
        }

        const scores = await Score.find({ game_id })
            .populate('user_id', 'nickname avatar')
            .populate('game_id', 'name cover')
            .sort({ scoreData: -1 });

        return sendSuccess(res, 200, {
            i18n: 'score.scores_retrieved',
            message: 'Scores retrieved successfully!',
            payload: scores,
        });
    } catch (error) {
        console.error('[getAllScores] Error:', error);
        return sendError(res, 500, {
            i18n: 'score.error_retrieving',
            message: 'Error retrieving scores',
        });
    }
};

export const deleteScore = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        if (!Types.ObjectId.isValid(id)) {
            return sendError(res, 400, {
                i18n: 'score.invalid_id',
                message: 'Invalid score ID format',
            });
        }
        await Score.deleteOne({ _id: id });
        return sendSuccess(res, 200, {
            i18n: 'score.deleted',
            message: 'Score successfully Deleted!',
        });
    } catch (error) {
        console.error('[deleteScore] Error:', error);
        return sendError(res, 400, {
            i18n: 'score.error_deleting',
            message: 'Error deleting Score',
        });
    }
};

export const getScoresByGameId = async (req: Request, res: Response) => {
    try {
        const { game_id } = req.params as { game_id: string };
        const { page = 1, limit = 10, variant } = req.query;

        const scores = await Score.find({ game_id, variant })
            .populate('user_id', 'nickname avatar')
            .populate('game_id', 'name cover')
            .lean();

        const scoring = await getGameScoring();

        const gameLogic = scoring[game_id];
        if (!gameLogic) {
            return sendError(res, 400, {
                i18n: 'score.invalid_game_id',
                message: 'Invalid game ID',
            });
        }

        const sortedScores = gameLogic.sortScores(scores as ScoreDocument[]);

        // Paginate the sorted scores
        const { paginatedData, pagination } = paginate(sortedScores, String(page), String(limit));

        return sendSuccess(res, 200, {
            i18n: 'score.scores_retrieved',
            message: 'Scores retrieved successfully!',
            payload: {
                paginatedData,
                pagination,
            },
        });
    } catch (error) {
        console.error('[getScoresByGameId] Error:', error);
        return sendError(res, 500, {
            i18n: 'score.error_retrieving',
            message: 'Error retrieving scores',
        });
    }
};

export const uploadScore = async (req: Request, res: Response) => {
    try {
        const { scoreData, game_id } = req.body.score;
        const { variant } = scoreData;
        const { id: user_id } = (req as AuthenticatedRequest).user;

        const errors = validateRequiredFields({ ...req.body.score, user_id }, ['user_id', 'game_id', 'scoreData']);
        if (Object.keys(errors).length > 0) {
            return sendError(res, 400, {
                i18n: 'score.missing_fields',
                message: 'Missing required fields',
                errors: errors,
            });
        }

        const scoring = await getGameScoring();
        const gameLogic = scoring[game_id];

        if (!gameLogic) {
            return sendError(res, 400, {
                i18n: 'score.invalid_game_id',
                message: 'Invalid game ID',
            });
        }

        const { isValid, newScore } = await gameLogic.validate(scoreData);
        if (!isValid) {
            await applyStrike(user_id);

            return sendError(res, 400, {
                i18n: 'score.invalid_score_data',
                message: 'Score data invalid. Potential cheating detected 👺.',
            });
        }

        let existingScore = await Score.findOne({ user_id, game_id, variant });

        if (existingScore) {
            if (!gameLogic.compare(existingScore.scoreData as StoredPuzzle15Score & StoredPokemonScore, newScore)) {
                return sendError(res, 409, {
                    i18n: 'score.lower_score',
                    message: 'New score is not better than the existing score',
                    payload: existingScore,
                });
            }
            existingScore.scoreData = newScore;
            await existingScore.save();
        } else {
            existingScore = new Score({ user_id, game_id, scoreData: newScore, variant });
            await existingScore.save();
            await User.findByIdAndUpdate(user_id, { $push: { scores: existingScore._id } }, { new: true });
        }

        return sendSuccess(res, existingScore ? 200 : 201, {
            i18n: 'score.uploaded',
            message: 'Score uploaded successfully!',
            payload: existingScore,
        });
    } catch (error) {
        console.error('[uploadScore] Error:', error);
        return sendError(res, 500, {
            i18n: 'score.error_uploading',
            message: 'Error uploading score',
        });
    }
};

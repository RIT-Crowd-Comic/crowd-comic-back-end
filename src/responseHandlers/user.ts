import { Request, Response } from 'express';
import * as UserService from '../services/userService';

/**
 * Create a new user
 */
const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response = await UserService.createUser({
            username:     req.body.username,
            password:     req.body.password,
            email:        req.body.email,
            display_name: req.body.display_name
        });

        // most likely caused by bad request data
        if (response.success === false) {
            return res.status(400).json(response);
        }

        return res.status(200).json(response);
    }
    catch {
        return res.status(400).json({ message: 'something went wrong' });
    }

};

export { createUser };

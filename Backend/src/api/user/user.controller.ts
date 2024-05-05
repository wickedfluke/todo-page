import { NextFunction, Response } from "express";
import { TypedRequest } from "../../utils/typed-request.interface";
import userService from "./user.service";

export const me = async (req: TypedRequest, res: Response, next: NextFunction) => {
    try {
        res.json(req.user!);
    } catch (err) {
        next(err);
    }
}

export const list = async (req: TypedRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const items = await userService.list();
        res.json(items);
    } catch (err) {
        next(err);
    }
}
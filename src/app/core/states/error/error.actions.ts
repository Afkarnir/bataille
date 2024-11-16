import { ApiError } from "../../models/api";

export class SetError {
    static readonly type = '[Error] Add error';
    constructor(readonly error: ApiError) { }
}

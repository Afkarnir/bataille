export class CreatePlayer {
    static readonly type = '[Player] Create player';
    constructor(readonly name: string) { }
}

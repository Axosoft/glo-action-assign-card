"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const glo_sdk_1 = __importDefault(require("@axosoft/glo-sdk"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const authToken = core.getInput('authToken');
        const cardsJson = core.getInput('cards');
        const username = core.getInput('assignee');
        try {
            const cards = JSON.parse(cardsJson);
            if (!cards) {
                return;
            }
            for (let i = 0; i < cards.length; i++) {
                const cardData = cards[i];
                const { boardId, cardId } = cardData;
                // find the board { id, labels }
                const board = yield glo_sdk_1.default(authToken).boards.get(boardId, {
                    fields: ['members']
                });
                if (!board) {
                    core.setFailed(`Board ${boardId} not found`);
                    return;
                }
                // find the card { id, labels }
                const card = yield glo_sdk_1.default(authToken).boards.cards.get(boardId, cardId, {
                    fields: ['assignees']
                });
                if (!card) {
                    core.setFailed(`Card ${cardId} not found`);
                    return;
                }
                // find member
                if (board.members) {
                    const member = board.members.find(m => m.username === username);
                    if (member) {
                        if (!card.assignees) {
                            card.assignees = [];
                        }
                        // add assignee to the card
                        card.assignees.push({
                            id: member.id
                        });
                        // update card
                        yield glo_sdk_1.default(authToken).boards.cards.edit(boardId, cardId, card);
                    }
                }
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();

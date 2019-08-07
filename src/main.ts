import * as core from '@actions/core';
import GloSDK from '@axosoft/glo-sdk';

interface ICard {
  boardId: string;
  cardId: string;
}

async function run() {
  const authToken = core.getInput('authToken');
  const cardsJson = core.getInput('cards');
  const username = core.getInput('assignee');

  try {
    const cards = JSON.parse(cardsJson);
    if (!cards) {
      return;
    }

    for (let i = 0; i < cards.length; i++) {
      const cardData = cards[i] as ICard;
      const {boardId, cardId} = cardData;

      // find the board { id, labels }
      const board = await GloSDK(authToken).boards.get(boardId, {
        fields: ['members']
      });
      if (!board) {
        core.setFailed(`Board ${boardId} not found`);
        return;
      }
      core.debug(JSON.stringify(board));

      // find the card { id, labels }
      const card = await GloSDK(authToken).boards.cards.get(boardId, cardId, {
        fields: ['assignees']
      });
      if (!card) {
        core.setFailed(`Card ${cardId} not found`);
        return;
      }
      core.debug(JSON.stringify(card));

      // find member
      if (board.members) {
        const member = board.members.find(m => m.username === username);
        if (member) {
          core.debug(JSON.stringify(member));

          if (!card.assignees) {
            card.assignees = [];
          }

          // add assignee to the card
          card.assignees.push({
            id: member.id as string
          });

          // update card
          await GloSDK(authToken).boards.cards.edit(boardId, cardId, card);
        }
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

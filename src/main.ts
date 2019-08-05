import * as core from '@actions/core';
import GloSDK from '@axosoft/glo-sdk';

async function run() {
  const authToken = core.getInput('authToken');
  const boardID = core.getInput('boardID');
  const cardID = core.getInput('cardID');
  const username = core.getInput('assignee');

  try {
    // find the board { id, labels }
    const board = await GloSDK(authToken).boards.get(boardID, {
      fields: ['members']
    });
    if (!board) {
      core.setFailed(`Board ${boardID} not found`);
      return;
    }
    core.debug(JSON.stringify(board));

    // find the card { id, labels }
    const card = await GloSDK(authToken).boards.cards.get(boardID, cardID, {
      fields: ['assignees']
    });
    if (!card) {
      core.setFailed(`Card ${cardID} not found`);
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
        await GloSDK(authToken).boards.cards.edit(boardID, cardID, card);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

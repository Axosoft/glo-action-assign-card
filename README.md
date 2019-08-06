# GitHub action to add an assignee to a Glo Boards card

Use this action to add an assignee to a card on a [Glo Board](https://www.gitkraken.com/glo).
The action requires the board ID, card ID, and assignee username as inputs.

## Requirements
The action requires an auth token in the form of a PAT that you can create in your GitKraken account.
See the [Personal Access Tokens](https://support.gitkraken.com/developers/pats/) page on our support site.

This token should be stored in your GitHub repo secrets (in repo Settings -> Secrets).

## Usage
Add a step in your workflow file to perform this action:
```yaml
    steps:
    - uses: Axosoft/glo-action-assign-card@v1
      with:
        authToken: ${{ secrets.GLO-PAT }}
        boardID: '12345'
        cardID: '12345'
        assignee: 'username'
      id: glo-assign
```

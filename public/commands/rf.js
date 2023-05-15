// rf command refreshes page

import { registerCommand } from 'ethix:commands';

registerCommand('rf', 'Refreshes the page', () => {
    location.reload();
});

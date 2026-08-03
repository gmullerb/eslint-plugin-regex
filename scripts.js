//  Copyright (c) 2026-present Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const readline = require('node:readline/promises')
const { styleText } = require('node:util')

module.exports = {
  scripts: {
    'get-publish-confirmation': async () => {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
      let confirmation
      try {
        confirmation = await rl.question(styleText(['bold', 'magenta'], '\nYour about to publish, Continue (y/n):'))
      }
      catch {}
      finally {
        rl.close()
      }
      if (!confirmation || confirmation.toLocaleLowerCase() !== 'y') {
        console.info(styleText(['red', 'bold'], 'Publish abort'))
        process.exit(1)
      }
    }
  }
}

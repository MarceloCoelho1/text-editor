# Text Editor 

A simple text editor that runs Node.js in the browser/client-side, developed using React and web containers.

## Overview

The editor is using Node.js version 16, but you can do everything that Node.js allows up to this version. You can create servers, download dependencies, all of this running on the client side.

If you want to add any other dependencies, simply place them in the package.json file located in the codeEditor.tsx file.

```javascript
await webContainer.mount({
        'index.js': {
            file: {
                contents: code
            },
        },
        'package.json': {
            file: {
                contents: `
                    {
                        "name": "example-app",
                        "type": "module",
                        "dependencies": {
                            "chalk": "latest"
                        },
                        "scripts": {
                            "start": "node index.js"
                        }
                        
                    }
                `.trim()
            }
        }
    })
´´´
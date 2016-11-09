# VoxImplant Publisher

This is a *very* simple library that does idempotent VoxImplant scenario 
script update for you.

As for now, it supports tiny yet sufficient API:

```js
var publisher = require('voximplant-publisher'),
    authentication = {
        account_id: 1001010,
        api_key: '452aa74b-0a3d-40e7-96dc-22a9695eb35a'
    },
    promise;
    
promise = publisher(authentication).publish('callback', '<script content>');

// do whatever feels natural
```

Publisher will take care of finding correct endpoint (create or update?)
and set your script up.

At the moment this documentation being written authentication data is 
passed as-is, however, this is subject to change.

## Debugging

This project uses classid debug module, which can be turned on with
`DEBUG=ama-team.voximplant-publisher.*` environment variable.
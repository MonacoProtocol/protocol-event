#!/bin/sh

gpg --symmetric --cipher-algo AES256 "$WALLET_JSON.json"
echo 'Done'

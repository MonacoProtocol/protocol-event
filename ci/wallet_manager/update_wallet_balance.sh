#!/bin/sh

# get wallet balance in SOL and return digit value only
# fund if needed
WALLET_BALANCE=`solana balance ./ci/wallet_manager/wallet.json | tr -cd '0-9'`
if [ $WALLET_BALANCE -lt 1 ]
then
    echo "Current balance is $WALLET_BALANCE SOL - adding 1 SOL"
    solana airdrop --verbose 1 wallet.json
else
    echo "$WALLET_BALANCE SOL in wallet - no airdrop required"
fi
echo 'Done'

#!/bin/bash

# deploy program by environment and type - will fail if the program does not have a program ID registered in ci/deploy_manager/program_data.json

# usage  ./ci/deploy_manager/deploy_program.sh -e ENVIRONMENT -t BUILD_TYPE < stable | dev > -f FILE_PATH
# ./ci/deploy_manager/deploy_program.sh -e devnet -t dev -f target/deploy/0.1.0.dev.bbb9c3df.so

set -euxo pipefail

TYPE="development"
PROGRAM="externalevent"
FILE_PATH="target/deploy/$PROGRAM.so"

while getopts t:e:f: flag
do
    case "${flag}" in
        t) TYPE=${OPTARG};;
        e) ENVIRONMENT=${OPTARG};;
        f) FILE_PATH=${OPTARG};;
    esac
done

WALLET_MANAGER="./ci/wallet_manager"
DEPLOY_MANAGER="./ci/deploy_manager"
PROGRAM_ID=`$DEPLOY_MANAGER/get_program_data.sh -e $ENVIRONMENT -t $TYPE | jq -r .program_id`

if [ $PROGRAM_ID == null ]
then
    echo "No Program ID found \nAborting Deploy"
    exit 1
else
    echo "Program ID: $PROGRAM_ID"
fi

echo "Upgrading $PROGRAM on $ENVIRONMENT from location $FILE_PATH"
anchor upgrade --provider.cluster $ENVIRONMENT --provider.wallet $WALLET_MANAGER/wallet.json --program-id $PROGRAM_ID $FILE_PATH

#!/bin/sh

# get the last deploy for a program by program name and environment

# usage  ./get_last_deploy.sh -p PROGRAM -e ENVIRONMENT

while getopts p:e: flag
do
    case "${flag}" in
        p) PROGRAM=${OPTARG};;
        e) ENVIRONMENT=${OPTARG};;
    esac
done

HISTORY_FILE="./ci/deploy_manager/${ENVIRONMENT}_history/${PROGRAM}.json"

jq '.deploys | max_by(.deployment_id)' $HISTORY_FILE

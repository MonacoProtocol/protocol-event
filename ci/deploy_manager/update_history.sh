#!/bin/sh

# bash script to log deployment history taking in arguement flags and checking the deploy history file for previous deploy information
# usage ./update_deploy_history.sh -a ACTIONEER -e ENVIRONMENT -v SEMANTIC_VERSION -s SHA_CHECKSUM -p PROGRAM -n "additional notes"

NOTES="Standard deploy"

while getopts p:e:a:v:s:n: flag
do
    case "${flag}" in
        p) PROGRAM=${OPTARG};;
        e) ENVIRONMENT=${OPTARG};;
        a) ACTIONED_BY=${OPTARG};;
        v) VERSION=${OPTARG};;
        s) SHA_CHECKSUM=${OPTARG};;
        n) NOTES=${OPTARG};;
    esac
done

HISTORY_FILE="./ci/deploy_manager/${ENVIRONMENT}_history/${PROGRAM}.json"

# getting previous deploy info and constructing deploy id + timestamp
GET_LAST_DEPLOY=`echo ./ci/deploy_manager/get_last_deploy.sh -p $PROGRAM -e $ENVIRONMENT`
PREVIOUS_VERSION=`$GET_LAST_DEPLOY | jq .new_version`
PREVIOUS_DEPLOY_ID=`$GET_LAST_DEPLOY | jq .deployment_id`
DEPLOY_ID=`echo ${PREVIOUS_DEPLOY_ID} + 1 | bc`
TIME=`date +"%d-%m-%y-%T"`

# form deployment info json - using cat and a here-file to make it easier to read in this script
DEPLOY_JSON=$( cat << END
    {
        "deployment_id": ${DEPLOY_ID},
        "new_version": {
            "version": "${VERSION}",
            "checksum": "${SHA_CHECKSUM}"
        },
        "previous_version": ${PREVIOUS_VERSION},
        "time": "${TIME}",
        "actioned_by": "${ACTIONED_BY}",
        "notes": "${NOTES}"
    }
END
)

# create tmp file and then update with latest deploy info - appending it to the front of the list
touch tmp
jq --argjson deploy_info "$DEPLOY_JSON" '.deploys += [$deploy_info]' $HISTORY_FILE  > tmp
mv tmp $HISTORY_FILE

jq '.deploys | max_by(.deployment_id)' $HISTORY_FILE

#!/bin/bash

# Full program verification - downloads assets then compares checksums

# usage ./verify_program.sh -p PROGRAM -e ENVIRONMENT (devnet/testnet/mainnet-beta) -b AWS_BUCKET

set -e

ENVIRONMENT="mainnet-beta"
SECURITY_MANAGER="./ci/security_manager"

while getopts p:e:b: flag
do
    case "${flag}" in
        p) PROGRAM=${OPTARG};;
        e) ENVIRONMENT=${OPTARG};;
        b) BUCKET=${OPTARG};;
    esac
done

${SECURITY_MANAGER}/verify_program_get_assets.sh -p ${PROGRAM} -e ${ENVIRONMENT} -b ${BUCKET}
${SECURITY_MANAGER}/verify_program_checksum_check.sh -c ${PROGRAM}.so -p download/${PROGRAM}.so

rm -f -R ${PROGRAM}.so download/${PROGRAM}.so

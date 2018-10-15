#!/usr/bin/env bash

npm run build;

echo "Deploying Kaiju"
firebase use cryptokaiju;
firebase deploy;

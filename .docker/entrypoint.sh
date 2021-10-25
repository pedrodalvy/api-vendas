#!/bin/bash
# run chmod +x entrypoint.sh

yarn install
yarn typeorm migration:run
yarn dev

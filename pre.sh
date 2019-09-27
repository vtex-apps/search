#!/bin/bash

function lint()
{
  cd $1
  [ -d node_modules ] && rm -rf node_modules
  yarn cache clean
  yarn --frozen-lockfile
  yarn run tslint --fix --project .
  yarn run prettier --write "**/*.ts"
  yarn check
  cd ..
}

lint node
lint react

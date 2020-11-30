#!/bin/bash
# grab local token, account and workspace
token=$(vtex local token)
account=$(vtex local account)
workspace=$(vtex local workspace)

resolvedConfig="resolved-cypress.json"

# replace <account> and <workspace> placeholders in baseUrl
# and write config to $resolvedConfig
node -e "c=require('./cypress.json');console.log(JSON.stringify({...c,baseUrl:c.baseUrl.split('<account>').join('$account').split('<workspace>').join('$workspace')}, null, 2))" > $resolvedConfig

# expose local token to Cypress tests
export CYPRESS_authToken=$token

# cmd is either 'open' or 'run'
cmd=$1

# discard cmd from argument list
shift

npx cypress $cmd -C $resolvedConfig "$@" --browser chrome

rm $resolvedConfig

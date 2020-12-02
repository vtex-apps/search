#!/bin/bash
# grab local token, account and workspace
token=$(vtex local token)
account=$(vtex local account)
workspace=$(vtex local workspace)

resolvedConfig="resolved-cypress.json"

# replace <account> and <workspace> placeholders in baseUrl
# and write config to $resolvedConfig
cat cypress.json | sed -e "s/<workspace>/$workspace/" | sed -e "s/<account>/$account/" > $resolvedConfig

# expose local token to Cypress tests
export CYPRESS_authToken=$token

# cmd is either 'open' or 'run'
cmd=$1

# discard cmd from argument list
shift

yarn cypress $cmd -C $resolvedConfig "$@" --browser chrome

rm $resolvedConfig

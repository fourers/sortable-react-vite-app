#!/usr/bin/env bash
set -euo pipefail

# pushd backend > /dev/null

# ruff check --fix
# ruff format

# popd > /dev/null

pushd frontend > /dev/null

yarn run test

popd > /dev/null

#!/usr/bin/env bash
set -euo pipefail

pushd backend > /dev/null

pip install -r requirements.txt

popd > /dev/null

pushd frontend > /dev/null

yarn install

popd > /dev/null

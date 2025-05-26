#!/usr/bin/env bash
set -euo pipefail

pushd "${DEVBOX_PROJECT_ROOT}/backend" > /dev/null

pip install -r requirements.txt

popd > /dev/null

pushd "${DEVBOX_PROJECT_ROOT}/frontend" > /dev/null

yarn install

popd > /dev/null

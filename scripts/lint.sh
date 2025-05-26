#!/usr/bin/env bash
set -euo pipefail

pushd "${DEVBOX_PROJECT_ROOT}/backend" > /dev/null

ruff check --fix
ruff format

popd > /dev/null

pushd "${DEVBOX_PROJECT_ROOT}/frontend" > /dev/null

yarn run lint:fix

popd > /dev/null

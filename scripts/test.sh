#!/usr/bin/env bash
set -euo pipefail

pushd "${DEVBOX_PROJECT_ROOT}/backend" > /dev/null

pytest --cov=.

popd > /dev/null

pushd "${DEVBOX_PROJECT_ROOT}/frontend" > /dev/null

yarn run test:coverage

popd > /dev/null

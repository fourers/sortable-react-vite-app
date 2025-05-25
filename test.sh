#!/usr/bin/env bash
set -euo pipefail

pushd backend > /dev/null

pytest --cov=. --cov-report=term-missing

popd > /dev/null

pushd frontend > /dev/null

yarn run test:coverage

popd > /dev/null

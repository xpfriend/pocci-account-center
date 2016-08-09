#!/bin/sh
set -ex

BASE_DIR=$(cd $(dirname $0)/..; pwd)

cd ${BASE_DIR}
docker build -t xpfriend/pocci-account-center:latest .

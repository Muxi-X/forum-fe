#!/usr/bin/env bash

set -e
trap 'echo "Script interrupted."; exit 1' SIGINT

imageRepo=$1
imageTag=${2:-latest}
if [[ -z "$imageRepo" ]]; then
  echo "Usage: ./push.sh <image-repo> [image-tag]"
  exit 1
fi

echo -e "\n\033[1;34m🔧🔧🔧 Building and pushing image forum_fe🔧🔧🔧\033[0m\n"

docker build -t "forum_fe:$imageTag" .
docker tag "forum_fe:$imageTag" "$imageRepo/forum_fe:$imageTag"
docker push "$imageRepo/forum_fe:$imageTag"

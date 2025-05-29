#!/bin/bash
cd /home/kavia/workspace/code-generation/reactchatsecure-102972-9d9b82f5/reactchatsecure
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


#!/usr/bin/env bash

PID=$(ps wuax | grep mongo | awk '{ print $2 }' | sort -n | head -1)
kill $PID
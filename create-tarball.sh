#!/bin/bash

# Script to create a clean deployment tarball for jobsearch
# Excludes macOS metadata files and build artifacts

echo "Creating deployment tarball..."

COPYFILE_DISABLE=1 tar \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='jobsearch.tar.gz' \
  --exclude='.next' \
  --exclude='._*' \
  --exclude='.DS_Store' \
  --exclude='*.log' \
  --exclude='.env.local' \
  -czf jobsearch.tar.gz .

if [ $? -eq 0 ]; then
    echo "✅ Tarball created successfully!"
    ls -lh jobsearch.tar.gz
else
    echo "❌ Failed to create tarball"
    exit 1
fi


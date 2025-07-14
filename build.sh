#!/bin/bash

# Build webOS IPK package using Docker
echo "Building webOS IPK package..."

# Use the vitalets/tizen-webos-sdk Docker image
docker run --rm \
  -v $(pwd):/app \
  -w /app \
  vitalets/tizen-webos-sdk \
  ares-package --no-minify .

echo "Build complete. Look for the .ipk file in the current directory."
#!/bin/bash

# create files json
# for i in {34..299}; do touch "$i.json"; done

# Image folder
IMAGE_DIR="./images"

# Check, have folder
if [ ! -d "$IMAGE_DIR" ]; then
  echo "folder $IMAGE_DIR undefined. Check path."
  exit 1
fi

# Collect file names with .png
mapfile -t FILES < <(find "$IMAGE_DIR" -type f -name "*.png")

# Check, have files
if [ ${#FILES[@]} -eq 0 ]; then
  echo "In folder $IMAGE_DIR no files with .png."
  exit 1
fi

# Shuffle array
shuf_files=($(shuf -e "${FILES[@]}"))

# Count for rename
counter=157

# Renamed files
for file in "${shuf_files[@]}"; do
  # Get directory and new file name
  dir=$(dirname "$file")
  new_name="$dir/$counter.png"

  # Check, have files with new name
  if [ -e "$new_name" ]; then
    echo "File $new_name already exists. Skip."
    continue
  fi

  # Rename file
  mv "$file" "$new_name"
  echo "Renamed: $file -> $new_name"

  # Add counter
  ((counter++))
done

echo "Ready!"

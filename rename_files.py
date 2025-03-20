#!/usr/bin/env python3
import os
import sys

# List of file extensions to process
TYPES_TO_CONVERT = [
    'ts',
    'js',
    'py',
    'tact',
    'tolk',
    'fc',
    'func',
    'fif',
    'sh',
    'snap'
    # Add other extensions if needed
]

# Default directory path
DEFAULT_DIRECTORY = ".knowlenge"

def rename_files(directory: str) -> None:
    """
    Recursively renames files in the directory by adding 'txt' to specified extensions.
    
    Args:
        directory (str): Path to directory
    """
    for root, _, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            
            # Check all file extensions
            for ext in TYPES_TO_CONVERT:
                if file.endswith('.' + ext):
                    # Create new filename
                    new_name = file + 'txt'
                    new_path = os.path.join(root, new_name)
                    
                    try:
                        os.rename(file_path, new_path)
                        print(f"Renamed: {file} -> {new_name}")
                    except Exception as e:
                        print(f"Error renaming {file}: {str(e)}", file=sys.stderr)
                    break  # Stop after first match

def main():
    # Use default directory or directory from command line argument
    directory = DEFAULT_DIRECTORY if len(sys.argv) == 1 else sys.argv[1]
    
    if not os.path.exists(directory):
        print(f"Error: Directory '{directory}' does not exist", file=sys.stderr)
        sys.exit(1)
        
    print(f"Starting file processing in directory: {directory}")
    print(f"Files with these extensions will be processed: {', '.join(TYPES_TO_CONVERT)}")
    
    rename_files(directory)
    
    print("Processing completed")

if __name__ == "__main__":
    main() 
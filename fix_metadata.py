import os
import re

def fix_file(file_path):
    with open(file_path, 'r') as f:
        lines = f.readlines()
    
    changed = False
    new_lines = []
    for line in lines:
        # Match lines that have 'title: "' followed by something, ending with ',' but NO closing quote
        # Regex: matches whitespace, title: ", characters that are not double quotes, then comma, then optional whitespace and newline
        # Example match:   title: "My Page,
        match = re.search(r'^(\s*title:\s*"[^"]+),(\s*)$', line)
        if match:
            new_line = match.group(1) + '",' + match.group(2) + '\n'
            new_lines.append(new_line)
            changed = True
        else:
            new_lines.append(line)
    
    if changed:
        with open(file_path, 'w') as f:
            f.writelines(new_lines)
        return True
    return False

# Search for all .tsx files
for root, dirs, files in os.walk('src/app'):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            if fix_file(path):
                print(f"Fixed: {path}")


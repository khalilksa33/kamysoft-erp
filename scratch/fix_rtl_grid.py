import re

file_path = 'frontend/src/index.css'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the grid-column bug for RTL main-content
pattern = r'(body\[dir="rtl"\] .main-content\s*\{[^}]*?)grid-column:\s*1\s*;'
content = re.sub(pattern, r'\1grid-column: 2;', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed RTL grid column in index.css')

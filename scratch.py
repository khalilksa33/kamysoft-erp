import re

file_path = r'f:\kamysoft-erp\frontend\dist\assets\index-fJcIIJhn.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix matrix
old_matrix = r'children:\[([a-zA-Z_])\("strong",\{children:([a-zA-Z_]+\.en)\}\),\1\("br",\{\}\),\1\("span",\{style:\{fontSize:"11px",color:"var\(--text-secondary\)"\},children:([a-zA-Z_]+\.ar)\}\)\]'
new_matrix = r'children:\1("strong",{children:currentLanguage==="ar"?\3:\2})'
content = re.sub(old_matrix, new_matrix, content)

# Fix ExtraServices Arabic Name column header
content = re.sub(r'([a-zA-Z_])\("th",\{children:[a-zA-Z_]+\?"الاسم بالعربية":"Arabic Name"\}\),?', '', content)

# Fix ExtraServices Arabic Name column data
content = re.sub(r'([a-zA-Z_])\("td",\{children:([a-zA-Z_]+\.nameAR)\|\|"-"\}\),?', '', content)

# Fix ExtraServices name render
content = re.sub(r'([a-zA-Z_])\("strong",\{children:([a-zA-Z_]+\.nameEN)\}\)', r'\1("strong",{children:isAr?(\2.replace("EN","AR")||\2):\2})', content)

# Fix ExtraServices Actions
# Old inline buttons regex... actually it's easier to just rebuild it, but let's check task 273!

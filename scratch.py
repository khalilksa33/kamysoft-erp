import re
with open('frontend/src/App.old.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('البيانات الأساسية ونشاط النظام')
if start != -1:
    card_start = text.rfind('<div className=\"glass-card\">', 0, start)
    print(text[card_start:card_start+4000])

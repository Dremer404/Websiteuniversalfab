import os, re
base_dir = r'c:\Mes Sites Web\onto universal\ontooriginal\studio-onto.com'
files = ['work.html', 'vault.html', 'select.html', 'science.html', 'openstore.html', 'microsoft.html', 'floral.html']

for f in files:
    path = os.path.join(base_dir, f)
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 1. Remove <span>Venture Studio</span>
    content = re.sub(r'<span>\s*Venture Studio\s*</span>', '', content)
    
    # 2. Replace <div id="logo-footer"></div> with text
    content = re.sub(r'<div id="logo-footer"></div>', '<h1 style="font-size: 3rem; margin-bottom: 2rem; font-weight: bold; text-transform: uppercase; font-family: sans-serif;">Universal fab</h1>', content)
    
    # 3. Replace the heading
    content = re.sub(r'<h2>We are a full-service venture studio that founders trust to create products that become verbs</h2>', "<h2>Rejoignez Universal Fab et devenez actionnaire d'une entreprise innovante qui transforme l'avenir de la restauration.</h2>", content)
    
    # 4. Modify the get in touch link
    pattern = r'<a href="mailto:noa@studio-onto\.com">\s*<span>Get in touch</span>'
    repl = '<a href="https://www.actionuniversalfab.com" target="_blank">\n                  <span>espace actionnaire</span>'
    content = re.sub(pattern, repl, content)
    
    with open(path, 'w', encoding='utf-8') as file:
        file.write(content)

print("Done_Replacing")

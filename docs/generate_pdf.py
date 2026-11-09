import markdown
import subprocess
import os

md_path = "Technical_Design_Document.md"
html_path = "docs/Technical_Design_Document.html"
pdf_path = "docs/Technical_Design_Document.pdf"
root_pdf_path = "Technical_Design_Document.pdf"

with open(md_path, "r", encoding="utf-8") as f:
    text = f.read()

html_body = markdown.markdown(text, extensions=['tables', 'fenced_code'])

styled_html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Technical Design Document - The Serai Ridge Estate & Resort</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
  
  @page {{
    size: A4;
    margin: 20mm 15mm 20mm 15mm;
  }}

  body {{
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    color: #18241E;
    line-height: 1.6;
    font-size: 10pt;
    background: #FFFFFF;
  }}

  h1, h2, h3, h4 {{
    font-family: 'Playfair Display', Georgia, serif;
    color: #193325;
    page-break-after: avoid;
  }}

  h1 {{
    font-size: 20pt;
    border-bottom: 2px solid #193325;
    padding-bottom: 4px;
    margin-top: 18pt;
    margin-bottom: 10pt;
  }}

  h2 {{
    font-size: 14pt;
    color: #3E2417;
    margin-top: 14pt;
    margin-bottom: 6pt;
  }}

  h3 {{
    font-size: 11.5pt;
    margin-top: 10pt;
    margin-bottom: 4pt;
  }}

  p {{
    margin-top: 0;
    margin-bottom: 8pt;
  }}

  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 12pt 0;
    font-size: 9pt;
    page-break-inside: avoid;
  }}

  th, td {{
    border: 1px solid #D5CFC5;
    padding: 6pt 8pt;
    text-align: left;
  }}

  th {{
    background-color: #EBF2ED;
    color: #193325;
    font-weight: 700;
  }}

  tr:nth-child(even) {{
    background-color: #FAF8F5;
  }}

  code {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    background: #F3EFEA;
    padding: 1pt 3pt;
    border-radius: 3px;
    color: #244634;
  }}

  pre {{
    background: #18241E;
    color: #E0E8E3;
    padding: 10pt;
    border-radius: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    overflow-x: auto;
    page-break-inside: avoid;
  }}

  pre code {{
    background: transparent;
    color: #E0E8E3;
    padding: 0;
  }}

  ul, ol {{
    margin-top: 0;
    margin-bottom: 8pt;
    padding-left: 20pt;
  }}

  li {{
    margin-bottom: 3pt;
  }}

  blockquote {{
    border-left: 4px solid #C59B27;
    margin: 8pt 0;
    padding-left: 10pt;
    color: #57685F;
    font-style: italic;
  }}

  .badge {{
    display: inline-block;
    padding: 2px 6px;
    font-size: 8pt;
    font-weight: 600;
    border-radius: 4px;
    background: #EBF2ED;
    color: #193325;
  }}
</style>
</head>
<body>
{html_body}
</body>
</html>
"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(styled_html)

print("Saved HTML to", html_path)

# Run Edge headless to print to PDF
edge_cmd = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={os.path.abspath(pdf_path)}",
    os.path.abspath(html_path)
]

res = subprocess.run(edge_cmd, capture_output=True, text=True)
if res.returncode == 0:
    print("Successfully generated PDF at", pdf_path)
    # Also copy to root
    with open(pdf_path, "rb") as src, open(root_pdf_path, "wb") as dst:
        dst.write(src.read())
    print("Copied PDF to root at", root_pdf_path)
else:
    print("Edge headless failed:", res.stderr)


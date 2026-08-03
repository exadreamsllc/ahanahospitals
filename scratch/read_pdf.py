import pypdf

reader = pypdf.PdfReader("/Users/exadreamsllc/Downloads/Ahana_Cloudflare_V3_1/ahana-v3-next/public/assets/brochures/dr-c-ramasubramanian-profile.pdf")
print("Total pages:", len(reader.pages))

for i, page in enumerate(reader.pages):
    print(f"\n--- PAGE {i + 1} ---")
    print(page.extract_text())

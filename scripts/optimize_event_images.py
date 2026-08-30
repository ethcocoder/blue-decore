from pathlib import Path
from PIL import Image

asset_dir = Path("client/public/images/blue-decore")
for source in sorted(asset_dir.glob("*.png")):
    destination = source.with_suffix(".jpg")
    with Image.open(source) as image:
        image = image.convert("RGB")
        image.thumbnail((1600, 1200), Image.Resampling.LANCZOS)
        image.save(destination, "JPEG", quality=84, optimize=True, progressive=True)

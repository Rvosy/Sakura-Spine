"""Build the installable plugin ZIP without developer files or local data."""
import argparse
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
FILES = ["plugin.yaml", "plugin.py", "controller.mjs", "editor.mjs", "renderer.mjs",
         "studio.mjs", "hit-test.mjs", "README.md", "LICENSE", "NOTICE"]
DIRECTORIES = ["vendor", "preview"]


def package(tag=None):
    manifest = (ROOT / "plugin.yaml").read_text(encoding="utf-8")
    version = re.search(r"^version: (\d+\.\d+\.\d+)$", manifest, re.MULTILINE).group(1)
    if tag is not None and tag != "v" + version:
        raise ValueError("Tag must match plugin.yaml version: v" + version)
    files = [ROOT / name for name in FILES]
    for name in DIRECTORIES:
        files.extend(path for path in (ROOT / name).rglob("*") if path.is_file())
    for path in files:
        if not path.is_file() or path.is_symlink():
            raise ValueError("Invalid package file: " + str(path))
    output = ROOT / "dist/sakura.visual.spine.zip"
    output.parent.mkdir(exist_ok=True)
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(files):
            archive.write(path, path.relative_to(ROOT).as_posix())
    print(output)
    return output


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--tag")
    package(parser.parse_args().tag)

import os
import json

SOUND_ROOT = "sounds"

AUDIO_EXTENSIONS = (
    ".mp3",
    ".wav",
    ".ogg",
    ".flac",
    ".aac",
    ".m4a"
)

IMAGE_EXTENSIONS = (
    ".png",
    ".jpg",
    ".jpeg",
    ".webp"
)


def build_folder(folder_path, relative_path=""):

    node = {
        "name": os.path.basename(folder_path),
        "path": relative_path.replace("\\", "/"),
        "type": "folder",
        "info": "",
        "icon": None,
        "banner": None,
        "children": [],
        "stats": {
            "folders": 0,
            "files": 0
        }
    }

    info_file = os.path.join(folder_path, "direc.info")

    if os.path.exists(info_file):
        with open(info_file, "r", encoding="utf8") as f:
            node["info"] = f.read().strip()

    for item in sorted(os.listdir(folder_path)):

        full = os.path.join(folder_path, item)

        rel = os.path.join(relative_path, item).replace("\\", "/")

        if os.path.isdir(full):

            child = build_folder(full, rel)

            node["children"].append(child)

            node["stats"]["folders"] += 1
            node["stats"]["folders"] += child["stats"]["folders"]
            node["stats"]["files"] += child["stats"]["files"]

            continue

        lower = item.lower()

        if lower == "folder.png":
            node["icon"] = rel
            continue

        if lower == "banner.png":
            node["banner"] = rel
            continue

        if lower.endswith(AUDIO_EXTENSIONS):

            node["children"].append({

                "type": "audio",

                "name": item,

                "path": rel,

                "extension": os.path.splitext(item)[1][1:].lower()

            })

            node["stats"]["files"] += 1

    return node


tree = build_folder(SOUND_ROOT)

with open("index.json", "w", encoding="utf8") as f:
    json.dump(tree, f, indent=4)

print("Generated index.json")

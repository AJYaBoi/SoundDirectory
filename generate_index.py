import json
import os
from pathlib import Path
from datetime import datetime

# ==========================================================
# Configuration
# ==========================================================

SOUND_ROOT = Path("sounds")
OUTPUT_FILE = Path("index.json")

AUDIO_EXTENSIONS = {
    ".mp3",
    ".wav",
    ".ogg",
    ".flac",
    ".aac",
    ".m4a"
}

IMAGE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".webp"
}

DIRECTORY_INFO = "direc.info"
DIRECTORY_JSON = ".directory.json"

FOLDER_ICON_NAMES = [
    "folder.png",
    "folder.jpg",
    "folder.jpeg",
    "folder.webp"
]

BANNER_NAMES = [
    "banner.png",
    "banner.jpg",
    "banner.jpeg",
    "banner.webp"
]

# ==========================================================
# Site Metadata
# ==========================================================

site_meta = {
    "generator": "Mewtindew Sound Directory",
    "version": "1.0.0",
    "generated": datetime.utcnow().isoformat() + "Z",
    "totalFolders": 0,
    "totalAudio": 0
}

search = []

# ==========================================================
# Helpers
# ==========================================================

def unix_path(path):
    return str(path).replace("\\", "/")


def relative(path):

    return "sounds/" + unix_path(
        path.relative_to(SOUND_ROOT)
    )


def human_size(size):

    units = [
        "B",
        "KB",
        "MB",
        "GB",
        "TB"
    ]

    value = float(size)

    for unit in units:

        if value < 1024:

            return f"{value:.1f} {unit}"

        value /= 1024

    return f"{value:.1f} PB"


def pretty_name(filename):

    stem = Path(filename).stem

    stem = stem.replace("_", " ")
    stem = stem.replace("-", " ")

    words = []

    for word in stem.split():

        words.append(word.capitalize())

    return " ".join(words)


# ==========================================================
# Optional .directory.json
# ==========================================================

def load_directory_json(folder):

    file = folder / DIRECTORY_JSON

    if not file.exists():

        return {}

    try:

        with open(file, "r", encoding="utf8") as f:

            return json.load(f)

    except Exception as e:

        print(f"Could not read {file}: {e}")

        return {}


# ==========================================================
# direc.info
# ==========================================================

def load_directory_info(folder):

    info = folder / DIRECTORY_INFO

    if not info.exists():

        return ""

    return info.read_text(
        encoding="utf8",
        errors="ignore"
    ).strip()


# ==========================================================
# Detect Images
# ==========================================================

def detect_image(folder, names):

    for name in names:

        file = folder / name

        if file.exists():

            return relative(file)

    return None


# ==========================================================
# Audio Node
# ==========================================================

def build_audio_node(file, folder_path):

    size = file.stat().st_size

    return {

        "type": "audio",

        "name": file.name,

        "displayName": pretty_name(file.name),

        "extension": file.suffix.lower()[1:],

        "path": relative(file),

        "folder": folder_path,

        "size": size,

        "sizeText": human_size(size)

    }


# ==========================================================
# Folder Node
# ==========================================================

def empty_folder(folder, relative_path):

    return {

        "type": "folder",

        "name": folder.name,

        "title": folder.name,

        "path": relative_path,

        "parent": "",

        "depth": 0,

        "breadcrumbs": [],

        "info": "",

        "icon": None,

        "banner": None,

        "settings": {},

        "children": [],

        "stats": {

            "folders": 0,

            "files": 0

        }

    }


# ==========================================================
# Search Helper
# ==========================================================

def add_search(entry):

    search.append(entry)


# ==========================================================
# Lookup Helper
# ==========================================================


def build_folder(folder, parent_path="", breadcrumbs=None):

    if breadcrumbs is None:
        breadcrumbs = []

    rel_path = relative(folder) if folder != SOUND_ROOT else ""

    node = empty_folder(folder, rel_path)

    node["parent"] = parent_path
    node["depth"] = len(breadcrumbs)
    node["breadcrumbs"] = breadcrumbs.copy()

    # Load optional metadata
    settings = load_directory_json(folder)

    node["settings"] = settings

    if "title" in settings:
        node["title"] = settings["title"]

    node["info"] = load_directory_info(folder)

    icon = detect_image(folder, FOLDER_ICON_NAMES)
    banner = detect_image(folder, BANNER_NAMES)

    if icon:
        node["icon"] = icon

    if banner:
        node["banner"] = banner

    site_meta["totalFolders"] += 1

    #
    # Walk contents
    #

    for item in sorted(folder.iterdir(), key=lambda p: (p.is_file(), p.name.lower())):

        if item.name.startswith(".") and item.name != ".directory.json":
            continue

        if item.name == DIRECTORY_INFO:
            continue

        if item.name in FOLDER_ICON_NAMES:
            continue

        if item.name in BANNER_NAMES:
            continue

        #
        # Folder
        #

        if item.is_dir():

            child = build_folder(

                item,

                rel_path,

                breadcrumbs + [item.name]

            )

            node["children"].append(child)

            node["stats"]["folders"] += 1
            node["stats"]["folders"] += child["stats"]["folders"]
            node["stats"]["files"] += child["stats"]["files"]

            continue

        #
        # Audio
        #

        if item.suffix.lower() in AUDIO_EXTENSIONS:

            audio = build_audio_node(item, rel_path)

            node["children"].append(audio)

            node["stats"]["files"] += 1

            site_meta["totalAudio"] += 1

            add_search({

                "type": "audio",

                "name": audio["displayName"],

                "filename": audio["name"],

                "folder": rel_path,

                "path": audio["path"],

                "keywords": (

                    audio["displayName"]

                    + " "

                    + rel_path.replace("/", " ")

                ).lower()

            })

    #
    # Folder search entry
    #

    add_search({

        "type": "folder",

        "name": node["title"],

        "path": rel_path,

        "keywords": (

            node["title"]

            + " "

            + node["info"]

        ).lower()

    })

    #
    # Lookup table
    #


    return node


# ==========================================================
# Build Tree
# ==========================================================

tree = build_folder(SOUND_ROOT)

# ==========================================================
# Final JSON
# ==========================================================

output = {

    "meta": site_meta,

    "search": search,

    "tree": tree

}

with open(

    OUTPUT_FILE,

    "w",

    encoding="utf8"

) as f:

    json.dump(

        output,

        f,

        indent=4,

        ensure_ascii=False

    )

print()

print("===================================")
print(" Mewtindew Sound Directory Builder ")
print("===================================")

print(f"Folders : {site_meta['totalFolders']}")
print(f"Audio   : {site_meta['totalAudio']}")
print(f"Output  : {OUTPUT_FILE}")

print()

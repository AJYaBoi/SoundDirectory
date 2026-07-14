import os
import json

ROOT = "sounds"

AUDIO = (
    ".mp3",
    ".wav",
    ".ogg",
    ".flac",
    ".aac",
    ".m4a"
)

directory = {}

for folder in sorted(os.listdir(ROOT)):

    path = os.path.join(ROOT, folder)

    if not os.path.isdir(path):
        continue

    info = ""

    infoFile = os.path.join(path, "direc.info")

    if os.path.exists(infoFile):
        with open(infoFile, encoding="utf8") as f:
            info = f.read()

    files = []

    for file in sorted(os.listdir(path)):

        if file.lower().endswith(AUDIO):

            files.append({
                "name": file,
                "path": f"{ROOT}/{folder}/{file}"
            })

    directory[folder] = {
        "info": info,
        "files": files
    }

with open("index.json","w",encoding="utf8") as f:
    json.dump(directory,f,indent=4)

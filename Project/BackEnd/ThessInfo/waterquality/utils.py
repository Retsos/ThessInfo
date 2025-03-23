import json
import os
from pathlib import Path
from django.conf import settings

def load_all_data():
    data_dir = Path(settings.BASE_DIR) / 'waterquality' / 'datasheet'
    all_data = []
    
    for filename in os.listdir(data_dir):
        if filename.endswith('.json'):
            file_path = data_dir / filename
            with open(file_path, 'r', encoding='utf-8') as f:
                try:
                    all_data.extend(json.load(f))
                except json.JSONDecodeError:
                    continue
    return all_data
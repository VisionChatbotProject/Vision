
import sys
from SmartAuthoring import config
config._ignore_errors = True

if len(sys.argv) > 2 and sys.argv[2] == '-r':
    config._required_only = True
    
from SmartAuthoring import settings
import json

with open(sys.argv[1], 'w') as file:
    file.write(json.dumps(config.default_conf, indent=4))
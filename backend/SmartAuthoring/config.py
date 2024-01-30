import os 

_ignore_errors = False
_required_only = False

config = {}
default_conf = {}

def read_param(key, default=None, suggestion=None, type=str):
    if _required_only is False:
        default_conf[key] = suggestion if suggestion else default
    elif default is None:
        default_conf[key] = suggestion
    value = config.get(key, None)

    if value is not None:
         return value
    
    value = os.environ.get(key, None)
    if value is not None:
        if type == bool:
            value = value.lower() in ['true', '1']
        elif type == list:
            value = value.split(',')
        elif type == int:
            value = int(value)
        
        return value

    if default is None and _ignore_errors is False:
        raise Exception(f'config param {key} is unset.')
    
    return default if value is None else value

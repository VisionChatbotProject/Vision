import codecs
from django.conf import settings
import json
import bs4
import cssutils
import os
import shutil

import py_scorm.scorm_12 as ps


_html_template = """
<html>
    <head>
    </head>

    <body>
    </body>
</html>
"""

def parse_grapes_content(content):

    parsed = json.loads(content)

    html = codecs.encode(parsed['html'], 'utf-8') 
    css = parsed['css']

    css_text = cssutils.parseString(css).cssText
    styles = '<style>' + css_text.decode('utf-8') + '</style>'
    soup = bs4.BeautifulSoup(_html_template, 'html.parser')

    soup.head.insert(0, bs4.BeautifulSoup(styles, 'html.parser'))
    soup.body.insert(0, bs4.BeautifulSoup(html, 'html.parser'))

    html = soup.prettify()

    return html


def replace_asset_links(html, base_href, course_assets):
    assets = set()
    soup = bs4.BeautifulSoup(html, 'html.parser')
    images = soup.body.find_all('img')
    for img in images:
        src = img.attrs['src']
        target = src.split('/')[-1]
        try:
            if src.startswith(settings.SMART_STUDY_BACKEND_URL):
                asset = course_assets.filter(file=target).first()
                new_name = asset.name
                assets.add(asset)
                target = base_href + new_name
                img.attrs['src'] = target
        except Exception as e:
            print(e)    

    html = soup.prettify()
    return (html, assets)

def copy_assets(assets, target_dir):
    for asset in assets:
        file = asset.file
        target_path = os.path.join(target_dir, str(asset.id))
        if not os.path.exists(target_path):
            shutil.copy(file.path, target_path)

def write_slide(base_name, content, target_path):
    slide_name = str(base_name) + '.html'
    with open(os.path.join(target_path, slide_name), 'w', encoding="utf8") as file:
        file.write(content)

    return slide_name

def create_index(html, slides):

    soup = bs4.BeautifulSoup(html, 'html.parser')
    for slide in slides:
        iframe = '<iframe class="flex-grow-1 slide" src="' + slide + '"></iframe>'
        soup.body.div.insert(0, bs4.BeautifulSoup(iframe, 'html.parser'))

    html = soup.prettify()
    return html
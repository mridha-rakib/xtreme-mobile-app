import re
import os
import base64
import xml.etree.ElementTree as ET

gallery_path = r'C:\Users\rakib_bro\Downloads\XTREME_Concierge_MVP_High_Fidelity_UI_v1.1_Gallery.html'
scratch_dir = r'C:\Users\rakib_bro\.gemini\antigravity\brain\21653daa-a859-4e78-9fd0-d16d6235bd4c\scratch'

with open(gallery_path, 'r', encoding='utf-8') as f:
    text = f.read()

screens = ['CUS-AUTH-04', 'CUS-AUTH-05', 'CUS-AUTH-06', 'CUS-AUTH-07', 'CUS-AUTH-08']

for screen in screens:
    pattern = rf'sid">{screen}</div>.*?src="data:image/svg\+xml;base64,([^"]+)"'
    match = re.search(pattern, text, re.DOTALL)
    if match:
        b64_data = match.group(1)
        svg_bytes = base64.b64decode(b64_data)
        out_path = os.path.join(scratch_dir, f'{screen}.svg')
        with open(out_path, 'wb') as out:
            out.write(svg_bytes)
        print(f'Successfully decoded {screen} ({len(svg_bytes)} bytes)')
        
        # Parse SVG to dump hierarchy
        tree = ET.fromstring(svg_bytes)
        print(f'=== {screen} DETAILS ===')
        for el in tree.iter():
            tag = el.tag.split('}')[-1]
            if tag == 'text':
                t = "".join(el.itertext()).strip()
                print(f'  TEXT: y={el.attrib.get("y")} fs={el.attrib.get("font-size")} fw={el.attrib.get("font-weight")} fill={el.attrib.get("fill")} : "{t}"')
            elif tag == 'rect' and el.attrib.get('fill') != '#FAF8F4':
                print(f'  RECT: y={el.attrib.get("y")} w={el.attrib.get("width")} h={el.attrib.get("height")} rx={el.attrib.get("rx")} fill={el.attrib.get("fill")} stroke={el.attrib.get("stroke")}')
            elif tag == 'line':
                print(f'  LINE: y1={el.attrib.get("y1")} y2={el.attrib.get("y2")} stroke={el.attrib.get("stroke")}')
    else:
        print(f'Could not find screen: {screen}')

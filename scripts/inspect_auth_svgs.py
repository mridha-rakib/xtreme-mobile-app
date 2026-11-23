import xml.etree.ElementTree as ET
import glob
import os

scratch = r'C:\Users\rakib_bro\.gemini\antigravity\brain\21653daa-a859-4e78-9fd0-d16d6235bd4c\scratch'

for name in ['CUS-AUTH-01', 'CUS-AUTH-02', 'CUS-AUTH-03']:
    path = os.path.join(scratch, f'{name}.svg')
    if not os.path.exists(path):
        continue
    print(f'=== {name} ===')
    tree = ET.parse(path)
    root = tree.getroot()
    for el in root.iter():
        tag = el.tag.split('}')[-1]
        if tag == 'text':
            t = "".join(el.itertext()).strip()
            print(f'  TEXT: y={el.attrib.get("y")} fs={el.attrib.get("font-size")} fw={el.attrib.get("font-weight")} fill={el.attrib.get("fill")} : "{t}"')
        elif tag == 'rect' and el.attrib.get('fill') != '#FAF8F4':
            print(f'  RECT: y={el.attrib.get("y")} w={el.attrib.get("width")} h={el.attrib.get("height")} rx={el.attrib.get("rx")} fill={el.attrib.get("fill")} stroke={el.attrib.get("stroke")}')
        elif tag == 'line':
            print(f'  LINE: y1={el.attrib.get("y1")} y2={el.attrib.get("y2")} stroke={el.attrib.get("stroke")}')

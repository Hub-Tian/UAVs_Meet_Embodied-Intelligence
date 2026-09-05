"""Import the locally curated Excel rows; never modify Perception or source files.

Run with Python + openpyxl: python scripts/import_categories.py [workspace]
The workbook's explicit inclusion decision and original row order are authoritative.
"""
import hashlib
import json
import re
import shutil
import sys
from pathlib import Path
from urllib.parse import urlparse

import openpyxl

REPO = Path(__file__).resolve().parents[1]
WORKSPACE = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else REPO.parent
SOURCES = [('具身导航', 'navigation', 20), ('具身抓取', 'manipulation', 9),
           ('具身协同', 'collaboration', 20)]
IMAGE_ALIASES = {
    ('manipulation', 5): 'DDPG.png',
}


def text(value):
    return '' if value is None else str(value).strip()


def rows(path, sheet):
    book = openpyxl.load_workbook(path, read_only=True, data_only=True)
    values = list(book[sheet].values)
    book.close()
    return [(i, dict(zip(values[0], row))) for i, row in enumerate(values[1:], 2)
            if any(value is not None for value in row)]


def split(value):
    return [part.strip() for part in re.split(r'[,，;；\n]+', text(value)) if part.strip()]


def url(value):
    value = text(value)
    if not value or value in ('-', '无', '暂无', 'None'):
        return ''
    parsed = urlparse(value)
    assert parsed.scheme in ('https', 'http') and parsed.netloc, value
    return value


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


papers, manifest = [], []
for folder, slug, expected in SOURCES:
    sheet = folder + '文献汇总表'
    source = WORKSPACE / folder / (sheet + '_cleaned.xlsx')
    records = rows(source, sheet)
    included = [(i, r) for i, r in records if text(r['是否纳入综述']).startswith('是')]
    assert len(included) == expected, (source, len(included), expected)
    provenance = {'category': 'embodied-' + slug, 'source': source.relative_to(WORKSPACE).as_posix(),
                  'sha256': sha(source), 'sheet': sheet, 'rawRows': len(records),
                  'includedRows': len(included), 'excludedRows': [i for i, r in records
                  if not text(r['是否纳入综述']).startswith('是')], 'papers': []}
    for row, r in included:
        identity = f'{slug}-{row:03d}'
        image_source = source.parent / text(r['配图'])
        image_note = ''
        if not image_source.is_file():
            image_name = IMAGE_ALIASES.get((slug, row), text(r['方法名称']) + '.png')
            image_source = source.parent / (folder + '文献图片') / image_name
        if slug == 'manipulation' and row == 9:
            supplement = source.parent / (sheet + '_新增AIR-VLA与AIR-VLA+.xlsx')
            match = [v for _, v in rows(supplement, sheet) if v['论文名称'] == r['论文名称']]
            assert len(match) == 1 and match[0]['论文访问链接'] == r['论文访问链接']
            image_source = source.parent / text(match[0]['配图'])
            image_note = supplement.relative_to(WORKSPACE).as_posix()
        image = 'assets/papers/figure-placeholder.svg'
        target = REPO / f'assets/papers/{slug}/{identity}.png'
        retained_image = False
        if image_source.is_file():
            image = f'assets/papers/{slug}/{identity}{image_source.suffix.lower()}'
            target = REPO / image
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(image_source, target)
        elif target.is_file():
            # A source image may be renamed after an earlier verified import.
            # Keep the already imported asset instead of regressing to fallback.
            image = target.relative_to(REPO).as_posix()
            retained_image = True
        publication = text(r['发表情况'])
        year_match = re.search(r'\b(?:19|20)\d{2}\b', publication) or re.search(r'\b(?:19|20)\d{2}\b', text(r['日期']))
        year = year_match.group() if year_match else ''
        venue = re.sub(r'\s*\b' + year + r'\b\s*', ' ', publication).strip() if year else publication
        authors = text(r['作者'])
        author_list = [a.strip() for a in authors.split(' and ') if a.strip()] if ' and ' in authors else split(authors)
        papers.append({'id': identity, 'category': 'embodied-' + slug,
                       'title': text(r['论文名称']), 'methodName': text(r['方法名称']),
                       'authors': author_list, 'taskTags': split(r['任务标签']),
                       'methodTags': split(r['方法标签']), 'datasets': split(r['数据集']),
                       'venue': venue, 'year': year, 'summary': text(r['方法']),
                       'theFirst': text(r['The First']), 'image': image,
                       'paperUrl': url(r['论文访问链接']), 'codeUrl': url(r['代码链接（如果有的话）'])})
        provenance['papers'].append({'id': identity, 'row': row,
            'inclusion': text(r['是否纳入综述']), 'image': image,
            'imageSource': image_source.relative_to(WORKSPACE).as_posix() if image_source.is_file() else None,
            'imageSha256': sha(target) if target.is_file() else None,
            'imageRetained': retained_image,
            'imageSupplement': image_note or None})
    manifest.append(provenance)

assert len(papers) == 49 and len({p['id'] for p in papers}) == 49
serialized = json.dumps(papers, ensure_ascii=False, indent=2)
(REPO / 'data/category-papers.json').write_text(serialized + '\n', encoding='utf-8')
(REPO / 'assets/js/category-data.js').write_text(
    '// Generated by scripts/import_categories.py; shares the frozen Perception schema.\n'
    'window.PAPERS_DATA.push(...' + serialized + ');\n', encoding='utf-8')
(REPO / 'data/category-provenance.json').write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({p['category']: p['includedRows'] for p in manifest}, ensure_ascii=False))

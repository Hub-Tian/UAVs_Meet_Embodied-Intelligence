#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_readme.py

Generates and updates README.md paper tables strictly following the UAVs_Meet_LLMs format:
## Advances of Embodied Intelligence based UAV Systems
### Embodied Perception
| Title | Type | Publication | Code |
|---|---|---|---|

### Embodied Collaboration
| Title | Type | Publication | Code |
|---|---|---|---|
"""

import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

# Default paths
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
PAPERS_JSON_PATH = REPO_ROOT / "data" / "papers.json"
README_PATH = REPO_ROOT / "README.md"

CATEGORY_ORDER = [
    "Embodied Perception",
    "Embodied Collaboration",
    "Embodied Navigation",
    "Embodied Manipulation",
]


def escape_md(text: Optional[str]) -> str:
    """Escape pipe characters and normalize newlines for Markdown tables."""
    if not text:
        return ""
    text = text.replace("\r\n", " ").replace("\n", " ").replace("\r", " ")
    text = text.replace("|", r"\|")
    return text.strip()


def is_abnormal_method_name(method_name: Optional[str], title: str) -> bool:
    """
    Check if method name is dirty/abnormal:
    1. Too long (> 40 chars)
    2. Contains Chinese commentary
    3. Contains commentary keywords ('不应该纳入', '不属于', '原因', '我认为', '备注', 'benchmark', '说明', etc.)
    4. Identical to title
    """
    if not method_name:
        return True
    m = method_name.strip()
    t = title.strip()
    if m.lower() == t.lower():
        return True
    if len(m) > 40:
        return True
    noise_keywords = [
        "不应该纳入", "不属于", "原因", "我认为", "备注",
        "基准", "benchmark", "说明", "属于", "统一", "包含", "体现在", "我感觉"
    ]
    if any(k in m for k in noise_keywords):
        return True
    if re.search(r"[\u4e00-\u9fa5]", m):
        return True
    return False


def format_title_cell(method_name: Optional[str], title: str) -> str:
    """
    Format Title column as 'Method (Title)' or just 'Title'.
    If method_name is abnormal, only use Title.
    """
    title_clean = escape_md(title)
    if not is_abnormal_method_name(method_name, title):
        method_clean = escape_md(method_name)
        return f"{method_clean} ({title_clean})"
    return title_clean


def format_type_cell(method_tags: Optional[str]) -> str:
    """Format Type column."""
    if not method_tags or not method_tags.strip():
        return "-"
    type_clean = escape_md(method_tags)
    return type_clean if type_clean else "-"


def format_pub_cell(publication: Optional[str], paper_url: Optional[str]) -> str:
    """
    Format Publication column following UAVs_Meet_LLMs:
    [ _Venue Year_ ](url) or Venue Year
    """
    if not publication or not publication.strip():
        pub_text = "-"
    else:
        pub_text = escape_md(publication)

    if paper_url and paper_url.strip():
        url_clean = paper_url.strip()
        return f"[ _{pub_text}_ ]({url_clean})"
    return pub_text


def format_code_cell(code_url: Optional[str]) -> str:
    """
    Format Code column following UAVs_Meet_LLMs:
    [ _GitHub_ ](url) or [ _Code_ ](url) or '-'
    """
    if not code_url or not code_url.strip():
        return "-"
    url = code_url.strip()
    if "github.com" in url.lower():
        return f"[ _GitHub_ ]({url})"
    return f"[ _Code_ ]({url})"


def build_paper_row(paper: Dict[str, Any]) -> str:
    """Build a single Markdown table row for a paper."""
    title_col = format_title_cell(paper.get("method_name"), paper.get("title", ""))
    type_col = format_type_cell(paper.get("method_tags"))
    pub_col = format_pub_cell(paper.get("publication"), paper.get("paper_url"))
    code_col = format_code_cell(paper.get("code_url"))

    return f"| {title_col} | {type_col} | {pub_col} | {code_col} |"


def generate_papers_markdown(papers: List[Dict[str, Any]]) -> str:
    """Group papers by survey_category, sort by year descending, and render Markdown tables."""
    categories: Dict[str, List[Dict[str, Any]]] = {}
    for p in papers:
        cat = p.get("survey_category", "Embodied Perception")
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(p)

    md_lines = []
    md_lines.append("## Advances of Embodied Intelligence based UAV Systems")
    md_lines.append("")

    # Render according to CATEGORY_ORDER first, then any other categories
    sorted_cats = [c for c in CATEGORY_ORDER if c in categories] + [
        c for c in categories if c not in CATEGORY_ORDER
    ]

    for cat_name in sorted_cats:
        cat_papers = categories[cat_name]
        # Sort papers: 1) Year descending (None at end), 2) Original Excel row ascending
        def sort_key(p):
            year = p.get("year")
            y_val = -year if year is not None else 9999
            return (y_val, p.get("excel_row", 0))

        cat_papers.sort(key=sort_key)

        md_lines.append(f"### {cat_name}")
        md_lines.append("")
        md_lines.append("| Title | Type | Publication | Code |")
        md_lines.append("|---|---|---|---|")
        for p in cat_papers:
            md_lines.append(build_paper_row(p))
        md_lines.append("")

    return "\n".join(md_lines)


def get_default_readme_template() -> str:
    """Return the default template for README.md matching UAVs_Meet_LLMs style."""
    return """<h1 align="center">
  🚁 UAVs Meet Embodied Intelligence 🚀
</h1>

<p align="center">
  <a href="https://awesome.re" target="_blank">
    <img src="https://awesome.re/badge.svg" alt="Awesome Badge"/>
  </a>
  <img src="https://img.shields.io/badge/Maintain-Active-8A2BE2?style=flat-square&logo=github&logoColor=white" alt="Maintain Badge"/>
  <a href="http://makeapullrequest.com" target="_blank">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PR's Welcome"/>
  </a>
</p>

<p align="center">
  <strong>Where Unmanned Aerial Vehicles Take Off and Embodied Intelligence Unfolds!</strong>
</p>

---

## 🏡 About

This repository accompanies our ongoing survey on **"UAVs Meet Embodied Intelligence"**.

It provides a structured, curated collection of research literature on Embodied Intelligence for Unmanned Aerial Vehicles (UAVs), spanning active perception, embodied navigation, manipulation, and multi-agent collaboration.

If you find this repository useful, please consider starring ⭐ this repo!

---

<!-- PAPERS_START -->
<!-- PAPERS_END -->

---

## 🤝 Contributing

We warmly welcome contributions! If you have authored or discovered a paper relevant to UAV Embodied Intelligence, please feel free to:

1. Open an **Issue** with paper details.
2. Submit a **Pull Request** updating the papers or suggestions.

---

## 👥 Contributors & Acknowledgement

Maintained by the UAV Embodied Intelligence Survey Team.
"""


def update_readme(papers_json_path: Path, readme_path: Path):
    """Update README.md with generated paper tables."""
    if not papers_json_path.exists():
        raise FileNotFoundError(f"Papers JSON file not found at: {papers_json_path}")

    with open(papers_json_path, "r", encoding="utf-8") as f:
        papers = json.load(f)

    generated_md = generate_papers_markdown(papers)

    base_template = get_default_readme_template()

    start_marker = "<!-- PAPERS_START -->"
    end_marker = "<!-- PAPERS_END -->"

    pattern = re.compile(
        rf"({re.escape(start_marker)})(.*?)({re.escape(end_marker)})",
        re.DOTALL
    )
    new_content = pattern.sub(
        lambda m: f"{m.group(1)}\n\n{generated_md}\n{m.group(3)}",
        base_template
    )

    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"Successfully updated {readme_path}")


def main():
    json_path = Path(sys.argv[1]) if len(sys.argv) > 1 else PAPERS_JSON_PATH
    readme_path = Path(sys.argv[2]) if len(sys.argv) > 2 else README_PATH

    update_readme(json_path, readme_path)


if __name__ == "__main__":
    main()

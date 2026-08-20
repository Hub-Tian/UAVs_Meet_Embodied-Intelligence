#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extract_papers.py

Extracts Embodied Perception papers from the Excel spreadsheet into a structured JSON file: data/papers.json.
Stores survey_category, method_tags, publication, and link info.
"""

import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional
import pandas as pd

# Default paths
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
DEFAULT_EXCEL_PATH = REPO_ROOT.parent / "具身无人机综述撰写 副本 (1)_整理版.xlsx"
OUTPUT_JSON_PATH = REPO_ROOT / "data" / "papers.json"

# Affirmative values for inclusion
POSITIVE_INCLUSION_VALUES = {"是", "yes", "√", "1", "纳入", "true"}

SHEET_TO_CATEGORY = {
    "具身感知文献汇总表": "Embodied Perception",
    "具身协同文献汇总表": "Embodied Collaboration",
    "具身导航文献汇总表": "Embodied Navigation",
    "具身抓取文献汇总表": "Embodied Manipulation",
}


def clean_str(val: Any) -> Optional[str]:
    """Clean string value, returning None if empty or invalid."""
    if val is None or pd.isna(val):
        return None
    s = str(val).strip()
    if s.lower() in {"nan", "none", "null", "n/a", "无", "-", "/"}:
        return None
    return s


def is_included(val: Any) -> bool:
    """Check whether a paper is included in the survey."""
    if val is None or pd.isna(val):
        return False
    s = str(val).strip().lower()
    return s in POSITIVE_INCLUSION_VALUES


def extract_year(pub_str: Optional[str], date_str: Optional[str]) -> Optional[int]:
    """Extract 4-digit publication/submission year."""
    if pub_str:
        m = re.search(r"\b(19\d\d|20\d\d)\b", pub_str)
        if m:
            return int(m.group(1))
    if date_str:
        m = re.search(r"\b(19\d\d|20\d\d)\b", date_str)
        if m:
            return int(m.group(1))
    return None


def format_publication(pub_str: Optional[str], year: Optional[int]) -> Optional[str]:
    """Format publication venue with year."""
    if not pub_str:
        return f"{year}" if year else None
    
    pub = pub_str.strip()
    if pub.lower() == "arxiv":
        pub = "arXiv"
    
    if year and not re.search(r"\b(19\d\d|20\d\d)\b", pub):
        return f"{pub} {year}"
    return pub


def clean_method_tags(tag_str: Optional[str]) -> Optional[str]:
    """Clean method tags: normalize delimiters, trim whitespace."""
    if not tag_str:
        return None
    # Replace Chinese commas/delimiters with comma
    cleaned = tag_str.replace("，", ", ").replace("、", ", ").replace(";", ", ").replace("；", ", ")
    tokens = [t.strip() for t in cleaned.split(",") if t.strip()]
    if not tokens or all(t.lower() in {"nan", "none", "无", "-"} for t in tokens):
        return None
    return ", ".join(tokens)


def extract_papers_from_excel(
    excel_path: Path,
    sheet_name: str = "具身感知文献汇总表"
) -> List[Dict[str, Any]]:
    """Extract and validate paper records from the specified Excel sheet."""
    if not excel_path.exists():
        raise FileNotFoundError(f"Excel file not found at: {excel_path}")

    survey_category = SHEET_TO_CATEGORY.get(sheet_name, "Embodied Perception")

    df = pd.read_excel(excel_path, sheet_name=sheet_name)
    papers = []
    issues = []

    print(f"Reading sheet: '{sheet_name}' from {excel_path.name}...")
    print(f"Survey category: '{survey_category}'")
    print(f"Total rows in sheet: {len(df)}")

    for idx, row in df.iterrows():
        row_num = idx + 2  # Excel 1-based index + header
        
        # 1. Inclusion check
        raw_include = row.get("是否纳入综述")
        if not is_included(raw_include):
            print(f"[Row {row_num}] Skipped: 是否纳入综述 = {raw_include}")
            continue

        # 2. Title & Method Name
        raw_title = clean_str(row.get("论文名称"))
        raw_method = clean_str(row.get("方法名称"))

        if not raw_title:
            issues.append(f"[Row {row_num}] Critical: 论文名称 is empty!")
            continue

        # 3. Tags & Date & URLs
        method_tags = clean_method_tags(clean_str(row.get("方法标签")))
        raw_task_tags = clean_str(row.get("任务标签"))

        raw_date = clean_str(row.get("日期"))
        raw_pub = clean_str(row.get("发表情况"))
        raw_paper_url = clean_str(row.get("论文访问链接"))
        raw_code_url = clean_str(row.get("代码链接（如果有的话）"))

        year = extract_year(raw_pub, raw_date)
        pub_formatted = format_publication(raw_pub, year)

        if not pub_formatted:
            issues.append(f"[Row {row_num}] Warning: Publication info missing for '{raw_title}'")
        if not year:
            issues.append(f"[Row {row_num}] Warning: Year could not be determined for '{raw_title}'")

        if raw_paper_url and not (raw_paper_url.startswith("http://") or raw_paper_url.startswith("https://")):
            issues.append(f"[Row {row_num}] Warning: Abnormal paper URL '{raw_paper_url}'")
        if raw_code_url and not (raw_code_url.startswith("http://") or raw_code_url.startswith("https://")):
            issues.append(f"[Row {row_num}] Warning: Abnormal code URL '{raw_code_url}'")

        paper_obj = {
            "title": raw_title,
            "method_name": raw_method,
            "survey_category": survey_category,
            "method_tags": method_tags if method_tags else "",
            "task_tags": raw_task_tags if raw_task_tags else "",
            "year": year,
            "publication": pub_formatted,
            "paper_url": raw_paper_url,
            "code_url": raw_code_url,
            "excel_row": row_num
        }
        papers.append(paper_obj)

    seen_titles = {}
    for p in papers:
        norm_title = re.sub(r"\s+", " ", p["title"].strip().lower())
        if norm_title in seen_titles:
            issues.append(
                f"Duplicate title found: '{p['title']}' (Rows {seen_titles[norm_title]} and {p['excel_row']})"
            )
        else:
            seen_titles[norm_title] = p["excel_row"]

    print(f"Extracted {len(papers)} papers successfully.")
    if issues:
        print("\n--- Data Quality Check Issues ---")
        for iss in issues:
            print("  - " + iss)
        print("---------------------------------\n")

    return papers


def main():
    excel_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_EXCEL_PATH
    output_path = OUTPUT_JSON_PATH
    output_path.parent.mkdir(parents=True, exist_ok=True)

    papers = extract_papers_from_excel(excel_path)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(papers, f, ensure_ascii=False, indent=2)

    print(f"Saved papers data to {output_path}")


if __name__ == "__main__":
    main()

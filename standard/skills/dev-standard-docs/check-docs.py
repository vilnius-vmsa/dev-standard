#!/usr/bin/env python3
"""Checks links and code paths in a repository's documentation.

Ships with the dev-standard-docs skill. Run it from the repository root:

    python3 .agents/skills/dev-standard-docs/check-docs.py [PATH ...]

Without PATH it checks README.md, AGENTS.md and every Markdown file under docs/.
Outside fenced code blocks it reports:
  - relative links and images whose target does not exist,
  - #anchors that match no heading in the linked Markdown file,
  - links and backticked paths that point at a line number,
  - backticked paths such as `src/Service/Foo.php` whose first folder exists at the
    repository root but whose file or folder does not (paths git ignores, such as
    generated local keys, are skipped).
Python standard library only.
"""
import argparse
import pathlib
import re
import subprocess
import sys
import unicodedata
from urllib.parse import unquote

DEFAULT_TARGETS = ["README.md", "AGENTS.md", "docs"]
FENCE = re.compile(r"^\s*(`{3,}|~{3,})")
HEADING = re.compile(r"^#{1,6}\s+(.+?)\s*#*\s*$")
HTML_ANCHOR = re.compile(r"<a\s+[^>]*(?:id|name)=[\"']([^\"']+)[\"']")
CODE_SPAN = re.compile(r"`([^`]+)`")
LINK = re.compile(r"\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+\"[^\"]*\")?\s*\)")
SCHEME = re.compile(r"^[a-zA-Z][a-zA-Z0-9+.-]*:")
LINE_ANCHOR = re.compile(r"^L\d+")
LINE_SUFFIX = re.compile(r":\d+(?:-\d+)?$")
NOT_A_PATH = re.compile(r"[\s*{}<>$]")


def slug(heading):
    """The id GitHub gives a heading: lower case, letters, digits, marks, '-' and '_' kept, spaces to '-'."""
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", heading).strip().lower()
    kept = "".join(ch for ch in text if ch in " -_" or unicodedata.category(ch)[0] in "LNM")
    return kept.replace(" ", "-")


def prose_lines(path):
    """(line number, line) for every line outside fenced code blocks."""
    opener = None
    for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        match = FENCE.match(line)
        if match:
            fence = match.group(1)
            if opener is None:
                opener = fence
            elif fence[0] == opener[0] and len(fence) >= len(opener):
                opener = None
            continue
        if opener is None:
            yield number, line


_anchors = {}


def anchors(path):
    if path not in _anchors:
        html, headings, seen = set(), set(), {}
        for _, line in prose_lines(path):
            html.update(HTML_ANCHOR.findall(line))
            match = HEADING.match(line)
            if match:
                base = slug(match.group(1))
                candidate = base
                while candidate in headings:
                    seen[base] = seen.get(base, 0) + 1
                    candidate = f"{base}-{seen[base]}"
                headings.add(candidate)
        _anchors[path] = html | headings
    return _anchors[path]


def check_link(root, doc, target):
    path_part, _, anchor = target.partition("#")
    if LINE_ANCHOR.match(anchor):
        return f"links to a line number ({target}); reference the path and symbol instead"
    path_part = unquote(path_part.partition("?")[0])
    if not path_part:
        resolved = doc
    elif path_part.startswith("/"):
        resolved = root / path_part.lstrip("/")
    else:
        resolved = doc.parent / path_part
    if not resolved.exists():
        return f"broken link {target}"
    if anchor and resolved.suffix == ".md" and unquote(anchor) not in anchors(resolved.resolve()):
        return f"no heading for #{anchor} in {path_part or doc.name}"
    return None


def git_ignores(root, path):
    try:
        return subprocess.run(["git", "check-ignore", "-q", "--no-index", path], cwd=root).returncode == 0
    except OSError:
        return False


def check_code_path(root, top_dirs, token):
    if NOT_A_PATH.search(token) or "/" not in token or token.split("/", 1)[0] not in top_dirs:
        return None
    if LINE_ANCHOR.match(token.partition("#")[2]):
        return f"refers to a line number ({token}); reference the path and symbol instead"
    token = re.split(r"::|#", token, maxsplit=1)[0]
    if LINE_SUFFIX.search(token):
        return f"refers to a line number ({token}); reference the path and symbol instead"
    if (root / token).exists() or git_ignores(root, token):
        return None
    return f"missing path {token}"


def check_doc(root, top_dirs, doc):
    errors = []
    rel = doc.relative_to(root).as_posix()
    for number, line in prose_lines(doc):
        for token in CODE_SPAN.findall(line):
            problem = check_code_path(root, top_dirs, token.strip())
            if problem:
                errors.append(f"{rel}:{number}: {problem}")
        for target in LINK.findall(CODE_SPAN.sub("", line)):
            if SCHEME.match(target):
                continue
            problem = check_link(root, doc, target)
            if problem:
                errors.append(f"{rel}:{number}: {problem}")
    return errors


def collect(root, targets, explicit):
    docs, errors = [], []
    for target in targets:
        path = root / target
        if path.is_dir():
            docs.extend(sorted(path.rglob("*.md")))
        elif path.is_file():
            docs.append(path)
        elif explicit:
            errors.append(f"{target}: not found")
    return docs, errors


def main():
    parser = argparse.ArgumentParser(description="Check links and code paths in documentation.")
    parser.add_argument("--root", default=".", help="repository root (default: current directory)")
    parser.add_argument("paths", nargs="*", help="files or folders to check (default: README.md, AGENTS.md, docs/)")
    args = parser.parse_args()
    root = pathlib.Path(args.root).resolve()
    top_dirs = {p.name for p in root.iterdir() if p.is_dir() and p.name != ".git"}
    docs, errors = collect(root, args.paths or DEFAULT_TARGETS, explicit=bool(args.paths))
    for doc in docs:
        errors.extend(check_doc(root, top_dirs, doc))
    print("\n".join(errors) if errors else f"docs ok ({len(docs)} files)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())

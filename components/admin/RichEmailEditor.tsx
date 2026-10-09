"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A visual editor for an email message.
 *
 * What you see is the message as it will read: type into it, and use the bar
 * for bold, headings, lists, links and buttons. The output is still HTML, but
 * nobody has to write any. "Edit HTML" stays available for the rare case that
 * needs it.
 *
 * Mail clients ignore stylesheets, so every element has to carry its own
 * styles. The editor adds them as it goes: anything the browser creates bare
 * (a new paragraph, a list) is given the email's inline styles, which is also
 * why the editing area looks the same as the delivered mail.
 */
const FONT = "font-family:Inter,'Segoe UI',Arial,sans-serif";
const INK = "#16202B";
const ORANGE = "#F1531E";

const STYLE: Record<string, string> = {
  P: `margin:0 0 16px;${FONT};font-size:16px;line-height:1.65;color:${INK}`,
  DIV: `margin:0 0 16px;${FONT};font-size:16px;line-height:1.65;color:${INK}`,
  H2: `margin:0 0 16px;${FONT};font-size:22px;line-height:1.25;font-weight:800;letter-spacing:-0.01em;color:${INK}`,
  UL: `margin:0 0 16px;padding-left:24px;list-style:disc;${FONT};font-size:16px;line-height:1.65;color:${INK}`,
  OL: `margin:0 0 16px;padding-left:24px;list-style:decimal;${FONT};font-size:16px;line-height:1.65;color:${INK}`,
  LI: `margin:0 0 6px`,
  A: `color:${ORANGE};text-decoration:underline`,
};
const BUTTON = `display:inline-block;background:${ORANGE};color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:999px;${FONT};font-size:15px;font-weight:600`;

function addStyles(root: HTMLElement) {
  root.querySelectorAll("p,div,h2,ul,ol,li,a").forEach((el) => {
    if (!el.getAttribute("style")) el.setAttribute("style", STYLE[el.tagName] ?? "");
  });
}

const escapeText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const withScheme = (url: string) => (/^(https?:|mailto:|tel:|\{\{)/i.test(url) ? url : `https://${url}`);

export default function RichEmailEditor({
  value,
  onChange,
  fields,
  minHeight = 300,
}: {
  value: string;
  onChange: (html: string) => void;
  /** placeholder name -> what it stands for; offered under "Insert field" */
  fields?: Record<string, string>;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  /* What this editor last reported. A `value` that differs came from outside
     (a template was chosen, the AI drafted something) and has to be shown. */
  const last = useRef<string | null>(null);
  const [raw, setRaw] = useState(false);

  useEffect(() => {
    try { document.execCommand("defaultParagraphSeparator", false, "p"); } catch { /* unsupported */ }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || raw || value === last.current) return;
    /* Never left truly empty: with a paragraph in place, typing starts inside
       a block instead of as loose text in the editor itself. */
    el.innerHTML = value.trim() ? value : `<p style="${STYLE.P}"><br></p>`;
    last.current = value;
  }, [value, raw]);

  function emit() {
    const el = ref.current;
    if (!el) return;
    addStyles(el);
    last.current = el.innerHTML;
    onChange(el.innerHTML);
  }

  function run(command: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  }

  /* Headings and lists are done by hand rather than with execCommand. The
     browser's own versions nest blocks inside each other (a list inside a
     paragraph, a heading inside a heading), which mail clients then render
     however they please. Here the message is always a flat run of blocks, and
     these two operations swap one kind of block for another. */

  /** The top-level blocks the selection touches, after tidying loose text into paragraphs. */
  function selectedBlocks(): HTMLElement[] {
    const el = ref.current;
    const sel = window.getSelection();
    if (!el || !sel || !sel.rangeCount || !el.contains(sel.anchorNode)) return [];
    const range = sel.getRangeAt(0);
    const INLINE = /^(B|I|A|SPAN|STRONG|EM|U|BR|FONT)$/;
    let open: HTMLElement | null = null;
    for (const node of [...el.childNodes]) {
      const loose = node.nodeType === Node.TEXT_NODE ? Boolean(node.textContent?.trim()) : node instanceof HTMLElement && INLINE.test(node.tagName);
      if (!loose) { open = null; if (node.nodeType === Node.TEXT_NODE) node.remove(); continue; }
      if (!open) { open = document.createElement("p"); open.setAttribute("style", STYLE.P); el.insertBefore(open, node); }
      open.appendChild(node);
    }
    return ([...el.children] as HTMLElement[]).filter((c) => range.intersectsNode(c));
  }

  function caretTo(node: Node | null) {
    if (!node) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  function retag(el: HTMLElement, tag: string): HTMLElement {
    const next = document.createElement(tag);
    next.setAttribute("style", STYLE[tag.toUpperCase()]);
    while (el.firstChild) next.appendChild(el.firstChild);
    el.replaceWith(next);
    return next;
  }

  function heading() {
    ref.current?.focus();
    const blocks = selectedBlocks().filter((b) => /^(P|H2|DIV)$/.test(b.tagName));
    if (!blocks.length) return;
    const to = blocks.every((b) => b.tagName === "H2") ? "p" : "h2";
    const done = blocks.map((b) => retag(b, to));
    caretTo(done[done.length - 1]);
    emit();
  }

  function list(tag: "ul" | "ol") {
    ref.current?.focus();
    const blocks = selectedBlocks().filter((b) => /^(P|H2|DIV|UL|OL)$/.test(b.tagName));
    if (!blocks.length) return;
    const T = tag.toUpperCase();
    let last: HTMLElement | null = null;

    if (blocks.every((b) => b.tagName === T)) {
      /* Already this kind of list: turn each item back into a paragraph. */
      for (const l of blocks) {
        for (const li of [...l.children] as HTMLElement[]) {
          const para = document.createElement("p");
          para.setAttribute("style", STYLE.P);
          while (li.firstChild) para.appendChild(li.firstChild);
          l.before(para);
          last = para;
        }
        l.remove();
      }
    } else {
      const made = document.createElement(tag);
      made.setAttribute("style", STYLE[T]);
      blocks[0].before(made);
      for (const b of blocks) {
        const sources = /^(UL|OL)$/.test(b.tagName) ? ([...b.children] as HTMLElement[]) : [b];
        for (const src of sources) {
          const li = document.createElement("li");
          li.setAttribute("style", STYLE.LI);
          while (src.firstChild) li.appendChild(src.firstChild);
          made.appendChild(li);
          last = li;
        }
        b.remove();
      }
    }
    caretTo(last);
    emit();
  }

  function link() {
    const url = prompt("Link address", "https://");
    if (!url || url === "https://") return;
    if (window.getSelection()?.isCollapsed) run("insertHTML", `<a href="${escapeText(withScheme(url))}" style="${STYLE.A}">${escapeText(url)}</a>`);
    else run("createLink", withScheme(url));
  }

  function button() {
    const label = prompt("Button text", "Learn more");
    if (!label) return;
    const url = prompt("Where should the button go?", "https://");
    if (!url || url === "https://") return;
    run("insertHTML", `<p style="${STYLE.P}"><a href="${escapeText(withScheme(url))}" style="${BUTTON}">${escapeText(label)}</a></p><p style="${STYLE.P}"><br></p>`);
  }

  const tool = "h-8 min-w-8 px-2.5 rounded-lg text-sm text-ink/80 hover:bg-paper-tint hover:text-brand transition-colors";
  /* mousedown, not click: a click would first move focus to the button and the
     selection in the message would be gone before the command ran. */
  const press = (fn: () => void) => (e: React.MouseEvent) => { e.preventDefault(); fn(); };

  return (
    <div className="border border-line rounded-xl overflow-hidden bg-surface focus-within:border-brand transition-colors">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line px-2 py-1.5">
        {!raw && (
          <>
            <button type="button" title="Bold" className={`${tool} font-bold`} onMouseDown={press(() => run("bold"))}>B</button>
            <button type="button" title="Italic" className={`${tool} italic`} onMouseDown={press(() => run("italic"))}>I</button>
            <button type="button" title="Heading" className={tool} onMouseDown={press(heading)}>Heading</button>
            <span className="mx-1 h-5 w-px bg-line" />
            <button type="button" title="Bulleted list" className={tool} onMouseDown={press(() => list("ul"))}>• List</button>
            <button type="button" title="Numbered list" className={tool} onMouseDown={press(() => list("ol"))}>1. List</button>
            <span className="mx-1 h-5 w-px bg-line" />
            <button type="button" title="Link" className={tool} onMouseDown={press(link)}>Link</button>
            <button type="button" title="Button" className={tool} onMouseDown={press(button)}>Button</button>
            {fields && Object.keys(fields).length > 0 && (
              <select
                aria-label="Insert field"
                className="h-8 rounded-lg bg-transparent px-2 text-sm text-ink/80 hover:bg-paper-tint cursor-pointer"
                value=""
                onChange={(e) => { if (e.target.value) run("insertText", `{{${e.target.value}}}`); }}
              >
                <option value="">Insert field…</option>
                {Object.entries(fields).map(([k, hint]) => <option key={k} value={k}>{hint}</option>)}
              </select>
            )}
            <button type="button" title="Remove formatting" className={tool} onMouseDown={press(() => run("removeFormat"))}>Clear</button>
          </>
        )}
        <button type="button" className={`${tool} ml-auto text-xs text-graphite`} onClick={() => setRaw((r) => !r)}>
          {raw ? "Back to visual editor" : "Edit HTML"}
        </button>
      </div>

      {raw ? (
        <textarea
          className="block w-full bg-surface px-4 py-3 font-mono text-xs text-ink focus:outline-none"
          style={{ minHeight }}
          value={value}
          onChange={(e) => { last.current = null; onChange(e.target.value); }}
        />
      ) : (
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Message"
          onInput={emit}
          onBlur={emit}
          className="bg-white px-6 py-5 focus:outline-none overflow-auto"
          style={{ minHeight, fontFamily: "Inter,'Segoe UI',Arial,sans-serif", fontSize: 16, lineHeight: 1.65, color: INK }}
        />
      )}
    </div>
  );
}

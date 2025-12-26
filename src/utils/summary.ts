export function getSummary(
  body: string,
  max = 140
): string {
    const text = body
        // 3. 去 Markdown 图片（行内）
        .replace(/!\[[^\]]*?\]\([^)]+?\)/g, '')
        // 4. 去 Markdown 图片（引用式）
        .replace(/!\[[^\]]*?\]\[[^\]]*?\]/g, '')
        .replace(/^\[[^\]]+?\]:\s*.+$/gm, '')
        // 去代码块
        .replace(/```[\s\S]*?```/g, '')
        // 去 markdown 标记（保守）
        .replace(/[#>*_`[\]()-]/g, '')
        // 压缩空白
        .replace(/\s+/g, ' ')
        .trim();

    return text.length > max
        ? text.slice(0, max) + '…'
        : text;
}

import React, {type ReactElement, type ReactNode, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import styles from "./Messages.module.scss";
import SvgButton from "../../../../components/SvgButton/SvgButton.tsx";
import {ChevronDown, Copy, Download} from "lucide-react";
import {AnimatePresence, motion} from "motion/react";
import {useTranslation} from "react-i18next";
import 'highlight.js/styles/github-dark.css';
import remarkGfm from "remark-gfm";
import { remarkStripFilename } from './remark-strip-filename';
import type { Element } from 'hast';

type MarkdownRendererProps = {
    content: string;
};

type CodeProps = {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    node?: Element & {
        data?: {
            meta?: string | null;
        };
    };
} & React.HTMLAttributes<HTMLElement>;

const extensionMap: Record<string, string> = {
    javascript: 'js',
    js: 'js',
    typescript: 'ts',
    ts: 'ts',
    python: 'py',
    bash: 'sh',
    shell: 'sh',
    html: 'html',
    css: 'css',
    json: 'json',
    xml: 'xml',
    java: 'java',
    csharp: 'cs',
    cpp: 'cpp',
    plaintext: 'txt',
    text: 'txt',
    tsx: 'tsx',
    jsx: 'jsx',
    go: 'go',
    rust: 'rs',
    php: 'php',
    ruby: 'rb',
    yaml: 'yml',
    markdown: 'md',
    sql: 'sql',
    dockerfile: 'dockerfile',
};

const CodeBlock: React.FC<CodeProps> = ({ inline, className, children, ...props }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isCodeOpen, setIsCodeOpen] = useState(true);
    const { t } = useTranslation();
    const language = className?.match(/language-([\w-]+)/)?.[1] || 'plaintext';

    const meta = props.node?.data?.meta;
    let filename = 'code.txt';

    if (meta) {
        const match = meta.match(/filename="([^"]+)"/);
        if (match) {
            filename = match[1];
        } else {
            if (language in extensionMap) {
                filename = `code.${extensionMap[language]}`;
            }
        }
    } else {
        if (language in extensionMap) {
            filename = `code.${extensionMap[language]}`;
        }
    }

    function extractText(node: ReactNode): string {
        if (typeof node === 'string') return node;
        if (Array.isArray(node)) return node.map(extractText).join('');
        if (React.isValidElement(node)) {
            const element = node as ReactElement<{ children?: ReactNode }>;
            if (element.props.children) {
                return extractText(element.props.children);
            }
        }
        return '';
    }

    const code = extractText(children).trimEnd();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    const downloadCode = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (inline) {
        return <code className={className} {...props}>{children}</code>;
    }

    if (language === 'plaintext') {
        return (
            <pre className={styles.inlineCode} {...props}>
                <code>{children}</code>
            </pre>
        );
    }

    return (
        <div className={styles.codeMessage} style={{ position: 'relative' }}>
            <div className={styles.topBar}>
                <span className={styles.topBarLeft}>
                    <motion.div
                        initial={isCodeOpen ? { rotate: 0 } : { rotate: 180 }}
                        animate={isCodeOpen ? { rotate: 0 } : { rotate: 180 }}
                        className={styles.toggleButtonWrapper}
                    >
                        <SvgButton className={styles.toggleButton} onClick={() => setIsCodeOpen(!isCodeOpen)} aria-label={t('aria.button_toggle_code_visibility')} title={t('aria.button_toggle_code_visibility')}>
                            <ChevronDown />
                        </SvgButton>
                    </motion.div>
                    <span className={styles.languageName}>{language}</span>
                </span>
                <span className={styles.filename}>
                      {filename !== `code.${extensionMap[language]}` && filename !== 'code.txt' ? filename : ''}
                </span>
                <motion.div className={styles.toolsButtonContainer} layout>
                    <motion.span layout>
                        <SvgButton
                            onClick={downloadCode}
                            className={styles.toolsButton}
                            aria-label={t('aria.button_download_code')}
                            title={t('aria.button_download_code')}
                        >
                            <Download />
                        </SvgButton>
                        <SvgButton
                            onClick={copyToClipboard}
                            className={styles.toolsButton}
                            aria-label={t('aria.button_copy_message')}
                            title={t('aria.button_copy_message')}
                        >
                            <Copy />
                        </SvgButton>
                    </motion.span>

                    <AnimatePresence>
                        {isCopied && (
                            <motion.span
                                className={styles.copiedMessage}
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                            >
                                {t('copied')}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
            <AnimatePresence>
                <motion.div
                    initial={{ height: isCodeOpen ? 'auto' : 0 }}
                    animate={{ height: isCodeOpen ? 'auto' : 0 }}
                    className={styles.codeMessageContentWrapper}
                >

                    <pre className={`${className} ${styles.codeMessageContent}`} {...props}>
                        <code className={className}>{children}</code>
                    </pre>
                </motion.div>
            </AnimatePresence>
        </div>
        );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => (
    <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm, remarkStripFilename]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
            code: CodeBlock,
            table: ({ children }) => (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        {children}
                    </table>
                </div>
            ),
        }}
    >
        {content}
    </ReactMarkdown>
);
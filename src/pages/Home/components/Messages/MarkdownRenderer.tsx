import React, {type ReactNode, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import styles from "./Messages.module.scss";
import SvgButton from "../../../../components/SvgButton/SvgButton.tsx";
import {Copy} from "lucide-react";
import {AnimatePresence, motion} from "motion/react";
import {useTranslation} from "react-i18next";

type MarkdownRendererProps = {
    content: string;
};

type CodeProps = {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

const CodeBlock: React.FC<CodeProps> = ({ inline, className, children, ...props }) => {
    const [isCopied, setIsCopied] = useState(false);
    const { t } = useTranslation();

    function extractText(node: ReactNode): string {
        if (typeof node === 'string') return node;
        if (Array.isArray(node)) return node.map(extractText).join('');
        if (typeof node === 'object' && node && 'props' in node) {
            return extractText((node as any).props.children);
        }
        return '';
    }

    const code = extractText(children);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    if (inline) {
        return <code className={className} {...props}>{children}</code>;
    }

    const language = className?.match(/language-([\w-]+)/)?.[1] || 'plaintext';

    if(language == "plaintext") {
        return (
            <div className={styles.codeMessage} style={{ position: 'relative' }}>
                <div className={styles.topBar}>
                    <span className={styles.languageName}>{language}</span>
                    <motion.div className={styles.copyContainer} layout>
                        <motion.span layout>
                            <SvgButton
                                onClick={copyToClipboard}
                                className={styles.copyButton}
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
                <pre className={`${className} ${styles.codeMessageContent}`} {...props}>
                    <code className={className}>{children}</code>
                </pre>
            </div>
            );
    } else {
        <pre className={`${className} ${styles.codeMessageContent}`} {...props}>
            <code className={className}>{children}</code>
        </pre>
    }
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => (
    <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
            code: CodeBlock,
        }}
    >
        {content}
    </ReactMarkdown>
);
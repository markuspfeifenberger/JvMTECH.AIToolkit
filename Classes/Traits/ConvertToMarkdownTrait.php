<?php
namespace JvMTECH\AIToolkit\Traits;

use Neos\Flow\Annotations as Flow;
use League\HTMLToMarkdown\Converter\TableConverter;
use League\HTMLToMarkdown\HtmlConverter;

trait ConvertToMarkdownTrait
{
    protected function convertHtmlToMarkdown(string $html): string
    {
        $converterConfig = [
            'strip_tags' => true,
            'remove_nodes' => 'script style link a img head',
            'strip_placeholder_links' => true,
            'hard_break' => true,
            'header_style' => 'atx',
        ];

        $converter = new HtmlConverter($converterConfig);
        $converter->getEnvironment()->addConverter(new TableConverter());

        $markdown = $converter->convert($html);

        // remove "- \n" and "-\n"
        $markdown = preg_replace('/- \n/', '', $markdown);
        // remove "> \n" and ">\n"
        $markdown = preg_replace('/\> \n/', '', $markdown);
        // replace multiple newlines with single newline
        $markdown = preg_replace('/\n{2,}/', "\n", $markdown);
        // remove empty double lines
        $markdown = preg_replace('/\n\n/', "\n", $markdown);

        return $markdown;
    }
}

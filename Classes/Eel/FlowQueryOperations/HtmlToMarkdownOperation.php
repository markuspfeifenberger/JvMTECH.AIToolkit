<?php
namespace JvMTECH\AIToolkit\Eel\FlowQueryOperations;

use Neos\Flow\Annotations as Flow;
use Neos\Eel\FlowQuery\FlowQuery;
use Neos\Eel\FlowQuery\Operations\AbstractOperation;
use JvMTECH\AIToolkit\Traits\ConvertToMarkdownTrait;

class HtmlToMarkdownOperation extends AbstractOperation
{
    use ConvertToMarkdownTrait;

    protected static $shortName = 'convertHtmlToMarkdown';

    protected static $final = true;

    public function canEvaluate($context)
    {
        return count($context) > 0 && is_string($context[0]);
    }

    public function evaluate(FlowQuery $flowQuery, array $arguments)
    {
        $newContext = [];

        foreach ($flowQuery->getContext() as $item) {
            $newContext[] = $this->convertHtmlToMarkdown($item);
        }

        return new FlowQuery($newContext);
    }
}

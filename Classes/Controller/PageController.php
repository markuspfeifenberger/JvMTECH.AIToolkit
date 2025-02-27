<?php
namespace JvMTECH\AIToolkit\Controller;

use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Mvc\Exception\StopActionException;

class PageController extends ActionController
{
    /**
     * @param NodeInterface $node
     * @throws StopActionException
     */
    public function renderPreviewPageAction(NodeInterface $node): void
    {
        $this->forward('preview', 'Frontend\Node', 'Neos.Neos', [
            'node' => $node,
        ]);
    }
}

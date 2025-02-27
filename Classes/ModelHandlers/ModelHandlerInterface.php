<?php
namespace JvMTECH\AIToolkit\ModelHandlers;

use Neos\Flow\Mvc\ActionRequest;

interface ModelHandlerInterface
{
    public function execute(): array;
}

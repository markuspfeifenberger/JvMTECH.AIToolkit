<?php
namespace JvMTECH\AIToolkit\ModelConnectors;

use Neos\Flow\Annotations as Flow;

abstract class AbstractModelConnector implements ModelConnectorInterface
{
    protected array $configuration;

    public function __construct(array $configuration = [])
    {
        $this->configuration = $configuration;
    }

    public function predict(string $prompt, $attachments = []): PredictionResult
    {
        if (!$this->configuration['model']) {
            throw new \InvalidArgumentException('Model not set.', 1644320989);
        }

        return PredictionResult::create('');
    }
}

<?php
namespace JvMTECH\AIToolkit\ModelConnectors;

use Neos\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 */
class ModelConnectorFactory
{
    /**
     * @Flow\InjectConfiguration(path="modelPresets")
     * @var array
     */
    protected array $modelPresets;

    /**
     * Creates an instance of AiModelConnector based on configuration
     *
     * @param string $modelPreset
     * @return ModelConnectorInterface
     * @throws \InvalidArgumentException
     */
    public function create(string $modelPreset): ModelConnectorInterface
    {
        if (!isset($this->modelPresets[$modelPreset])) {
            throw new \InvalidArgumentException(
                sprintf('Model Preset for "%s" not found.', $modelPreset),
                1644320987
            );
        }

        $className = $this->modelPresets[$modelPreset]['className'];
        if (!class_exists($className)) {
            throw new \InvalidArgumentException(
                sprintf('Model Connector class "%s" not found.', $className),
                1644320988
            );
        }

        $configuration = array_merge($this->modelPresets[$modelPreset]);

        return new $className($configuration);
    }
}

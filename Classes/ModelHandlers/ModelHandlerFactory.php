<?php
namespace JvMTECH\AIToolkit\ModelHandlers;

use Neos\Flow\Annotations as Flow;
use JvMTECH\AIToolkit\ModelConnectors\ModelConnectorFactory;
use Neos\Flow\Mvc\ActionRequest;
use Psr\Log\LoggerInterface;

/**
 * @Flow\Scope("singleton")
 */
class ModelHandlerFactory
{
    /**
     * @Flow\InjectConfiguration(path="modelHandlers")
     * @var array
     */
    protected array $modelHandlers;

    /**
     * Creates an instance of AiModelHandler based on configuration
     *
     * @param string $modelHandler
     * @param ModelConnectorFactory $modelConnectorFactory
     * @param ActionRequest $request
     * @param LoggerInterface $logger
     * @param array $overrideOptions
     * @param array $promptVariables
     * @return ModelHandlerInterface
     * @throws \InvalidArgumentException
     */
    public function create(string $modelHandler, ModelConnectorFactory $modelConnectorFactory, ActionRequest $request, LoggerInterface $logger, array $overrideOptions = [], array $promptVariables = []): ModelHandlerInterface
    {
        $className = isset($this->modelHandlers[$modelHandler]['className']) ? $this->modelHandlers[$modelHandler]['className'] : null;
        if (!class_exists($className)) {
            throw new \InvalidArgumentException(
                sprintf('Model Handler class "%s" not found.', $className),
                1739967519
            );
        }

        $defaultOptions = $this->modelHandlers[$modelHandler]['defaultOptions'] ?? [];

        return new $className($modelConnectorFactory, $request, $logger, $defaultOptions, $overrideOptions, $promptVariables);
    }
}

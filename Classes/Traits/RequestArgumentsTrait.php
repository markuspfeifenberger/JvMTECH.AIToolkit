<?php
namespace JvMTECH\AIToolkit\Traits;

use Neos\Flow\Mvc\Exception\NoSuchArgumentException;

trait RequestArgumentsTrait
{
    /**
     * @throws NoSuchArgumentException
     */
    protected function getRequestArgument(string $name, mixed $defaultValue = null): mixed
    {
        return $this->request->hasArgument($name) ? $this->request->getArgument($name) : $defaultValue;
    }

    protected function getRequestArguments(array $namesAndDefaults): array
    {
        $arguments = [];
        foreach ($namesAndDefaults as $name => $defaultValue) {
            $arguments[$name] = $this->getRequestArgument($name, $defaultValue);
        }
        return $arguments;
    }
}

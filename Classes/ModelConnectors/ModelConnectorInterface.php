<?php
namespace JvMTECH\AIToolkit\ModelConnectors;

interface ModelConnectorInterface
{
    public function predict(string $prompt, $attachments = []): PredictionResult;
}

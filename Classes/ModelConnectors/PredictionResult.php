<?php
namespace JvMTECH\AIToolkit\ModelConnectors;

class PredictionResult
{
    private string $prediction = '';
    private int $inputTokens = 0;
    private int $outputTokens = 0;

    public static function create(string $prediction): PredictionResult
    {
        return new PredictionResult($prediction);
    }

    public function __construct(string $prediction)
    {
        $this->prediction = $prediction;
    }

    public function withPrediction(string $prediction): PredictionResult
    {
        $this->prediction = $prediction;
        return $this;
    }

    public function withTokens(null|int $inputTokens = 0, null|int $outputTokens = 0): PredictionResult
    {
        $this->inputTokens = (int)$inputTokens;
        $this->outputTokens = (int)$outputTokens;
        return $this;
    }

    public function getPrediction(): string
    {
        return $this->prediction;
    }

    public function getInputTokens(): int
    {
        return $this->inputTokens;
    }

    public function getOutputTokens(): int
    {
        return $this->outputTokens;
    }

    public function toArray(): array
    {
        return [
            'prediction' => $this->getPrediction(),
            'inputTokens' => $this->getInputTokens(),
            'outputTokens' => $this->getOutputTokens(),
        ];
    }
}

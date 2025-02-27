<?php
namespace JvMTECH\AIToolkit\ModelConnectors;

use Neos\Flow\Annotations as Flow;
use GuzzleHttp\Client;

class GeminiModelConnector extends AbstractModelConnector
{
    public function predict(string $prompt, $attachments = []): PredictionResult
    {
        parent::predict($prompt, $attachments);

        $client = new Client();
        $response = $client->post('https://generativelanguage.googleapis.com/v1beta/models/' . $this->configuration['model'] . ':generateContent',
            [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'query' => [
                    'key' => $this->configuration['apiKey'],
                ],
                'json' => [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => $this->configuration['generationConfig'],
                ],
            ]);

        $result = json_decode($response->getBody()->getContents(), true);

        $text = trim($result['candidates'][0]['content']['parts'][0]['text'], '"');

        return PredictionResult::create($text)->withTokens($result['usageMetadata']['promptTokenCount'], $result['usageMetadata']['candidatesTokenCount']);
    }
}
